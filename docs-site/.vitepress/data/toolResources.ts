// 在线体验资源数据（P0.1 中文化优化版）
// 原则：课堂主力 = 本站自研中文工具（秒开）；英文工具降为课后拓展，配中文指南
// lang: zh/en  |  speed: local(本站秒开)/fast(快)/slow(境外慢载)

export interface ToolResource {
  name: string
  type: 'web' | 'desktop' | 'python'
  level: 'beginner' | 'intermediate' | 'advanced'
  desc: string
  usage: string
  url: string
  guideUrl?: string
  backup?: string
  lang?: 'zh' | 'en'
  speed?: 'local' | 'fast' | 'slow'
}

// 按课次组织的在线工具（课堂主力在前，拓展在后）
export const lessonTools: Record<number, ToolResource[]> = {
  1: [
    {
      name: '本站：航天任务模拟器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '设计航天任务：选任务→选轨道→选火箭→选载荷，系统评估可行性。中文界面秒开。',
      usage: '第 1 课开场体验"像总设计师一样思考"，激发兴趣。',
      url: '/tools/mission-simulator'
    },
    {
      name: '本站：中国航天成就时间线',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '1970-2026 交互式时间线，18 个里程碑可展开详情，配真实历史照片。',
      usage: '讲"中国空天事业里程碑"时的互动演示。',
      url: '/tools/timeline'
    },
    {
      name: 'NASA Eyes（课后拓展）',
      type: 'web', level: 'beginner', lang: 'en', speed: 'slow',
      desc: 'NASA 官方 3D 可视化：实时卫星位置、行星运动、深空探测器轨迹。',
      usage: '课后探索：在真实数据中"飞"到国际空间站。英文界面，参照中文指南操作。',
      url: 'https://eyes.nasa.gov/',
      guideUrl: '/tools/guide-nasa-eyes'
    }
  ],
  2: [
    {
      name: '本站：大气参数计算器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '基于 ISA 国际标准大气模型：拖动高度滑块，实时查温度/气压/密度/声速 + 曲线图，还可反推 BMP280 实验高度。',
      usage: '本课核心工具：配合 BMP280 实测数据，验证气压测高公式（替代 NASA AtmosModeler）。',
      url: '/tools/atmosphere'
    },
    {
      name: 'NASA AtmosModeler（课后拓展）',
      type: 'web', level: 'beginner', lang: 'en', speed: 'slow',
      desc: 'NASA 官方大气模型工具，与本站计算器同原理。',
      usage: '课后对比：用 NASA 工具验证本站计算结果是否一致（英文界面，首次加载较慢）。',
      url: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/atmosmodeler/'
    }
  ],
  3: [
    {
      name: '本站：升力演示器（含数据记录）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '调速度/迎角/翼面积看气流动画与升力变化；新增"数据记录表"——调参记录做探究实验（控制变量法）。',
      usage: '本课核心探究工具：①只改迎角记录8组看线性关系 ②找到失速点 ③验证 v 翻倍升力4倍。',
      url: '/tools/aerodynamics-lab'
    },
    {
      name: 'NASA FoilSim III（课后拓展）',
      type: 'web', level: 'intermediate', lang: 'en', speed: 'slow',
      desc: 'NASA 官方翼型实验室：拖滑块看升阻变化和绕流动画（CheerpJ 技术，首次加载约 30-60 秒）。',
      usage: '课后进阶：参照中文指南，探究不同翼型（NACA 编号）的升阻差异。',
      url: 'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/foilsimstudent/',
      guideUrl: '/tools/guide-foilsim'
    }
  ],
  4: [
    {
      name: 'B站：98.43 米！纸飞机最远距离世界纪录',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'fast',
      desc: '上海学生刷新纸飞机最远投掷距离世界纪录（98.43 米）的新闻报道——课堂导入首选，用真实纪录点燃兴趣。',
      usage: '第 4 课开场 3 分钟播放，引出"纸飞机背后是工程学"的课题。',
      url: 'https://www.bilibili.com/video/BV1SbiKBWEk6/'
    },
    {
      name: 'B站：逆天滞空纸飞机 Star16（28.7 秒）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'fast',
      desc: '室内滞空 28.7 秒的超强纸飞机设计解析——滞空挑战的最佳参照。',
      usage: 'Phase 1 头脑风暴阶段播放，激发"我的飞机为什么飞不了这么久"的探究欲。',
      url: 'https://www.bilibili.com/video/BV1qay1BPEpN/'
    },
    {
      name: '中科院物理所：如何折一架飞得最远的纸飞机',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'fast',
      desc: '中科院物理所科普文章（腾讯新闻转载），从物理原理讲纸飞机优化——权威中文科普。',
      usage: '课后阅读：对照本文检验你本课的改进方向是否有理论依据。',
      url: 'http://news.qq.com/rain/a/20251213A03FN000'
    },
    {
      name: 'B站：Takuo Toda「老虎战机」折法教学',
      type: 'web', level: 'intermediate', lang: 'zh', speed: 'fast',
      desc: '世界纪录保持者戸田拓夫的招牌机折法教学视频。',
      usage: 'Phase 4 迭代卡壳时参考：世界级机型是怎么折的。',
      url: 'https://www.bilibili.com/video/BV1NfxDzKEFB/'
    }
  ],
  5: [
    {
      name: '本站：升力演示器（试飞前仿真）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '滑翔机试飞前：用"数据记录表"预测你的重心/翼面配置的飞行表现，试飞后对比。',
      usage: '试飞配平的 EDP 预测环节：先仿真记录预测值，再实测对照。',
      url: '/tools/aerodynamics-lab'
    }
  ],
  6: [
    {
      name: '本站：航天任务模拟器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '任务-轨道-火箭-载荷匹配训练，理解系统思维。',
      usage: '无人机系统讲解后，用任务模拟器巩固"系统=模块协同"的概念。',
      url: '/tools/mission-simulator'
    },
    {
      name: 'ArduPilot SITL 无人机仿真（社团进阶）',
      type: 'desktop', level: 'advanced', lang: 'en', speed: 'fast',
      desc: '全球最流行开源飞控，SITL 软件在环仿真——零硬件在电脑里飞无人机。',
      usage: '社团进阶：装 SITL + MissionPlanner 体验真实飞控参数与自动航线（需教师指导安装）。',
      url: 'https://github.com/ArduPilot/ardupilot'
    }
  ],
  8: [
    {
      name: 'NASA Smart Skies 空管数学（教师演示）',
      type: 'web', level: 'beginner', lang: 'en', speed: 'slow',
      desc: 'NASA 与 FAA 联合开发：比例推理解决空管冲突，含在线习题。',
      usage: '飞行挑战赛后加"空管数学"环节（教师投屏演示，学生心算参与）。',
      url: 'https://www.nasa.gov/directorates/armd/smart-skies/'
    },
    {
      name: 'openScope 空管模拟（社团拓展）',
      type: 'web', level: 'intermediate', lang: 'en', speed: 'slow',
      desc: '浏览器当塔台：指挥起降、调配冲突，全球多机场。航空术语较多，适合航空迷。',
      usage: '社团活动：体验真实空管工作（英文+航空术语，建议参照指南）。',
      url: 'https://openscope.io'
    }
  ],
  9: [
    {
      name: '本站：轨道参数计算器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '输入高度实时算轨道速度/周期，配卫星运动动画，含 ISS/GEO/北斗预设。',
      usage: '本课核心工具：讲万有引力=向心力和开普勒第三定律时配合使用。',
      url: '/tools/orbit-calculator'
    },
    {
      name: '本站：航天任务模拟器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: 'LEO/MEO/GEO/SSO 轨道匹配训练：什么任务用什么轨道？',
      usage: '轨道类型讲解后的巩固练习："为任务选轨道"游戏替代品。',
      url: '/tools/mission-simulator'
    },
    {
      name: 'Skyfield 卫星过境预报（编程拓展）',
      type: 'python', level: 'advanced', lang: 'en', speed: 'fast',
      desc: 'Python 天文计算库，可预报中国空间站今晚几点过境头顶。',
      usage: '编程拓展：机房 Python 环境 pip install skyfield，运行本课提供的中文注释脚本。',
      url: 'https://github.com/skyfielders/python-skyfield'
    }
  ],
  10: [
    {
      name: '本站：火箭仿真器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '齐奥尔科夫斯基方程 + 飞行动画 + 高度-时间曲线，含 A8-3/水火箭预设。',
      usage: '讲火箭方程时配合使用，直观理解质量比与 Δv 的对数关系。',
      url: '/tools/rocket-simulator'
    }
  ],
  11: [
    {
      name: '本站：火箭仿真器（水火箭预设）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '选"水火箭 1L"预设：估算射高，理解为什么水占 1/3 最佳。',
      usage: '发射前预测：先仿真估算射高，发射后实测对比（EDP 闭环）。',
      url: '/tools/rocket-simulator'
    },
    {
      name: 'NASA 水火箭安全指南（官方）',
      type: 'web', level: 'beginner', lang: 'en', speed: 'slow',
      desc: 'NASA 官方安全规范——本课安全告知书的技术依据（教师用）。',
      usage: '教师课前研读；学生安全告知书内容与此对齐。',
      url: 'https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/safety.htm'
    },
    {
      name: 'WaterRocketPy 水火箭仿真（Python 拓展）',
      type: 'python', level: 'intermediate', lang: 'en', speed: 'fast',
      desc: '完整水火箭物理建模库，比本站估算精确（含水/气两相推力）。',
      usage: '课后编程拓展：pip install waterrocketpy 建模自己的水火箭。',
      url: 'https://github.com/Cube002/waterrocketpy'
    }
  ],
  12: [
    {
      name: 'OpenRocket 模型火箭设计（可切中文）',
      type: 'desktop', level: 'beginner', lang: 'zh', speed: 'fast',
      desc: '行业标准模型火箭仿真软件，内置简体中文界面！设计→仿真射高→稳定性分析。',
      usage: '本课核心软件：先按指南切换中文界面，再设计目标高度 100m 的火箭。',
      url: 'https://openrocket.info/',
      guideUrl: '/tools/guide-openrocket'
    },
    {
      name: '本站：火箭仿真器（原理热身）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: 'OpenRocket 上机前的网页版热身：先理解 Δv 和质量比。',
      usage: '上机前 5 分钟全班热身。',
      url: '/tools/rocket-simulator'
    }
  ],
  13: [
    {
      name: '本站：航天任务模拟器（载荷思维）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '"载荷是卫星的灵魂"——在模拟器中体会任务目标如何决定载荷选择。',
      usage: '讲分系统与载荷概念后的互动巩固。',
      url: '/tools/mission-simulator'
    }
  ],
  14: [
    {
      name: '本站：轨道参数计算器',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: 'CanSat 下降过程的高度-气压关系查询（配合数据分析环节）。',
      usage: '数据可视化环节：查 ISA 气压对照实验数据，评估偏差。',
      url: '/tools/atmosphere'
    },
    {
      name: 'UniSat 开源卫星平台（竞赛进阶）',
      type: 'python', level: 'advanced', lang: 'en', speed: 'fast',
      desc: 'Apache-2.0 开源卫星固件：支持 CanSat/立方星等 14 种形态，内置竞赛指南。',
      usage: '社团竞赛方向：把本课 CanSat 升级为可参赛系统（需教师指导）。',
      url: 'https://github.com/root3315/unisat'
    }
  ],
  15: [
    {
      name: '本站：航天任务模拟器（北斗专题）',
      type: 'web', level: 'beginner', lang: 'zh', speed: 'local',
      desc: '选"导航定位"任务 → 系统推荐 MEO 轨道：理解北斗为什么用 21528km。',
      usage: '北斗三步走讲解后的互动验证。',
      url: '/tools/mission-simulator'
    },
    {
      name: 'NASA Worldview 每日卫星影像（遥感探究）',
      type: 'web', level: 'beginner', lang: 'en', speed: 'slow',
      desc: 'NASA 官方全球影像浏览器：任意日期地点的卫星影像，台风/火灾实时可见。',
      usage: '遥感判读素材库：找家乡影像、看台风云系（页面加载较慢，参照中文指南 3 步上手）。',
      url: 'https://worldview.earthdata.nasa.gov/',
      guideUrl: '/tools/guide-nasa-eyes'
    },
    {
      name: 'N2YO 卫星实时追踪（北斗验证）',
      type: 'web', level: 'beginner', lang: 'en', speed: 'slow',
      desc: '实时追踪 3 万+在轨卫星，可看北斗/中国空间站实时位置。',
      usage: '课后验证：北斗 30 颗卫星是不是分布在 MEO/GEO/IGSO 三种轨道？',
      url: 'https://www.n2yo.com/'
    }
  ]
}

// 全站资源汇总
export const allTools: ToolResource[] = Object.values(lessonTools).flat()

// 获取某课的工具
export function getToolsForLesson(lesson: number): ToolResource[] {
  return lessonTools[lesson] || []
}
