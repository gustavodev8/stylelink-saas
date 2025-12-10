@echo off
echo.
echo ╔══════════════════════════════════════════╗
echo ║   STYLELINK - SERVIDOR PÚBLICO           ║
echo ╚══════════════════════════════════════════╝
echo.
echo 🌍 Iniciando servidor da página pública...
echo.

cd frontend/public
python -m http.server 8081

pause
