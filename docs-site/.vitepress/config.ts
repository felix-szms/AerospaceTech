import { defineConfig } from 'vitepress'
// @ts-expect-error - katex 插件没有类型定义
import { katex as katexPlugin } from '@mdit/plugin-katex'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '空天科技探秘',
  description: '面向高一学生的空天科技选修课 · 航空 + 航天 + 创意设计',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    // KaTeX 样式
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css' }],
    ['meta', { name: 'theme-color', content: '#0a1929' }],
    // 中文字体优化
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }]
  ],

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',

    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '课程总览', link: '/overview' },
      {
        text: '课程教学',
        items: [
          { text: '🛩️ 航空模块（1-8课）', link: '/lessons/lesson-01' },
          { text: '🚀 航天模块（9-15课）', link: '/lessons/lesson-09' },
          { text: '💡 综合创意设计（16-18课）', link: '/lessons/lesson-16' }
        ]
      },
      {
        text: '交互工具',
        items: [
          { text: '🛩️ 升力演示器', link: '/tools/aerodynamics-lab' },
          { text: '🛰️ 轨道参数计算器', link: '/tools/orbit-calculator' },
          { text: '🚀 火箭仿真器', link: '/tools/rocket-simulator' },
          { text: '📜 航天成就时间线', link: '/tools/timeline' },
          { text: '🎯 航天任务模拟器', link: '/tools/mission-simulator' }
        ]
      },
      { text: '赛事专区', link: '/contest/' },
      { text: '资源下载', link: '/resources' }
    ],

    // 侧边栏（按模块分组，通过自定义匹配器动态显示）
    sidebar: {
      '/lessons/': getLessonSidebar(),
      '/contest/': getContestSidebar(),
      '/tools/': getToolsSidebar()
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索课程',
            buttonAriaLabel: '搜索'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    // 页脚
    footer: {
      message: '《空天科技探秘》高一选修课 · 对接全国青少年航天创新大赛',
      copyright: '基于 PBL + EDP + 5E 教学法设计'
    },

    // 大纲
    outline: {
      level: [2, 3],
      label: '本页导航'
    },

    // 文档元信息
    docFooter: {
      prev: '上一课',
      next: '下一课'
    },

    lastUpdatedText: '最后更新',

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '课程目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // Markdown 配置
  markdown: {
    // 配置 KaTeX 数学公式渲染（支持 $...$ 行内和 $$...$$ 块级）
    config: (md) => {
      md.use(katexPlugin, {
        throwOnError: false,
        strict: false,   // 允许中文等 Unicode 字符在公式中
        trust: true,     // 信任输入（允许 \text 中含中文等）
        output: 'htmlAndMathml'  // 输出 HTML+MathML，兼容性最好
      })
    },
    // 代码行高亮
    lineNumbers: true,
    // 主题
    theme: { light: 'github-light', dark: 'github-dark' }
  }
})

// 课程侧边栏配置
function getLessonSidebar() {
  return [
    {
      text: '🛩️ 航空模块',
      collapsed: false,
      items: [
        { text: '第1课 · 飞天梦启航', link: '/lessons/lesson-01' },
        { text: '第2课 · 大气层与飞行环境', link: '/lessons/lesson-02' },
        { text: '第3课 · 飞行原理', link: '/lessons/lesson-03' },
        { text: '第4课 · 纸飞机EDP入门', link: '/lessons/lesson-04' },
        { text: '第5课 · 手掷滑翔机', link: '/lessons/lesson-05' },
        { text: '第6课 · 无人机系统', link: '/lessons/lesson-06' },
        { text: '第7课 · 无人机编程飞行', link: '/lessons/lesson-07' },
        { text: '第8课 · 飞行挑战赛', link: '/lessons/lesson-08' }
      ]
    },
    {
      text: '🚀 航天模块',
      collapsed: false,
      items: [
        { text: '第9课 · 航天动力学', link: '/lessons/lesson-09' },
        { text: '第10课 · 火箭推进原理', link: '/lessons/lesson-10' },
        { text: '第11课 · 水火箭设计', link: '/lessons/lesson-11' },
        { text: '第12课 · 模型火箭仿真', link: '/lessons/lesson-12' },
        { text: '第13课 · 立方星与载荷', link: '/lessons/lesson-13' },
        { text: '第14课 · CanSat数据采集', link: '/lessons/lesson-14' },
        { text: '第15课 · 北斗与遥感', link: '/lessons/lesson-15' }
      ]
    },
    {
      text: '💡 综合创意设计',
      collapsed: false,
      items: [
        { text: '第16课 · 创意设计工作坊', link: '/lessons/lesson-16' },
        { text: '第17课 · 作品打磨与答辩', link: '/lessons/lesson-17' },
        { text: '第18课 · 终极答辩会', link: '/lessons/lesson-18' }
      ]
    }
  ]
}

// 赛事专区侧边栏
function getContestSidebar() {
  return [
    {
      text: '🏆 赛事指南',
      collapsed: false,
      items: [
        { text: '赛事总览', link: '/contest/' },
        { text: '航天创意赛规则', link: '/contest/contest-guide' }
      ]
    },
    {
      text: '📋 作品模板',
      collapsed: false,
      items: [
        { text: '创意设计方案模板', link: '/contest/template-proposal' },
        { text: '研究报告模板', link: '/contest/template-report' },
        { text: '查新报告模板', link: '/contest/template-novelty' },
        { text: '研究日志模板', link: '/contest/template-log' },
        { text: '展示海报规范', link: '/contest/template-poster' },
        { text: '答辩PPT骨架', link: '/contest/template-ppt' },
        { text: '展示视频指南', link: '/contest/template-video' }
      ]
    }
  ]
}

// 工具侧边栏
function getToolsSidebar() {
  return [
    {
      text: '🛠️ 交互工具',
      collapsed: false,
      items: [
        { text: '🛩️ 升力演示器', link: '/tools/aerodynamics-lab' },
        { text: '🛰️ 轨道参数计算器', link: '/tools/orbit-calculator' },
        { text: '🚀 火箭仿真器', link: '/tools/rocket-simulator' },
        { text: '📜 航天成就时间线', link: '/tools/timeline' },
        { text: '🎯 航天任务模拟器', link: '/tools/mission-simulator' }
      ]
    }
  ]
}
