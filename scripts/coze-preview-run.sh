#!/usr/bin/env bash
set -euo pipefail

# 基于脚本位置定位项目根目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 显式声明关键环境变量
export PORT=5000

# 清理 5000 端口残留进程（绝不碰 9000）
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

# Vite 5.4.x 在 Vue SFC scoped CSS 处理上存在 calc() 解析 bug，
# 导致首页 hero/features 的组件 CSS 报 500。改用构建后静态 serve 的方式提供预览。
# 构建产物由 coze-preview-build.sh 生成。
DIST_DIR="docs-site/.vitepress/dist"

if [ ! -d "$DIST_DIR" ]; then
  echo "Build output not found, please run coze-preview-build.sh first."
  exit 1
fi

exec npx serve "$DIST_DIR" -l "$PORT" --no-clipboard
