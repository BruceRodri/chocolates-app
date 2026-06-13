@echo off
cd /d "%~dp0"

echo Stopping Backend...
taskkill /fi "WINDOWTITLE eq Backend" /f >nul 2>&1

echo Stopping Frontend...
taskkill /fi "WINDOWTITLE eq Frontend" /f >nul 2>&1

echo Stopping MySQL...
cd backend
docker compose down
cd ..

echo All services stopped.
