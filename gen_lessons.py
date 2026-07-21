"""
重新生成 18 个课时页面（内联 5 个内容文件，确保 KaTeX 公式渲染）
"""
import os

LESSONS = {
    1:  ("飞天梦启航：空天科技与赛事导论", "导论", "理论+项目启动"),
    2:  ("大气层与飞行环境", "航空", "理论+实验"),
    3:  ("飞行原理：升力、阻力与伯努利", "航空", "理论+实验"),
    4:  ("纸飞机工程挑战：EDP 入门", "航空", "实操"),
    5:  ("手掷滑翔机制作与试飞", "航空", "实操"),
    6:  ("无人机系统与模拟飞行", "航空", "实操+PBL节点"),
    7:  ("无人机编程飞行", "航空", "实操"),
    8:  ("航空模块挑战日：飞行任务综合赛", "航空", "项目评估"),
    9:  ("航天动力学：轨道、速度与引力", "航天", "理论"),
    10: ("火箭推进原理", "航天", "理论+实验"),
    11: ("水火箭设计与发射", "航天", "实操"),
    12: ("模型火箭仿真与制作", "航天", "实操+高校合作"),
    13: ("立方星与卫星载荷", "航天", "理论+实操入门"),
    14: ("微型卫星数据采集任务", "航天", "实操+PBL节点"),
    15: ("卫星应用：北斗导航与遥感", "航天", "理论+实操"),
    16: ("创意设计工作坊：从方案到原型", "综合", "项目"),
    17: ("作品打磨：海报、视频与答辩准备", "综合", "项目"),
    18: ("终极答辩会：模拟国赛展演", "综合", "评估"),
}

MODULE_STYLE = {
    "航空": "🛩️",
    "航天": "🚀",
    "综合": "💡",
    "导论": "🌟",
}

TOOL_LINKS = {
    3:  ("🛩️ 升力演示器", "/tools/aerodynamics-lab"),
    9:  ("🛰️ 轨道计算器", "/tools/orbit-calculator"),
    10: ("🚀 火箭仿真器", "/tools/rocket-simulator"),
    11: ("🚀 火箭仿真器", "/tools/rocket-simulator"),
    12: ("🚀 火箭仿真器", "/tools/rocket-simulator"),
    13: ("🛰️ 轨道计算器", "/tools/orbit-calculator"),
    14: ("🛰️ 轨道计算器", "/tools/orbit-calculator"),
    15: ("🛰️ 轨道计算器", "/tools/orbit-calculator"),
}

OUTPUT_DIR = r"C:\zprojects\spacecourse\docs-site\lessons"
SOURCE_BASE = r"C:\zprojects\spacecourse\lessons"

def read_and_strip(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    lines = content.split("\n")
    if lines and lines[0].startswith("# "):
        lines = lines[1:]
        while lines and not lines[0].strip():
            lines.pop(0)
    return "\n".join(lines)


# 每课在特定锚点后插入的科学示意图
# 格式：(匹配的章节标题, 图示配置)
LESSON_DIAGRAMS = {
    1: [
        ("### 一、航空与航天：一条看不见的线",
         '<AviationHistory />\n\n<ScienceDiagram type="karmanLine" title="🌍 大气分层与卡门线（100km）" caption="航空（<100km，靠空气飞行）与航天（≥100km，靠轨道运动）的分界线" />'),
    ],
    2: [
        ("### 一、",
         '<ScienceDiagram type="karmanLine" title="🌍 大气分层结构" caption="对流层/平流层/中间层/热层/散逸层，及主要飞行器分布" />'),
    ],
    3: [
        ("### 一、伯努利原理",
         '<ScienceDiagram type="bernoulliAirfoil" title="✈️ 翼型气流与伯努利原理" caption="上表面流速快→压强低；下表面流速慢→压强高，压强差产生升力" />'),
        ("### 五、四力平衡",
         '<ScienceDiagram type="fourForces" title="⚖️ 匀速平飞时的四力平衡" caption="升力=重力，推力=阻力" />'),
    ],
    4: [
        ("### 一、",
         '<ScienceDiagram type="edpCycle" title="🔄 EDP 工程设计过程六步循环" caption="Ask→Imagine→Plan→Create→Test→Improve（循环迭代）" />'),
    ],
    6: [
        ("### 一、",
         '<ScienceDiagram type="quadcopter" title="🚁 四旋翼无人机原理" caption="对角线同向旋转 + 相邻反向旋转，抵消反扭矩" />'),
    ],
    7: [
        ("### 一、",
         '<ScienceDiagram type="quadcopter" title="🚁 四旋翼无人机原理（回顾）" caption="对角线同向旋转 + 相邻反向旋转，抵消反扭矩" />'),
    ],
    9: [
        ("### 一、卫星为什么不会掉下来",
         '<SpaceHistory />\n'),
        ("### 三、四类常见轨道",
         '<ScienceDiagram type="orbitTypes" title="🛰️ LEO/MEO/GEO 三种典型轨道对比" caption="轨道越高 → 速度越慢，周期越长（开普勒第三定律）" />'),
    ],
    10: [
        ("### 一、火箭",
         '<ScienceDiagram type="rocketRecoil" title="🚀 火箭反冲推进原理" caption="动量守恒：喷出气流 → 火箭前进，真空中同样有效" />'),
    ],
    11: [
        ("### 一、",
         '<ScienceDiagram type="waterRocket" title="💧 水火箭结构与原理" caption="水占1/3最佳，压缩空气储能，喷水反冲推进" />'),
    ],
    13: [
        ("### 一、CubeSat",
         '<ScienceDiagram type="cubesat" title="🛰️ CubeSat 立方星结构" caption="1U=10×10×10cm，标准化接口降低研制门槛" />'),
    ],
    15: [
        ("### 一、",
         '<ScienceDiagram type="beidouNav" title="🧭 北斗三号三种轨道星座" caption="GEO+IGSO+MEO 三种轨道组合实现全球覆盖" />'),
    ],
}


def insert_diagrams(content, lesson_num):
    """在指定章节后插入科学示意图"""
    if lesson_num not in LESSON_DIAGRAMS:
        return content
    for anchor, diagram in LESSON_DIAGRAMS[lesson_num]:
        if anchor in content:
            content = content.replace(anchor, anchor + "\n\n" + diagram + "\n", 1)
    return content


def gen_lesson_page(num, title, module, lesson_type):
    lesson_dir = f"{num:02d}"
    icon = MODULE_STYLE[module]

    pbl_mark = ""
    if num == 6:
        pbl_mark = " ⭐ **PBL 中期节点：选题确认**"
    elif num == 14:
        pbl_mark = " ⭐ **PBL 里程碑：原型定稿**"
    elif num == 18:
        pbl_mark = " 🏆 **全课程收官**"

    tool_html = ""
    if num in TOOL_LINKS:
        tool_name, tool_link = TOOL_LINKS[num]
        tool_html = f"""
<div class="tool-banner">
  <span>🛠️ 本课配套工具：</span>
  <a href="{tool_link}">{tool_name} →</a>
</div>"""

    lecture = read_and_strip(os.path.join(SOURCE_BASE, lesson_dir, "讲义.md"))
    practice = read_and_strip(os.path.join(SOURCE_BASE, lesson_dir, "实践活动.md"))
    task = read_and_strip(os.path.join(SOURCE_BASE, lesson_dir, "学生任务单.md"))
    teacher = read_and_strip(os.path.join(SOURCE_BASE, lesson_dir, "教师参考.md"))
    material = read_and_strip(os.path.join(SOURCE_BASE, lesson_dir, "素材清单.md"))

    # 为讲义插入科学示意图
    lecture = insert_diagrams(lecture, num)

    content = f"""---
title: 第 {num} 课 · {title}
---

# {icon} 第 {num} 课 · {title}

> **模块**：{module} ｜ **课时**：45 分钟 ｜ **类型**：{lesson_type}{pbl_mark}
{tool_html}

<div class="lesson-nav">
  <a href="#讲义">📖 讲义</a>
  <a href="#实践活动">🔬 实践活动</a>
  <a href="#学生任务单">✏️ 学生任务单</a>
  <a href="#教师参考">👨‍🏫 教师参考</a>
  <a href="#素材清单">📋 素材清单</a>
</div>

## 📖 讲义

{lecture}

## 🔬 实践活动

{practice}

## ✏️ 学生任务单

{task}

## 👨‍🏫 教师参考

{teacher}

## 📋 素材清单

{material}

<style>
.lesson-nav {{
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0 2rem;
  position: sticky;
  top: 60px;
  z-index: 10;
}}
.lesson-nav a {{
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}}
.lesson-nav a:hover {{
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}}
.tool-banner {{
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.6rem 1rem;
  background: rgba(79, 195, 247, 0.08);
  border-left: 3px solid #4fc3f7;
  border-radius: 6px;
  margin: 1rem 0;
}}
.tool-banner a {{
  color: var(--vp-c-brand-1);
  font-weight: 600;
}}
</style>
"""
    return content


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for num, (title, module, lesson_type) in LESSONS.items():
        content = gen_lesson_page(num, title, module, lesson_type)
        output_path = os.path.join(OUTPUT_DIR, f"lesson-{num:02d}.md")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ lesson-{num:02d}.md")
    print(f"\n🎉 {len(LESSONS)} 个课时页面生成完成！")


if __name__ == "__main__":
    main()
