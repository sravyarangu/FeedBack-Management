@echo off
echo ========================================
echo Feedback Management System - Quick Start
echo ========================================
echo.
echo This script will help you start both Backend and Frontend servers
echo.

echo Step 1: Starting Backend Server...
echo.
start cmd /k "cd /d "%~dp0Backend" && echo Starting Backend Server... && npm start"

timeout /t 3 /nobreak >nul

echo Step 2: Starting Frontend Server...
echo.
start cmd /k "cd /d "%~dp0frontend" && echo Starting Frontend Server... && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo.
echo Backend will run on: http://localhost:3000
echo Frontend will run on: http://localhost:5173
echo.
echo Press any key to exit this window...
echo ========================================
pause >nul
