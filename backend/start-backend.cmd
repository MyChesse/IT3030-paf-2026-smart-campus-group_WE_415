@echo off
setlocal
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-backend.ps1" %*
endlocal
