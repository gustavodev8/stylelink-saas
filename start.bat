@echo off
echo ========================================
echo   STYLELINK SAAS - Iniciando Servidores
echo ========================================
echo.

echo [1/2] Iniciando Backend (porta 3000)...
start "StyleLink Backend" cmd /k "cd backend && node src/server.js"
timeout /t 2 /nobreak > nul

echo [2/2] Iniciando Frontend (porta 8080)...
start "StyleLink Frontend" cmd /k "cd frontend && python -m http.server 8080"
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo   Servidores Iniciados!
echo ========================================
echo.
echo Backend API: http://localhost:3000
echo Frontend:    http://localhost:8080/admin/pages/dashboard.html
echo.
echo Pressione qualquer tecla para sair...
pause > nul
