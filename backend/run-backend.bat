@echo off
title DSGA Spring Boot Backend (Port 8080)
echo ======================================================================
echo    DSGA Platform - Spring Boot 3.2 Backend Service (Port 8080)
echo ======================================================================
echo.
echo [INFO] Starting Spring Boot application with H2 Database...
if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run
) else (
    call mvn spring-boot:run
)
pause
