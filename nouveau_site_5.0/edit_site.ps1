# edit_site.ps1
Write-Host "🛠️ Starting Edit/Watch Mode..." -ForegroundColor Yellow
Write-Host "The site will auto-rebuild on every save." -ForegroundColor Gray
python build.py --watch --serve
