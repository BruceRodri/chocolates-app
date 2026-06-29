@echo off
cd /d "%~dp0"

echo [1/3] Iniciando base de datos...
cd backend
docker compose up -d
cd ..

echo [2/3] Esperando base de datos...
timeout /t 8 /nobreak >nul

echo [3/3] Iniciando servidor...
cd backend
start "Chocolates App" cmd /c "npm start"
cd ..

echo ========================================
echo  Sistema iniciado correctamente
echo.
echo  Abre el navegador y ve a:
echo  http://localhost:3000
echo ========================================
timeout /t 3 /nobreak >nul
start http://localhost:3000
