#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
RUN_DIR="$ROOT_DIR/.run"

BACKEND_PORT="${APP_PORT:-3000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_LOG="$RUN_DIR/backend.log"
FRONTEND_LOG="$RUN_DIR/frontend.log"
BACKEND_PID="$RUN_DIR/backend.pid"
FRONTEND_PID="$RUN_DIR/frontend.pid"

NPM_BIN="$(command -v npm || true)"
CURL_BIN="$(command -v curl || true)"

info() {
  printf '%s\n' "$*"
}

warn() {
  printf 'WARN: %s\n' "$*" >&2
}

ensure_run_dir() {
  mkdir -p "$RUN_DIR"
}

ensure_npm() {
  if [[ -z "$NPM_BIN" ]]; then
    warn "npm was not found in PATH."
    return 1
  fi
}

ensure_dependencies() {
  local name="$1"
  local dir="$2"

  if [[ -d "$dir/node_modules" ]]; then
    return 0
  fi

  info "Installing $name dependencies..."
  (cd "$dir" && "$NPM_BIN" install)
}

pid_is_running() {
  local pid_file="$1"
  [[ -f "$pid_file" ]] || return 1
  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  [[ -n "$pid" ]] || return 1
  kill -0 "$pid" >/dev/null 2>&1
}

find_node_pids() {
  local dir="$1"
  pgrep -f "node.*$dir" 2>/dev/null || true
}

port_is_open() {
  local port="$1"
  [[ -n "$CURL_BIN" ]] || return 1
  "$CURL_BIN" -fsS "http://127.0.0.1:$port" >/dev/null 2>&1
}

wait_for_port() {
  local name="$1"
  local port="$2"
  local seconds="${3:-15}"
  local i
  for ((i = 1; i <= seconds; i += 1)); do
    if port_is_open "$port"; then
      info "$name is ready on http://localhost:$port"
      return 0
    fi
    sleep 1
  done
  warn "$name did not respond on http://localhost:$port within ${seconds}s."
  return 1
}

start_docker() {
  if docker info >/dev/null 2>&1; then
    info "Docker is running."
    return 0
  fi

  if command -v systemctl >/dev/null 2>&1; then
    info "Starting Docker..."
    sudo systemctl enable --now docker || return 1
  else
    warn "Docker is not running and systemctl is unavailable."
    return 1
  fi
}

docker_up() {
  info "Starting Docker Compose..."
  (cd "$BACKEND_DIR" && docker compose up -d)
}

start_service() {
  local name="$1"
  local dir="$2"
  local pid_file="$3"
  local log_file="$4"
  local port="$5"
  shift 5

  ensure_run_dir
  ensure_npm || return 1
  ensure_dependencies "$name" "$dir" || return 1

  if pid_is_running "$pid_file" || [[ -n "$(find_node_pids "$dir")" ]]; then
    info "$name is already running."
    wait_for_port "$name" "$port" 5 || true
    return 0
  fi

  info "Starting $name..."
  (
    cd "$dir" || exit 1
    setsid "$@" >"$log_file" 2>&1 < /dev/null &
    printf '%s\n' "$!" >"$pid_file"
  )

  sleep 1
  if pid_is_running "$pid_file" || [[ -n "$(find_node_pids "$dir")" ]]; then
    wait_for_port "$name" "$port" 20 || true
    if ! pid_is_running "$pid_file" && [[ -z "$(find_node_pids "$dir")" ]]; then
      warn "$name exited after startup. Check $log_file"
      return 1
    fi
    return 0
  fi

  warn "$name failed to start. Check $log_file"
  return 1
}

stop_service() {
  local name="$1"
  local dir="$2"
  local pid_file="$3"
  local pids

  pids="$(find_node_pids "$dir")"
  if pid_is_running "$pid_file"; then
    local pid
    pid="$(cat "$pid_file" 2>/dev/null || true)"
    pids="$(printf '%s\n%s\n' "$pids" "$pid" | awk 'NF && !seen[$0]++')"
  fi

  if [[ -z "$pids" ]]; then
    info "$name is not running."
    rm -f "$pid_file"
    return 0
  fi

  info "Stopping $name..."
  while IFS= read -r pid; do
    [[ -n "$pid" ]] || continue
    kill "$pid" >/dev/null 2>&1 || true
  done <<< "$pids"

  sleep 2

  while IFS= read -r pid; do
    [[ -n "$pid" ]] || continue
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
  done <<< "$pids"

  rm -f "$pid_file"
  info "$name stopped."
}

start_all() {
  local status=0
  start_docker || status=1
  docker_up || status=1
  start_service "Backend" "$BACKEND_DIR" "$BACKEND_PID" "$BACKEND_LOG" "$BACKEND_PORT" "$NPM_BIN" start || status=1
  start_service "Frontend" "$FRONTEND_DIR" "$FRONTEND_PID" "$FRONTEND_LOG" "$FRONTEND_PORT" "$NPM_BIN" run dev -- --host 0.0.0.0 || status=1
  info "Backend: http://localhost:$BACKEND_PORT"
  info "Frontend: http://localhost:$FRONTEND_PORT"
  return "$status"
}

stop_all() {
  stop_service "Frontend" "$FRONTEND_DIR" "$FRONTEND_PID"
  stop_service "Backend" "$BACKEND_DIR" "$BACKEND_PID"
  info "Docker Compose database is left running. Use 'docker compose down' in backend/ if you want to stop MySQL too."
}

status_all() {
  if docker ps --format '{{.Names}}' 2>/dev/null | grep -qx 'mysql_docker_backend'; then
    info "MySQL: running"
  else
    info "MySQL: not running"
  fi

  if pid_is_running "$BACKEND_PID" || [[ -n "$(find_node_pids "$BACKEND_DIR")" ]]; then
    info "Backend: running on http://localhost:$BACKEND_PORT"
  else
    info "Backend: not running"
  fi

  if pid_is_running "$FRONTEND_PID" || [[ -n "$(find_node_pids "$FRONTEND_DIR")" ]]; then
    info "Frontend: running on http://localhost:$FRONTEND_PORT"
  else
    info "Frontend: not running"
  fi
}

menu() {
  info "1) Start"
  info "2) Stop"
  info "3) Restart"
  info "4) Status"
  read -r -p "Select an option: " option
  case "$option" in
    1) start_all ;;
    2) stop_all ;;
    3) stop_all; start_all ;;
    4) status_all ;;
    *) warn "Invalid option."; return 1 ;;
  esac
}

case "${1:-}" in
  start) start_all ;;
  stop) stop_all ;;
  restart) stop_all; start_all ;;
  status) status_all ;;
  "") menu ;;
  *) warn "Usage: $0 [start|stop|restart|status]"; exit 1 ;;
esac
