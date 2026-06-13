param(
  [ValidateSet('start', 'stop', 'restart', 'status')]
  [string]$Command = ''
)

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $RootDir 'backend'
$FrontendDir = Join-Path $RootDir 'frontend'
$RunDir = Join-Path $RootDir '.run'

if (-not (Test-Path $RunDir)) { New-Item -ItemType Directory -Path $RunDir -Force | Out-Null }

function Start-All {
  Write-Host 'Starting Docker Compose...'
  Push-Location $BackendDir
  docker compose up -d
  Pop-Location

  Write-Host 'Starting Backend...'
  $backendLog = Join-Path $RunDir 'backend.log'
  $backendPid = Join-Path $RunDir 'backend.pid'
  Push-Location $BackendDir
  $backendProcess = Start-PowerShell -PassThru -WindowStyle Hidden -NoNewWindow {
    Set-Location "$using:BackendDir"
    npm run dev
  }
  $backendProcess.Id | Out-File -FilePath $backendPid -Encoding ascii
  Pop-Location

  Write-Host 'Starting Frontend...'
  $frontendLog = Join-Path $RunDir 'frontend.log'
  $frontendPid = Join-Path $RunDir 'frontend.pid'
  Push-Location $FrontendDir
  $frontendProcess = Start-PowerShell -PassThru -WindowStyle Hidden -NoNewWindow {
    Set-Location "$using:FrontendDir"
    npm run dev
  }
  $frontendProcess.Id | Out-File -FilePath $frontendPid -Encoding ascii
  Pop-Location

  Write-Host "Backend: http://localhost:3000"
  Write-Host "Frontend: http://localhost:5173"
}

function Stop-All {
  Write-Host 'Stopping Frontend...'
  $frontendPid = Join-Path $RunDir 'frontend.pid'
  if (Test-Path $frontendPid) {
    $pid = Get-Content $frontendPid
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Remove-Item $frontendPid
  }

  Write-Host 'Stopping Backend...'
  $backendPid = Join-Path $RunDir 'backend.pid'
  if (Test-Path $backendPid) {
    $pid = Get-Content $backendPid
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Remove-Item $backendPid
  }

  Write-Host 'Stopping Docker Compose...'
  Push-Location $BackendDir
  docker compose down
  Pop-Location
}

function Status-All {
  $mysql = docker ps --format '{{.Names}}' 2>$null | Select-String -SimpleMatch 'mysql_docker_backend'
  if ($mysql) { Write-Host 'MySQL: running' } else { Write-Host 'MySQL: not running' }

  $backendPid = Join-Path $RunDir 'backend.pid'
  if (Test-Path $backendPid) {
    $pid = Get-Content $backendPid
    $running = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($running) { Write-Host 'Backend: running on http://localhost:3000' } else { Write-Host 'Backend: not running' }
  } else { Write-Host 'Backend: not running' }

  $frontendPid = Join-Path $RunDir 'frontend.pid'
  if (Test-Path $frontendPid) {
    $pid = Get-Content $frontendPid
    $running = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($running) { Write-Host 'Frontend: running on http://localhost:5173' } else { Write-Host 'Frontend: not running' }
  } else { Write-Host 'Frontend: not running' }
}

switch ($Command) {
  'start' { Start-All }
  'stop' { Stop-All }
  'restart' { Stop-All; Start-All }
  'status' { Status-All }
  default {
    Write-Host "1) Start"
    Write-Host "2) Stop"
    Write-Host "3) Restart"
    Write-Host "4) Status"
    $choice = Read-Host "Select an option"
    switch ($choice) {
      '1' { Start-All }
      '2' { Stop-All }
      '3' { Stop-All; Start-All }
      '4' { Status-All }
    }
  }
}
