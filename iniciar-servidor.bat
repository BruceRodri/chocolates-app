@echo off
cd /d "%~dp0"

echo ========================================
echo  Iniciando Sistema de Chocolates
echo ========================================

:: 1. Construir frontend (por si hay cambios)
echo [1/5] Construyendo frontend...
cd frontend
call npm install >nul 2>&1
call npm run build
cd ..

:: 2. Detener MySQL nativo si esta corriendo
echo [2/5] Liberando puerto 3306...
net stop MySQL 2>nul
sc stop MySQL 2>nul

:: 3. Iniciar MySQL en Docker
echo [3/5] Iniciando base de datos...
cd backend
docker compose up -d
cd ..

:: 4. Esperar a que MySQL este listo
echo [4/5] Esperando base de datos...
timeout /t 10 /nobreak >nul

:: 5. Iniciar servidor backend (produccion)
echo [5/5] Iniciando servidor...
cd backend
call npm install >nul 2>&1
start "Chocolates App" cmd /c "npm start"
cd ..

echo ========================================
echo  Sistema iniciado correctamente
echo.
echo  En esta PC abre:
echo  http://localhost:3000
echo.
echo  Desde OTROS dispositivos en la red:
echo  http://%COMPUTERNAME%:3000
echo.
echo  Si no funciona, usa la IP del servidor:
echo  1. Abre cmd y escribe: ipconfig
echo  2. Busca "Direccion IPv4" (ej: 192.168.1.x)
echo  3. En el otro dispositivo abre: http://192.168.1.x:3000
echo ========================================
timeout /t 5 /nobreak >nul
start http://localhost:3000
