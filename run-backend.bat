@echo off
title DSGA Spring Boot Backend
cd backend
if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run
) else (
    mvn spring-boot:run
)
pause
