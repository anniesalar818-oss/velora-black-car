@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Velora Black Car - Setup

set "LOGFILE=%~dp0setup-log.txt"
>"%LOGFILE%" echo Velora Black Car setup log
>>"%LOGFILE%" echo Started: %date% %time%

echo ============================================
echo Velora Black Car - First Time Setup
echo ============================================
echo.

echo Checking Node.js and npm...
where node >nul 2>nul
if errorlevel 1 goto :node_missing
where npm >nul 2>nul
if errorlevel 1 goto :node_missing

for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%V"
for /f "delims=" %%V in ('node -v') do set "NODE_VERSION=%%V"
for /f "delims=" %%V in ('npm -v') do set "NPM_VERSION=%%V"

echo Node: %NODE_VERSION%
echo npm:  %NPM_VERSION%
>>"%LOGFILE%" echo Node: %NODE_VERSION%
>>"%LOGFILE%" echo npm: %NPM_VERSION%

if %NODE_MAJOR% LSS 20 goto :node_old

set "NPM_CONFIG_REGISTRY=https://registry.npmjs.org/"
call npm config set registry https://registry.npmjs.org/ >>"%LOGFILE%" 2>&1

rem Remove incomplete installs and lock files created against a private registry.
echo Cleaning incomplete installation files...
if exist "package-lock.json" del /f /q "package-lock.json"
if exist "server\package-lock.json" del /f /q "server\package-lock.json"
if exist "client\package-lock.json" del /f /q "client\package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "server\node_modules" rmdir /s /q "server\node_modules"
if exist "client\node_modules" rmdir /s /q "client\node_modules"

echo.
echo [1/3] Installing server packages...
call npm install --prefix server --no-audit --no-fund --registry=https://registry.npmjs.org/ >>"%LOGFILE%" 2>&1
if errorlevel 1 goto :error

echo [2/3] Installing client packages...
call npm install --prefix client --no-audit --no-fund --registry=https://registry.npmjs.org/ >>"%LOGFILE%" 2>&1
if errorlevel 1 goto :error

if not exist "server\.env" copy "server\.env.example" "server\.env" >nul
if not exist "client\.env" copy "client\.env.example" "client\.env" >nul

echo [3/3] Creating the local admin account...
call npm run seed:admin --prefix server >>"%LOGFILE%" 2>&1
if errorlevel 1 goto :error

echo.
echo ============================================
echo Setup completed successfully.
echo ============================================
echo Admin email: admin@velora.local
echo Password:    VeloraAdmin2026!
echo.
echo Now double-click run-windows.bat
echo The website will open at http://localhost:5173
echo.
echo Setup details are saved in setup-log.txt
pause
exit /b 0

:node_missing
echo.
echo ERROR: Node.js/npm was not found.
echo Install Node.js 20 LTS or newer, restart the computer, then run this file again.
echo ERROR: Node.js/npm was not found.>>"%LOGFILE%"
pause
exit /b 1

:node_old
echo.
echo ERROR: Your Node.js version is %NODE_VERSION%.
echo This project requires Node.js 20 or newer.
echo Install a current Node.js LTS version, restart, and run setup again.
echo ERROR: Node.js 20 or newer is required.>>"%LOGFILE%"
pause
exit /b 1

:error
echo.
echo ============================================
echo SETUP FAILED
echo ============================================
echo Open setup-log.txt in this folder and send its last lines.
echo The window will stay open until you press a key.
echo.
type "%LOGFILE%" | more
pause
exit /b 1
