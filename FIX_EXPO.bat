@echo off
echo Cleaning up Expo installation...
echo.

REM Kill any running node processes
taskkill /F /IM node.exe /T >nul 2>&1
echo ✓ Killed node processes

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Delete node_modules and package-lock
cd /d "C:\Users\yl640\Documents\Irrigacao"
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
    echo ✓ Removed node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
    echo ✓ Removed package-lock.json
)

REM Clean .expo cache
if exist .expo (
    echo Removing .expo cache...
    rmdir /s /q .expo >nul 2>&1
    echo ✓ Removed .expo cache
)

REM Run fresh npm install
echo.
echo Installing dependencies...
call npm install

echo.
echo ✓ Installation complete!
echo.
echo You can now run: npx expo start --clear
pause
