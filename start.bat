@echo off
cd /d "%~dp0"

echo Starting MySQL...
cd backend
docker compose up -d
cd ..

echo Starting Backend...
start "Backend" cmd /c "cd /d "%~dp0backend" && npm run dev"

echo Starting Frontend...
start "Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo All services started.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
