#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

PORT="${DEPLOY_RUN_PORT:-5000}"

# 构建产物目录
DIST_DIR="docs-site/.vitepress/dist"

if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Build output directory '$DIST_DIR' not found. Run build first."
    exit 1
fi

echo "Serving static files from $DIST_DIR on port $PORT..."
exec npx serve "$DIST_DIR" -l "$PORT" --no-clipboard
