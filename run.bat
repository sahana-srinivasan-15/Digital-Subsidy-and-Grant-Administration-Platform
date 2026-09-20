@echo off
title Digital Subsidy & Grant Administration Platform (Group 1) - Launcher
echo ======================================================================
echo    Digital Subsidy & Grant Administration Platform (Group 1)
echo    Unified Citizen DBT & Grant Management Platform
echo ======================================================================
echo.
echo [1/2] Starting Spring Boot Backend on http://localhost:8080/ ...
start "DSGA Backend Server" cmd /k "cd backend && (if exist mvnw.cmd (call mvnw.cmd spring-boot:run) else (mvn spring-boot:run))"

echo [2/2] Starting Frontend Web Portal on http://localhost:5173/ ...
cd frontend
if not exist node_modules (
    echo [INFO] Installing frontend node dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b %errorlevel%
    )
)
echo.
echo [SUCCESS] Backend starting on: http://localhost:8080/api (Swagger: http://localhost:8080/swagger-ui.html)
echo [SUCCESS] Frontend starting on: http://localhost:5173/
echo.
call npm run dev
pause
