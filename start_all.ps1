# Start all services for ResumeForge
Write-Host "ResumeForge Launcher" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Function to check if Python is installed
function Test-PythonInstalled {
    try {
        $pythonVersion = python --version
        return $true
    } catch {
        return $false
    }
}

# Check if Python is installed
if (-not (Test-PythonInstalled)) {
    Write-Host "Error: Python is not installed or not in PATH. Please install Python 3.8 or later." -ForegroundColor Red
    Write-Host "You can download Python from https://www.python.org/downloads/"
    exit 1
}

Write-Host "Starting services:"
Write-Host "1. Backend API (FastAPI)"
Write-Host "2. Frontend (HTTP Server)"
Write-Host ""

# Start backend server in a new PowerShell window
Write-Host "Starting Backend API..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; Write-Host 'Installing dependencies...' -ForegroundColor Cyan; pip install -r requirements.txt; Write-Host 'Starting FastAPI server...' -ForegroundColor Cyan; Set-Location '$PSScriptRoot\backend'; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Start frontend server in a new PowerShell window
Write-Host "Starting Frontend HTTP Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; Write-Host 'Building TypeScript frontend...' -ForegroundColor Cyan; .\build.ps1; Write-Host 'Starting HTTP server on port 8080...' -ForegroundColor Cyan; python -m http.server 8080"

Write-Host ""
Write-Host "Services started successfully!" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000"
Write-Host "API Documentation: http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:8080"
Write-Host ""
Write-Host "Press Enter to exit..."
$null = Read-Host
