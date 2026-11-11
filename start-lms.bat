@echo off
setlocal EnableDelayedExpansion
title AetherLMS - Enterprise Learning Platform
color 0a

echo ========================================================
echo         AetherLMS: Coursera x NPTEL Hybrid Engine
echo ========================================================
echo.

set "NODE_BIN=C:\nodejs\node-v20.18.1-win-x64\node.exe"

if not exist "%NODE_BIN%" (
    echo [ERROR] Portable Node.js not found at %NODE_BIN%
    echo Checking system node...
    where node >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Node.js is not installed. Please download from https://nodejs.org
        pause
        exit /b 1
    )
    set "NODE_BIN=node"
)

cd /d "%~dp0"

echo [1/2] Launching AetherLMS Local Server on http://localhost:3000 ...
echo [2/2] Opening your browser...
start "" "http://localhost:3000"

echo.
echo Server is running! Keep this window open while using the website.
echo Press Ctrl+C in this window to stop the server.
echo.

"%NODE_BIN%" server.js
pause
