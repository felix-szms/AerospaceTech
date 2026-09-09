#!/bin/bash
#================================================================
# 《空天科技探秘》快速更新脚本
# 部署完成后，每次代码更新只需运行此脚本
# 用法：bash update.sh
#================================================================
set -e

DEPLOY_DIR="/var/www/spacecourse"

cd "${DEPLOY_DIR}"

echo "==> 拉取最新代码..."
git pull

echo "==> 安装依赖（如有变化）..."
npm ci --omit=dev 2>/dev/null || npm install

echo "==> 构建站点..."
npm run build

echo "==> 完成！"
echo "构建时间: $(date)"
echo "页面数: $(find docs-site/.vitepress/dist -name '*.html' | wc -l)"
echo "访问测试: curl -I http://localhost/"
