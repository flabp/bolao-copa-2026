@echo off
chcp 65001 >nul 2>&1
title Bolao Copa do Mundo 2026

echo.
echo  ========================================================
echo       BOLAO COPA DO MUNDO FIFA 2026
echo       EUA / Mexico / Canada
echo  ========================================================
echo.

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado!
    echo  Instale em: https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  Primeira execucao - instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo  [ERRO] Falha na instalacao.
        pause
        exit /b 1
    )
    echo  [OK] Dependencias instaladas!
    echo.
)

echo  Iniciando servidor na porta 3001...
echo  O navegador abrira em alguns segundos.
echo  Para ENCERRAR, feche esta janela.
echo  ========================================================
echo.

start "" cmd /c "timeout /t 10 /nobreak >nul && start http://localhost:3001"
call npx next dev --port 3001
