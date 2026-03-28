#!/bin/bash

# view_site.sh

# 1. Setup Virtual Environment
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# 2. Install/Update Requirements
echo "🚀 Checking dependencies..."
./.venv/bin/pip install -r requirements.txt --quiet

# 3. Run Build & Serve
echo "🌐 Starting View Mode..."
./.venv/bin/python build.py --serve
