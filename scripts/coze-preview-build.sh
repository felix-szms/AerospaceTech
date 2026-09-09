#!/usr/bin/env bash
set -euo pipefail

# 基于脚本位置定位项目根目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 安装依赖
pnpm install

# 生成课时页面（从 lessons/ 源文件生成 docs-site/lessons/ 页面）
pnpm run gen-lessons

# 构建站点（Vite 5.4.x dev server 处理 Vue SFC scoped CSS 的 calc() 存在解析 bug，
# 预览采用构建后静态 serve 方式）
pnpm run build
