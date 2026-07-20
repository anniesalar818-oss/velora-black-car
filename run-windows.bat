@echo off
setlocal
cd /d "%~dp0"
title Velora Black Car - Development Server

if not exist "server\node_modules" (
  echo Server packages are missing.
  echo Run setup-windows.bat first.
  pause
  exit /b 1
)

if not exist "client\node_modules" (
  echo Client packages are missing.
  echo Run setup-windows.bat first.
  pause
  exit /b 1
)

call npm run dev
if errorlevel 1 (
  echo.
  echo The website stopped because of the error shown above.
)
pause
