"""
重新生成 18 个课时页面（内联 5 个内容文件，确保 KaTeX 公式渲染）

用法：python generate_lessons.py
输出：docs-site/lessons/lesson-XX.md（仅允许白名单内的字面量文件名）
"""
import os
from pathlib import Path

# ============ 路径白名单（全部为字面量，禁止动态拼接进入文件操作）============
PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = PROJECT_ROOT / "docs-site" / "lessons"
SOURCE_BASE = PROJECT_ROOT / "lessons"

# 课次号 → 课次子目录名（字面量白名单）
LESSON_DIRS = {
    1: "01", 2: "02", 3: "03", 4: "04", 5: "05", 6: "06", 7: "07", 8: "08", 9: "09",
    10: "10", 11: "11", 12: "12", 13: "13", 14: "14", 15: "15", 16: "16", 17: "17", 18: "18",
}

# 课次号 → 输出文件名（字面量白名单）
OUTPUT_FILES = {
    1: "lesson-01.md", 2: "lesson-02.md", 3: "lesson-03.md", 4: "lesson-04.md",
    5: "lesson-05.md", 6: "lesson-06.md", 7: "lesson-07.md", 8: "lesson-08.md",
    9: "lesson-09.md", 10: "lesson-10.md", 11: "lesson-11.md", 12: "lesson-12.md",
    13: "lesson-13.md", 14: "lesson-14.md", 15: "lesson-15.md", 16: "lesson-16.md",
    17: "lesson-17.md", 18: "lesson-18.md",
}

# 课次子目录 → 内容文件名（字面量白名单）
CONTENT_FILES = ("讲义.md", "实践活动.md", "学生任务单.md", "教师参考.md", "素材清单.md")


def resolve_in(base: Path, *literal_parts: str) -> Path:
    """将字面量路径片段限定在 base 目录内解析。

    - 片段必须是白名单字面量：非空、无路径分隔符、无 ..
    - 解析（规范化）后必须仍位于 base 内，否则拒绝
    """
    for part in literal_parts:
        if (
            not isinstance(part, str)
            or not part
            or part in (".", "..")
            or "/" in part
            or "\\" in part
            or ".." in part
        ):
            raise ValueError(f"非法路径片段: {part!r}")
    base_resolved = base.resolve()
    target = base_resolved.joinpath(*literal_parts).resolve()
    if target.parent != base_resolved.joinpath(*literal_parts[:-1]).resolve():
        raise ValueError(f"路径越界: {target} 不在 {base_resolved} 内")
    return target


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

# 配有"在线体验工具"区块的课次（与 toolResources.ts 的 lessonTools 键保持一致）
LESSON_TOOLS_SET = {1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15}


def read_and_strip(lesson_num: int, filename: str):
    """按白名单读取课时内容文件，去掉首行 H1 标题。"""
    if lesson_num not in LESSON_DIRS:
        raise ValueError(f"非法课次号: {lesson_num!r}")
    if filename not in CONTENT_FILES:
        raise ValueError(f"非法内容文件名: {filename!r}")
    path = resolve_in(SOURCE_BASE, LESSON_DIRS[lesson_num], filename)
    content = path.read_text(encoding="utf-8")
    lines = content.split("\n")
    if lines and lines[0].startswith("# "):
        lines = lines[1:]
        while lines and not lines[0].strip():
            lines.pop(0)
    return "\n".join(lines)


# 网站页面需要隐藏的板块关键词（命中二级标题即整节删除；
# lessons/ 源文件保持完整，仅供页面展示层过滤）
# 注意：素材清单用窄集——其"课前准备"节下嵌有视频/文档/软件资源（### 子节），需保留
STRIP_KEYWORDS_TASK = (
    "课后任务",
    "自评",
    "器材",
    "注意事项",
    "注意",
)
STRIP_KEYWORDS_GENERIC = (
    "器材",
    "注意事项",
    "注意",
    "赛事对接",
)


def strip_sections(text: str, keywords=STRIP_KEYWORDS_GENERIC) -> str:
    """删除命中关键词的二级标题（## ）整节内容，到下一个二级标题为止。"""
    lines = text.split("\n")
    kept: list = []
    skipping = False
    for line in lines:
        if line.startswith("## "):
            title = line[3:]
            skipping = any(kw in title for kw in keywords)
            if not skipping:
                kept.append(line)
            continue
        if not skipping:
            kept.append(line)
    # 压缩因删节产生的连续空行
    cleaned: list = []
    blank = 0
    for line in kept:
        if line.strip() == "":
            blank += 1
            if blank <= 2:
                cleaned.append(line)
        else:
            blank = 0
            cleaned.append(line)
    while cleaned and cleaned[-1].strip() == "":
        cleaned.pop()
    return "\n".join(cleaned)


# 每课在特定锚点后插入的科学示意图
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
        ("### 五、四力平衡：飞机怎么\"稳稳地飞\"",
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
    lesson_dir = LESSON_DIRS[num]
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

    lecture = read_and_strip(num, "讲义.md")
    practice = strip_sections(read_and_strip(num, "实践活动.md"))
    task = strip_sections(read_and_strip(num, "学生任务单.md"), STRIP_KEYWORDS_TASK)
    material = strip_sections(read_and_strip(num, "素材清单.md"))
    # 素材清单的"课前准备（教师）"节内是视频/文档/软件资源表（学生同样需要），
    # 保留内容但把标题改为面向全体的"教学资源"
    material = material.replace("## 课前准备（教师）", "## 🎬 教学资源")
    # 清理指向"教师参考"的正文引用（该板块已不展示在页面上）
    for ref in ("（见教师参考）", "(见教师参考)", "（详见教师参考）", "(详见教师参考)"):
        practice = practice.replace(ref, "")
        task = task.replace(ref, "")
        material = material.replace(ref, "")
        lecture = lecture.replace(ref, "")
    # 教师参考（含教学设计/差异化/赛事对接/课前清单等）不进入网站页面；
    # 完整内容保留在 lessons/NN/教师参考.md 源文件中供教师使用

    # 为讲义插入科学示意图
    lecture = insert_diagrams(lecture, num)

    # 有在线工具的课时，在实践活动前插入"在线体验"区块
    tools_html = f"\n<LessonTools :lesson=\"{num}\" />\n" if num in LESSON_TOOLS_SET else ""
    # 导航条上的"在线体验"锚点仅在该课有工具区块时输出（锚点目标由组件渲染）
    tools_nav = '\n  <a href="#在线体验工具">💻 在线体验</a>' if num in LESSON_TOOLS_SET else ""

    content = f"""---
title: 第 {num} 课 · {title}
---

# {icon} 第 {num} 课 · {title}

> **模块**：{module} ｜ **课时**：45 分钟 ｜ **类型**：{lesson_type}{pbl_mark}
{tool_html}

<div class="lesson-nav">
  <a href="#📖-讲义">📖 讲义</a>{tools_nav}
  <a href="#🔬-实践活动">🔬 实践活动</a>
  <a href="#✏️-学生任务单">✏️ 学生任务单</a>
  <a href="#📋-素材清单">📋 素材清单</a>
</div>

## 📖 讲义

{lecture}
{tools_html}
## 🔬 实践活动

{practice}

## ✏️ 学生任务单

{task}

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
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for num, (title, module, lesson_type) in LESSONS.items():
        content = gen_lesson_page(num, title, module, lesson_type)
        # 输出文件名来自字面量白名单映射，并校验解析后仍在 OUTPUT_DIR 内
        if num not in OUTPUT_FILES:
            raise ValueError(f"课次 {num!r} 无对应输出文件白名单")
        out_path = resolve_in(OUTPUT_DIR, OUTPUT_FILES[num])
        out_path.write_text(content, encoding="utf-8")
        print(f"✅ lesson-{num:02d}.md")
    print(f"\n🎉 {len(LESSONS)} 个课时页面生成完成！")


if __name__ == "__main__":
    main()
