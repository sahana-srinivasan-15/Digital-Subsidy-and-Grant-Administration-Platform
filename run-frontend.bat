@echo off
title DSGA Frontend Portal
cd frontend
if not exist node_modules (
    call npm install
)
call npm run dev
pause
