#!/bin/bash
#================================================================
# 《空天科技探秘》Nginx 部署脚本
# 在 Linux 服务器上执行：bash deploy.sh
#================================================================
set -e

# ============ 配置区（按需修改）============
PROJECT_NAME="spacecourse"
REPO_URL="https://github.com/<你的用户名>/<仓库名>.git"   # ← 改成你的仓库地址
DEPLOY_DIR="/var/www/${PROJECT_NAME}"
NGINX_CONF_SRC="./deploy/nginx.conf"
NGINX_CONF_DEST="/etc/nginx/conf.d/${PROJECT_NAME}.conf"
DOMAIN="your-domain.com"                                   # ← 改成你的域名或 IP
NODE_VERSION="20"

# ============ 颜色输出 ============
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ============ 步骤 1：检查 root 权限 ============
if [ "$EUID" -ne 0 ]; then
    err "请使用 sudo 运行：sudo bash deploy.sh"
fi

log "开始部署《空天科技探秘》..."

# ============ 步骤 2：检查/安装依赖 ============
echo ""
echo "==> [1/6] 检查依赖..."

# 检查 Nginx
if ! command -v nginx &> /dev/null; then
    log "安装 Nginx..."
    if command -v apt &> /dev/null; then
        apt update && apt install -y nginx git curl
    elif command -v yum &> /dev/null; then
        yum install -y nginx git curl
    else
        err "不支持的包管理器，请手动安装 nginx git curl"
    fi
fi
log "Nginx 已安装: $(nginx -v 2>&1)"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    log "安装 Node.js ${NODE_VERSION} (通过 NodeSource)..."
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash -
    apt install -y nodejs || yum install -y nodejs
fi

NODE_VER=$(node -v | grep -oP '\d+' | head -1)
if [ "$NODE_VER" -lt 18 ]; then
    err "Node.js 版本过低 ($(node -v))，需要 ≥ 18"
fi
log "Node.js: $(node -v)"
log "npm: $(npm -v)"

# ============ 步骤 3：拉取/更新代码 ============
echo ""
echo "==> [2/6] 拉取代码..."

mkdir -p /var/www
if [ -d "${DEPLOY_DIR}/.git" ]; then
    log "更新现有仓库..."
    cd "${DEPLOY_DIR}"
    git pull
else
    log "克隆仓库到 ${DEPLOY_DIR}..."
    git clone "${REPO_URL}" "${DEPLOY_DIR}"
    cd "${DEPLOY_DIR}"
fi

log "当前代码版本: $(git log -1 --format='%h %s (%ar)')"

# ============ 步骤 4：安装依赖 ============
echo ""
echo "==> [3/6] 安装 npm 依赖..."
npm ci --omit=dev 2>/dev/null || npm install
log "依赖安装完成"

# ============ 步骤 5：构建 ============
echo ""
echo "==> [4/6] 构建静态站点..."
npm run build
log "构建完成"

# 验证构建产物
DIST_DIR="${DEPLOY_DIR}/docs-site/.vitepress/dist"
if [ ! -f "${DIST_DIR}/index.html" ]; then
    err "构建失败：${DIST_DIR}/index.html 不存在"
fi
HTML_COUNT=$(find "${DIST_DIR}" -name "*.html" | wc -l)
log "构建产物: ${HTML_COUNT} 个 HTML 页面，总大小 $(du -sh ${DIST_DIR} | awk '{print $1}')"

# ============ 步骤 6：配置 Nginx ============
echo ""
echo "==> [5/6] 配置 Nginx..."

if [ -f "${NGINX_CONF_SRC}" ]; then
    # 替换配置文件中的域名
    sed "s/your-domain.com/${DOMAIN}/g" "${NGINX_CONF_SRC}" > "${NGINX_CONF_DEST}"
    log "Nginx 配置已写入: ${NGINX_CONF_DEST}"
else
    warn "未找到 ${NGINX_CONF_SRC}，跳过配置（请手动配置 nginx）"
fi

# 测试 nginx 配置
if ! nginx -t 2>&1; then
    err "Nginx 配置测试失败"
fi
log "Nginx 配置测试通过"

# 重载 Nginx
systemctl reload nginx || systemctl restart nginx
log "Nginx 已重新加载"

# ============ 步骤 7：设置权限 ============
echo ""
echo "==> [6/6] 设置权限..."
chown -R nginx:nginx /var/www/${PROJECT_NAME} 2>/dev/null || \
chown -R www-data:www-data /var/www/${PROJECT_NAME} 2>/dev/null || \
warn "无法更改属主（非关键）"
chmod -R 755 /var/www/${PROJECT_NAME}
log "权限设置完成"

# ============ 完成 ============
echo ""
echo "================================================"
log "🎉 部署完成！"
echo "================================================"
echo ""
echo "  访问地址: http://${DOMAIN}"
echo "  代码目录: ${DEPLOY_DIR}"
echo "  静态文件: ${DIST_DIR}"
echo "  Nginx 配置: ${NGINX_CONF_DEST}"
echo ""
echo "  常用命令:"
echo "    查看状态: sudo systemctl status nginx"
echo "    重启 nginx: sudo systemctl restart nginx"
echo "    查看日志: sudo tail -f /var/log/nginx/access.log"
echo ""
echo "  后续更新代码后重新部署:"
echo "    cd ${DEPLOY_DIR} && git pull && npm install && npm run build"
echo ""
warn "如需启用 HTTPS，运行: sudo certbot --nginx -d ${DOMAIN}"
