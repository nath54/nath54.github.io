# edit_site.ps1

# 1. Setup Virtual Environment
if (-not (Test-Path ".venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# 2. Install/Update Requirements
Write-Host "🚀 Checking dependencies..." -ForegroundColor Cyan
& ".\.venv\Scripts\pip" install -r requirements.txt --quiet

# 3. Run Build & Serve in Watch Mode
Write-Host "🛠️ Starting Edit/Watch Mode..." -ForegroundColor Yellow
Write-Host "The site will auto-rebuild on every save." -ForegroundColor Gray
& ".\.venv\Scripts\python" build.py --watch --serve
