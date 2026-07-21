## 项目概述

《空天科技探秘》高一选修课教学网站。面向高一年级，包含 18 课时教学内容（航空 + 航天 + 创意设计），对接全国青少年航天创新大赛。

核心交付物：
- 18 课时教学内容（每课 5 个 Markdown 文件，共 90 个）
- 7 份赛事对接模板
- 5 个交互式工具（升力演示器、轨道参数计算器、火箭仿真器、航天成就时间线、航天任务模拟器）
- 35 个 HTML 页面的 VitePress 静态站点

## 技术栈

| 技术 | 版本 | 用途 |
|---|---|---|
| VitePress | 1.6.4 | 静态站点生成（Markdown 驱动） |
| Vue 3 | 3.5.40 | 交互组件 |
| KaTeX | 0.18.1 | LaTeX 数学公式渲染 |
| @mdit/plugin-katex | 1.0.1 | VitePress KaTeX 集成 |
| Node.js | >= 18（当前 24） | 构建环境 |
| pnpm | 9.15.9 | 包管理器 |

## 目录结构

```
/workspace/projects/
├── .coze                          # 平台配置
├── AGENTS.md                      # 本文件
├── package.json                   # 项目配置（type: module）
├── gen_lessons.py                 # 课时页面生成脚本
├── lessons/                       # 18 课时源文件（每课 5 个 .md）
│   └── 01/ ~ 18/
├── contest-templates/             # 7 份赛事模板
├── docs/                          # 课程大纲、文档规范
├── docs-site/                     # VitePress 网站项目
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress 配置（导航、侧边栏、KaTeX）
│   │   ├── components/            # Vue 交互组件
│   │   └── theme/                 # 主题入口与样式
│   ├── index.md                   # 首页
│   ├── overview.md                # 课程总览
│   ├── lessons/                   # 18 个课时页面
│   ├── contest/                   # 赛事专区
│   ├── tools/                     # 交互工具页面
│   └── public/                    # 静态资源
├── scripts/                       # 预览与部署脚本
│   ├── coze-preview-build.sh      # 预览构建（安装依赖 + 生成课时页面）
│   ├── coze-preview-run.sh        # 预览启动（VitePress dev server :5000）
│   ├── build.sh                   # 部署构建（安装依赖 + 生成课时 + VitePress build）
│   └── run.sh                     # 部署启动（serve 静态文件 :5000）
└── deploy/                        # 部署配置（Nginx 独立部署）
    ├── deploy.sh
    ├── nginx.conf
    └── update.sh
```

## 关键入口 / 核心模块

- **VitePress 配置**：`docs-site/.vitepress/config.ts`（导航、侧边栏、KaTeX 插件）
- **主题入口**：`docs-site/.vitepress/theme/index.ts`（注册全局 Vue 组件）
- **自定义样式**：`docs-site/.vitepress/theme/styles/custom.css`（深空主题）
- **交互组件**：`docs-site/.vitepress/components/`（OrbitCalculator, RocketSimulator, SpaceTimeline, MissionSimulator）
- **课时生成脚本**：`gen_lessons.py`（从 lessons/ 源文件生成 docs-site/lessons/ 页面）

## 运行与预览

```bash
# 安装依赖
pnpm install

# 开发模式（VitePress dev server）
pnpm run dev

# 生产构建（输出到 docs-site/.vitepress/dist/）
pnpm run build

# 预览构建结果
pnpm run preview

# 重新生成课时页面
pnpm run gen-lessons
```

## 用户偏好与长期约束

- 包管理器使用 pnpm，禁止 npm / yarn
- Node.js 版本 >= 18
- 构建产物为纯静态文件，部署方式为 Nginx serve
- 项目语言为中文

## 常见问题和预防

- 修改 `lessons/` 源文件后需运行 `pnpm run gen-lessons` 重新生成课时页面
- KaTeX 公式使用 `$...$`（行内）和 `$$...$$`（块级）语法
- 交互组件为 Vue 3 SFC，需在 Markdown 中直接引用

## 预览与部署配置

### 预览链路（[dev]）

- **判定依据**：VitePress 静态站点，核心结果需通过浏览器交互验证，属于 web 预览型项目
- **预览入口**：VitePress dev server，绑定 `0.0.0.0:5000`
- **build 脚本**：`scripts/coze-preview-build.sh`（pnpm install + gen_lessons.py）
- **run 脚本**：`scripts/coze-preview-run.sh`（vitepress dev docs-site --host 0.0.0.0 --port 5000）
- 技术项目根目录与工作区根目录重合，`.coze` 为单文件（`path = "."`）

### 部署配置（[deploy]）

- **profile**：`kind = "service"`, `flavor = "web"`
- **build 脚本**：`scripts/build.sh`（pnpm install + gen_lessons.py + vitepress build）
- **run 脚本**：`scripts/run.sh`（npx serve docs-site/.vitepress/dist -l 5000）
- **构建产物**：`docs-site/.vitepress/dist/`
- **运行时**：`nodejs-24`

### 注意事项

- `gen_lessons.py` 中的路径已修复为基于脚本位置的相对路径（原为 Windows 硬编码路径）
- 部署使用 `serve` 包提供静态文件服务，已作为 devDependency 安装
- `deploy/` 目录下的脚本为独立 Nginx 部署方案，与平台部署配置无关
