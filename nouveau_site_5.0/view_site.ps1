# view_site.ps1

# 1. Setup Virtual Environment
if (-not (Test-Path ".venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# 2. Install/Update Requirements
Write-Host "🚀 Checking dependencies..." -ForegroundColor Cyan
& ".\.venv\Scripts\pip" install -r requirements.txt --quiet

# 3. Run Build & Serve
Write-Host "🌐 Starting View Mode..." -ForegroundColor Green
& ".\.venv\Scripts\python" build.py --serve
