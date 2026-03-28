# view_site.ps1
$VENV_DIR = "$PSScriptRoot\.venv"
$PYTHON = "$VENV_DIR\Scripts\python.exe"
$PIP = "$VENV_DIR\Scripts\pip.exe"

if (-not (Test-Path "$VENV_DIR")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv "$VENV_DIR"
}

Write-Host "Checking dependencies..." -ForegroundColor Cyan
& "$PIP" install -r "$PSScriptRoot\requirements.txt" --quiet

Write-Host "Starting View Mode..." -ForegroundColor Green
& "$PYTHON" "$PSScriptRoot\build.py" --serve
