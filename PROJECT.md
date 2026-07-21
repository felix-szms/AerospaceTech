# 《空天科技探秘》教学网站 · 项目说明

## 🚀 快速开始

```bash
# 安装依赖（首次）
npm install

# 开发模式（实时预览）
npm run dev
# 访问 http://localhost:5173/

# 生产构建
npm run build
# 输出到 docs-site/.vitepress/dist/

# 预览构建结果
npm run preview
# 访问 http://localhost:4173/
```

## 📁 项目结构

```
spacecourse/
├── package.json                 # 项目配置（type: module）
├── lessons/                     # 18 课时教学内容源（每课 5 个 .md 文件）
│   ├── 01/ ~ 18/
│   │   ├── 讲义.md
│   │   ├── 实践活动.md
│   │   ├── 学生任务单.md
│   │   ├── 教师参考.md
│   │   └── 素材清单.md
├── contest-templates/           # 7 份赛事模板（源）
├── docs/                        # 课程大纲、文档规范
├── docs-site/                   # VitePress 网站项目
│   ├── .vitepress/
│   │   ├── config.ts            # VitePress 配置（导航、侧边栏、KaTeX）
│   │   ├── components/          # 4 个 Vue 交互组件
│   │   │   ├── OrbitCalculator.vue      # 🛰️ 轨道参数计算器
│   │   │   ├── RocketSimulator.vue      # 🚀 火箭仿真器
│   │   │   ├── SpaceTimeline.vue        # 📜 中国航天成就时间线
│   │   │   └── MissionSimulator.vue     # 🎯 航天任务模拟器
│   │   ├── theme/
│   │   │   ├── index.ts         # 主题入口（注册全局组件）
│   │   │   └── styles/custom.css # 深空主题样式
│   ├── index.md                 # 首页
│   ├── overview.md              # 课程总览
│   ├── resources.md             # 资源下载
│   ├── lessons/                 # 18 个课时页面（lesson-01.md ~ lesson-18.md）
│   ├── contest/                 # 赛事专区（9 个页面）
│   ├── tools/                   # 交互工具页面（4 个）
│   └── public/                  # 静态资源（logo.svg）
└── docs-site/.vitepress/dist/   # 构建输出（部署用）
```

## 🌐 网站架构

### 页面清单（共 35 个 HTML 页面）

| 类别 | 页面 | 数量 |
|---|---|---|
| 首页 | `/` | 1 |
| 课程总览 | `/overview` | 1 |
| 课时页 | `/lessons/lesson-01` ~ `/lessons/lesson-18` | 18 |
| 交互工具 | `/tools/orbit-calculator` 等 | 4 |
| 赛事专区 | `/contest/` 及模板页 | 9 |
| 资源下载 | `/resources` | 1 |
| 404 | `*` | 1 |

### 四个交互组件

1. **🛰️ 轨道参数计算器**（`/tools/orbit-calculator`）
   - 输入轨道高度，实时计算轨道速度 $v=\sqrt{GM/r}$、周期 $T=2\pi\sqrt{r^3/GM}$
   - 5 个预设轨道（ISS、哈勃、SSO、北斗 MEO、GEO）
   - Canvas 动画：地球 + 卫星沿轨道运动 + 星空背景

2. **🚀 火箭仿真器**（`/tools/rocket-simulator`）
   - 基于齐奥尔科夫斯基方程 $\Delta v = v_e \ln(m_0/m_f)$
   - 4 个预设（A8-3、B6-4 模型火箭、水火箭、探空火箭）
   - Canvas 动画：火箭主动段→惯性上升→自由落体
   - 高度-时间曲线实时绘制

3. **📜 中国航天成就时间线**（`/tools/timeline`）
   - 1970-2024 共 18 个里程碑事件
   - 按类别筛选（卫星/载人/月球/深空/空间站/北斗）
   - 点击展开详情

4. **🎯 航天任务模拟器**（`/tools/mission-simulator`）
   - 5 步引导式任务设计（任务→轨道→火箭→载荷→评估）
   - 智能评估系统（任务-轨道-火箭-载荷匹配度评分）
   - 知识拓展与真实案例对照

### 教学法特色

- **PBL（项目式学习）**：学期长项目"航天创意设计"，6 件套作品包对接赛事
- **EDP（工程设计过程）**：Ask→Imagine→Plan→Create→Test→Improve
- **5E 教学法**：Engage→Explore→Explain→Elaborate→Evaluate
- **3 个 PBL 里程碑**：第 6 课选题确认 / 第 14 课原型定稿 / 第 18 课答辩会

## 🎨 设计特色

- **深空主题**：深蓝渐变背景 + 星空动画 + 科技青色强调
- **响应式**：桌面/平板/手机自适应
- **中英文字体优化**：PingFang SC / Microsoft YaHei
- **KaTeX 公式渲染**：支持 `$...$` 行内 + `$$...$$` 块级
- **代码高亮**：GitHub Light/Dark 主题
- **本地搜索**：内置全文搜索（Ctrl+K）
- **深色模式**：自动跟随系统 / 手动切换

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|---|---|---|
| VitePress | 1.6.4 | 静态站点生成 |
| Vue 3 | 3.5.x | 交互组件 |
| @mdit/plugin-katex | latest | LaTeX 公式渲染 |
| KaTeX | CDN | 公式样式 |
| HTML5 Canvas | 原生 | 交互可视化 |

## 📦 部署方式

构建后的 `docs-site/.vitepress/dist/` 是纯静态文件，可部署到：

| 平台 | 配置 |
|---|---|
| **Vercel** | Framework: VitePress，Build: `npm run build`，Output: `docs-site/.vitepress/dist` |
| **Netlify** | Build: `npm run build`，Publish: `docs-site/.vitepress/dist` |
| **GitHub Pages** | 推送 dist 目录到 gh-pages 分支 |
| **学校服务器** | 直接将 dist 目录上传到 Web 服务器根目录 |
| **本地查看** | `npm run preview` 后访问 http://localhost:4173 |

## ✅ 质量检查

- [x] 35 个 HTML 页面全部生成成功
- [x] 18 个课时页面内容完整（讲义/实践/任务单/教参/素材）
- [x] LaTeX 公式正确渲染（KaTeX）
- [x] 4 个交互组件功能正常
- [x] 7 份赛事模板可访问
- [x] 导航栏、侧边栏、搜索功能正常
- [x] 深色/浅色模式切换
- [x] 移动端响应式
- [x] 所有页面 HTTP 200

## 📊 内容统计

- 教学内容：18 课时 × 5 文件 = 90 个 Markdown
- 赛事模板：7 份
- 文档：2 份
- **总计：100+ 个 Markdown 文件，约 37 万字符**
- 网站构建输出：7.1 MB（含 JS/CSS/HTML）
