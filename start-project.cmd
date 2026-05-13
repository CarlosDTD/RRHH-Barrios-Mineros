@echo off
title RRHH Barrios Mineros - Runner
echo ==========================================
echo   Iniciando Sistema RRHH Barrios Mineros
echo ==========================================

:: Abrir Backend en una nueva ventana
start "Backend - Node.js" cmd /c "cd backend && npm run dev"

:: Abrir Frontend en una nueva ventana
start "Frontend - React" cmd /c "cd frontend && npm run dev"

echo.
echo [OK] Backend intentando iniciar en puerto 3001
echo [OK] Frontend intentando iniciar en puerto 5173
echo.
echo Presione cualquier tecla para cerrar esta ventana de control...
pause > nul
