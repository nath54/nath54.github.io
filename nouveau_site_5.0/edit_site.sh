#!/bin/bash

# edit_site.sh

# 1. Setup Virtual Environment
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# 2. Install/Update Requirements
echo "🚀 Checking dependencies..."
./.venv/bin/pip install -r requirements.txt --quiet

# 3. Run Build & Serve in Watch Mode
echo "🛠️ Starting Edit/Watch Mode..."
echo "The site will auto-rebuild on every save."
./.venv/bin/python build.py --watch --serve
