# 🚀 部署指南（Nginx 标准生产模式）

本项目构建产物是**纯静态文件**，使用 Nginx 部署到 Linux 服务器。

---

## 一、整体流程

```
本地开发 → GitHub 仓库 → Linux 服务器 git clone → npm build → Nginx serve
```

```
项目提供 3 个部署文件（在 deploy/ 目录）：
├── nginx.conf     # Nginx 站点配置（含缓存/压缩/安全策略）
├── deploy.sh      # 首次一键部署脚本
└── update.sh      # 后续代码更新脚本
```

---

## 二、首次部署（在 Linux 服务器上执行）

### 步骤 0：前置准备

确保你有：
- 一台 Linux 服务器（Ubuntu 20.04+ / CentOS 7+ / Debian 10+）
- sudo 权限
- 一个域名（可选，也可用 IP）

### 步骤 1：先把代码推送到 GitHub

在你的本地开发机上：

```bash
cd C:\zprojects\spacecourse

git init
git add .
git commit -m "初始化《空天科技探秘》教学网站"

# 在 https://github.com/new 创建仓库（建议 Public，方便服务器拉取）
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

### 步骤 2：登录服务器，修改配置

```bash
# SSH 登录服务器
ssh user@your-server-ip

# 克隆代码到任意目录（用于修改 deploy.sh 配置）
git clone https://github.com/<你的用户名>/<仓库名>.git
cd <仓库名>

# 编辑 deploy.sh，修改三处配置
nano deploy/deploy.sh
```

需要修改的 3 处（在脚本开头的"配置区"）：

```bash
REPO_URL="https://github.com/<你的用户名>/<仓库名>.git"  # ← 改成你的仓库
DOMAIN="your-domain.com"                                  # ← 改成你的域名或 IP
```

### 步骤 3：一键部署

```bash
sudo bash deploy/deploy.sh
```

这个脚本会自动完成：
1. ✅ 安装 Nginx + Node.js 20（如未安装）
2. ✅ 克隆代码到 `/var/www/spacecourse`
3. ✅ 安装 npm 依赖
4. ✅ 构建静态站点
5. ✅ 配置 Nginx（含缓存/压缩/安全策略）
6. ✅ 重载 Nginx 并设置权限

部署完成后访问：`http://你的域名或IP/`

### 步骤 4：配置 HTTPS（强烈推荐）

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 按提示操作，证书会自动续期
```

---

## 三、后续更新代码

每次你在本地修改内容推送 GitHub 后，在服务器上执行：

```bash
cd /var/www/spacecourse
bash deploy/update.sh
```

这个脚本会自动 `git pull` + `npm install` + `npm run build`，约 30 秒完成更新。Nginx 无需重启。

---

## 四、手动部署（如不想用脚本）

如果你想完全手动操作：

### 4.1 安装环境

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx git curl

# Node.js 20 (通过 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# CentOS/RHEL
sudo yum install -y nginx git curl
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### 4.2 拉取代码并构建

```bash
sudo mkdir -p /var/www/spacecourse
sudo chown $USER:$USER /var/www/spacecourse

cd /var/www/spacecourse
git clone https://github.com/<你的用户名>/<仓库名>.git .
npm install
npm run build
```

构建产物在 `docs-site/.vitepress/dist/`

### 4.3 配置 Nginx

```bash
# 复制项目提供的配置文件
sudo cp deploy/nginx.conf /etc/nginx/conf.d/spacecourse.conf

# 编辑，把 your-domain.com 改成你的域名
sudo nano /etc/nginx/conf.d/spacecourse.conf

# 测试并重载
sudo nginx -t
sudo systemctl reload nginx
```

---

## 五、Nginx 配置详解

项目提供的 `deploy/nginx.conf` 已包含完整的生产级配置：

| 配置项 | 说明 |
|---|---|
| **try_files** | 支持 VitePress 的 clean URLs（/lessons/lesson-01 而非 .html）|
| **assets/ 缓存** | 1 年永久缓存（文件名含 hash，更新自动失效）|
| **history/ 缓存** | 30 天（历史图片）|
| **HTML 不缓存** | 保证内容更新及时可见 |
| **gzip 压缩** | HTML/CSS/JS/SVG 等全部压缩 |
| **安全头** | X-Content-Type-Options、X-Frame-Options 等 |
| **隐藏版本号** | `server_tokens off` |

---

## 六、常用运维命令

```bash
# 查看 Nginx 状态
sudo systemctl status nginx

# 重启 Nginx（修改配置后）
sudo systemctl reload nginx

# 测试配置语法
sudo nginx -t

# 查看实时访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看站点文件大小
du -sh /var/www/spacecourse/docs-site/.vitepress/dist

# 手动重新构建
cd /var/www/spacecourse
npm run build
```

---

## 七、常见问题

### Q1：页面 404 / 空白
```bash
# 检查构建产物是否存在
ls /var/www/spacecourse/docs-site/.vitepress/dist/index.html

# 检查 Nginx root 路径
grep "root " /etc/nginx/conf.d/spacecourse.conf

# 检查 Nginx 错误日志
sudo tail -20 /var/log/nginx/error.log
```

### Q2：权限问题（403 Forbidden）
```bash
# 确保目录可读
sudo chmod -R 755 /var/www/spacecourse
sudo chown -R www-data:www-data /var/www/spacecourse  # Ubuntu
# 或
sudo chown -R nginx:nginx /var/www/spacecourse        # CentOS
```

### Q3：公式不渲染
项目使用 jsdelivr CDN 加载 KaTeX CSS。如果服务器在国内访问慢，可改为本地引入：

```bash
# 下载 katex CSS 到本地
cd /var/www/spacecourse/docs-site/public
wget https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css

# 修改 config.ts 中的 head 配置，把 CDN 链接改为 /katex.min.css
# 然后重新构建：npm run build
```

### Q4：图片不显示
```bash
# 检查历史图片是否在构建产物中
ls /var/www/spacecourse/docs-site/.vitepress/dist/history/

# 如缺失，检查源文件
ls /var/www/spacecourse/docs-site/public/history/
```

### Q5：Node.js 版本问题
```bash
# 检查版本（需要 ≥ 18）
node -v

# 如版本过低，用 nvm 升级
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### Q6：部署在子路径（如 /spacecourse/）
如果不想用根域名，而是部署在 `your-domain.com/spacecourse/`：

1. 修改 `docs-site/.vitepress/config.ts`，添加：
   ```typescript
   export default defineConfig({
     base: '/spacecourse/',
     // ...
   })
   ```
2. 修改 `deploy/nginx.conf`，把 `location /` 改为 `location /spacecourse/`
3. 重新构建部署

---

## 八、性能优化（可选）

### 8.1 Brotli 压缩（比 gzip 更高效）
需要 Nginx 1.10.3+ 和 brotli 模块：

```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript image/svg+xml;
```

### 8.2 HTTP/2（提升并发）
启用 HTTPS 后自动支持 HTTP/2：
```nginx
listen 443 ssl http2;
```

### 8.3 CDN 加速
将静态资源上传到七牛云/阿里云 OSS + CDN，把 `/assets/` 和 `/history/` 路径指向 CDN。

---

## 九、回滚

如果某次更新出问题：

```bash
cd /var/www/spacecourse

# 查看历史版本
git log --oneline -10

# 回到上一个版本
git reset --hard HEAD~1

# 重新构建
npm run build
```
