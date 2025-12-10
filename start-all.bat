@echo off
echo.
echo ╔══════════════════════════════════════════╗
echo ║   STYLELINK SAAS - INICIAR TUDO          ║
echo ╚══════════════════════════════════════════╝
echo.
echo 🚀 Iniciando todos os servidores...
echo.
echo Backend API: http://localhost:3000
echo Admin Panel: http://localhost:8080
echo Public Page: http://localhost:8081
echo.
echo ⚠️  Pressione Ctrl+C para encerrar todos os servidores
echo.

start "Backend API" cmd /k "cd backend && node src/server.js"
timeout /t 2 /nobreak > nul

start "Admin Panel" cmd /k "cd frontend && python -m http.server 8080"
timeout /t 2 /nobreak > nul

start "Public Page" cmd /k "cd frontend/public && python -m http.server 8081"

echo.
echo ✅ Todos os servidores foram iniciados!
echo.
pause
