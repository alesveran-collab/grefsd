@echo off
cd /d "%~dp0"
echo Descargando fotos de logistica...
python download_images.py
if errorlevel 1 (
  echo.
  echo Si Python no esta instalado, instale Python 3 y vuelva a ejecutar.
  pause
  exit /b 1
)
echo.
echo Listo. Abra index.html en el navegador.
pause
