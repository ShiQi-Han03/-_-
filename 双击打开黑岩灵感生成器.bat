@echo off
setlocal

set "PACK_DIR=%~dp0"
set "APP_DIR=%PACK_DIR%heiyan-idea-app"
set "URL=http://127.0.0.1:3210"

title Heiyan Idea App

echo.
echo [1/3] Checking app folder...
if not exist "%APP_DIR%\server.js" (
  echo App folder not found:
  echo %APP_DIR%
  echo.
  pause
  exit /b 1
)

echo [2/3] Checking Node.js...
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found on this computer.
  echo.
  echo Please install Node.js first, then run this file again.
  echo.
  pause
  exit /b 1
)

pushd "%APP_DIR%"
if errorlevel 1 (
  echo Failed to enter app folder:
  echo %APP_DIR%
  echo.
  pause
  exit /b 1
)

echo [3/3] Building local data...
node scripts\build-ideas-json.js
if errorlevel 1 (
  echo.
  echo Failed to build local data.
  echo.
  popd
  pause
  exit /b 1
)

echo.
echo Starting local server...
echo If the browser does not open automatically,
echo open this address manually:
echo %URL%
echo.
echo Keep this window open while using the app.
echo Closing this window will stop the app.
echo.

node server.js
set "EXIT_CODE=%ERRORLEVEL%"

echo.
echo The local server has stopped.
echo.
popd
pause
exit /b %EXIT_CODE%
