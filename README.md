# 🚀 空天科技探秘 · 高一选修课教学网站

> 面向高一年级 · 18 课时 · 航空 + 航天 + 创意设计
> 对接全国青少年航天创新大赛

## 📖 项目简介

本项目是一个**完整的航天科技选修课教学资源库 + 交互式教学网站**，包含：

- **18 课时教学内容**：每课 5 个文件（讲义 / 实践活动 / 学生任务单 / 教师参考 / 素材清单），共 90 个 Markdown
- **7 份赛事对接模板**：创意方案、研究报告、查新报告、研究日志、展示海报、答辩 PPT、展示视频
- **6 个自研中文交互工具**：升力演示器、大气参数计算器、轨道参数计算器、火箭仿真器、中国航天成就时间线、航天任务模拟器
- **29 张历史图片**：航空发展历程（1903-2024）、航天发展历程（1957-2026）
- **10 张纸飞机教学图**：折法图解、调校指南、锦标赛规则（第 3、4 课配套）
- **10 类科学示意图**：SVG 矢量图，覆盖卡门线、伯努利原理、四力平衡、EDP 循环等核心概念

## 🛠️ 技术栈（全部为最新稳定版）

| 技术 | 版本 | 用途 |
|---|---|---|
| **VitePress** | 1.6.4 | 静态站点生成（Markdown 驱动）|
| **Vue 3** | 3.5.40 | 交互组件 |
| **KaTeX** | 0.18.1 | LaTeX 数学公式渲染 |
| **@mdit/plugin-katex** | 1.0.1 | VitePress 的 KaTeX 集成 |
| **HTML5 Canvas** | 原生 | 交互可视化 |
| **Node.js** | ≥ 18 | 构建环境 |

## 🚀 快速开始

### 环境要求
- **Node.js ≥ 18**（推荐 20 LTS 或更高）
- **Python 3**（可选，用于重新生成课时页面 `gen_lessons.py`）

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（实时热更新）
npm run dev
# 访问 http://localhost:5173/

# 3. 生产构建
npm run build
# 输出到 docs-site/.vitepress/dist/

# 4. 本地预览构建结果
npm run preview
# 访问 http://localhost:4173/
```

### 重新生成课时页面

如果修改了 `lessons/` 下的源文件，需要重新生成课时页面：

```bash
npm run gen-lessons   # 等价于 python gen_lessons.py
```

## 📁 项目结构

```
spacecourse/
├── package.json                 # 项目配置
├── gen_lessons.py               # 课时页面生成脚本
├── .gitignore
├── README.md
├── PROJECT.md                   # 详细项目说明
│
├── lessons/                     # 📚 教学内容源文件（18 课 × 5 文件 = 90 个 Markdown）
│   └── 01/ ~ 18/
│       ├── 讲义.md
│       ├── 实践活动.md
│       ├── 学生任务单.md
│       ├── 教师参考.md
│       └── 素材清单.md
│
├── contest-templates/           # 🏆 7 份赛事对接模板（源）
│   ├── 创意设计方案模板.md
│   ├── 研究报告模板.md
│   ├── 查新报告模板.md
│   ├── 研究日志模板.md
│   ├── 展示海报规范.md
│   ├── 答辩PPT骨架.md
│   └── 展示视频指南.md
│
├── docs/                        # 📖 课程文档
│   ├── 课程大纲.md
│   └── 文档规范.md
│
└── docs-site/                   # 🌐 VitePress 网站项目
    ├── index.md                 # 首页
    ├── overview.md              # 课程总览
    ├── resources.md             # 资源下载
    │
    ├── lessons/                 # 18 个课时页面（lesson-01.md ~ lesson-18.md）
    ├── contest/                 # 赛事专区（9 个页面）
    ├── tools/                   # 交互工具页面（6 个 + 3 指南 + 1 自检）
    │
    ├── public/
    │   ├── logo.svg             # 网站 Logo
    │   ├── history/             # 29 张历史图片（本地化，无外部依赖）
    │   └── paper-airplane/      # 10 张纸飞机教学图
    │
    └── .vitepress/
        ├── config.ts            # VitePress 配置（导航/侧边栏/KaTeX）
        ├── components/          # Vue 交互组件（含共享物理模块引用）
        │   ├── OrbitCalculator.vue        # 🛰️ 轨道参数计算器
        │   ├── RocketSimulator.vue        # 🚀 火箭仿真器
        │   ├── AerodynamicsLab.vue        # 🛩️ 升力演示器
        │   ├── SpaceTimeline.vue          # 📜 航天成就时间线
        │   ├── MissionSimulator.vue       # 🎯 航天任务模拟器
        │   ├── ScienceDiagram.vue         # 📊 10 类科学示意图
        │   ├── HistoryGallery.vue         # 🖼️ 历史图片轮播
        │   ├── AviationHistory.vue        # ✈️ 航空史封装
        │   ├── SpaceHistory.vue           # 🚀 航天史封装
        │   └── MathFormula.vue            # 📐 公式渲染组件
        ├── data/
        │   ├── historyData.ts    # 历史数据（航空+航天）
        │   └── toolResources.ts  # 在线体验工具资源（14 课次嵌入）
        ├── utils/
        │   └── physics.ts        # 物理计算共享模块（ISA/轨道/火箭/升力）
        ├── theme/
        │   ├── index.ts          # 主题入口（注册全局组件）
        └── styles/
            └── custom.css        # 深空主题样式

test/
└── physics.test.mjs           # 物理计算单元测试（21 项，npm test）
```

## 🌐 部署

详见 [DEPLOY.md](./DEPLOY.md)。简要说明：

### Linux 服务器（Nginx，标准生产方案）
```bash
npm install
npm run build
sudo cp -r docs-site/.vitepress/dist/* /var/www/spacecourse/
# 配置 nginx 指向该目录（项目提供 deploy/nginx.conf 一键脚本见 deploy/）
```

### Vercel / Netlify / Cloudflare Pages
- Build command: `npm run build`
- Output directory: `docs-site/.vitepress/dist`

## 📊 项目统计

- **教学内容**：100+ Markdown 文件（18 课时 × 5 件套 + 7 赛事模板）
- **网站页面**：37 个 HTML 页面
- **交互工具**：6 个自研中文工具（升力演示器/大气参数计算器/轨道计算器/火箭仿真器/航天时间线/任务模拟器）
- **图片资源**：29 张历史图片（1783-2026）+ 10 张纸飞机教学图（本地化，无外部依赖）
- **Vue 组件**：16 个
- **物理单元测试**：21 项（`npm test`，覆盖 ISA 大气/轨道/火箭方程/升力模型）
- **构建产物**：纯静态，可部署任意平台

## 📝 教学法

- **PBL**（项目式学习）：学期长项目"航天创意设计"，6 件套作品包对接赛事
- **EDP**（工程设计过程）：Ask → Imagine → Plan → Create → Test → Improve
- **5E 教学法**：Engage → Explore → Explain → Elaborate → Evaluate

## 📄 License

GPL-2.0（见 [LICENSE](./LICENSE)）
