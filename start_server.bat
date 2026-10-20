@echo off
setlocal
echo ============================================================
echo    Braseiro do Grajaú - Servidor Local de Desenvolvimento
echo ============================================================
echo.
echo  Porta: 3000
echo  URL:   http://localhost:3000
echo.
echo  Iniciando servidor local...
echo  Pressione CTRL+C para encerrar.
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:3000
    python -m http.server 3000
    goto end
)

where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:3000
    php -S localhost:3000
    goto end
)

where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:3000
    npx serve . -l 3000
    goto end
)

echo [AVISO] Python ou PHP nao encontrados no PATH.
echo Abrindo o arquivo index.html diretamente no navegador...
start index.html

:end
pause
