# Start server script for ResumeForge
Set-Location -Path (Join-Path $PSScriptRoot)
Write-Host "Installing dependencies..."
pip install -r requirements.txt
Write-Host "Starting FastAPI server..."
Set-Location -Path (Join-Path $PSScriptRoot "backend")
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
