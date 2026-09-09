# 📖 NASA Eyes & Worldview 中文使用指南

> 两个 NASA 官方可视化工具的快速上手指南（英文界面 + 中文说明）。

---

## Part 1：NASA Eyes（太阳系 3D 漫游）

### 打开

访问 https://eyes.nasa.gov/ → 首次加载约 20-40 秒（3D 引擎初始化）。

### 三个入口

| 入口 | 内容 | 推荐场景 |
|---|---|---|
| **Eyes on the Earth** | 地球卫星实时位置 | 第 9 课看轨道类型分布 |
| **Eyes on the Solar System** | 太阳系行星/探测器 | 第 1 课开场漫游 |
| **Eyes on the Deep Space** | 深空望远镜（韦布等）| 拓展视野 |

### 基本操作（30 秒学会）

| 操作 | 动作 |
|---|---|
| 旋转视角 | 鼠标左键拖动 |
| 缩放 | 滚轮 / 右键拖动 |
| 跟随天体 | 点击左侧天体列表中的名字 |
| 加速时间 | 底部时间轴拖动（看卫星绕圈）|
| 查看轨道线 | 勾选 "Orbits" |

### 课堂任务（第 9 课）

1. 打开 Eyes on the Earth → 左侧选 **ISS（国际空间站）**
2. 拖动底部时间轴加速 → 观察 ISS 约 90 分钟绕地球一圈
3. 在天体列表里找一颗 GPS 卫星 → 对比它绕一圈要多久（约 12 小时）
4. 结论：轨道越高，周期越长（开普勒第三定律的直观验证）

### 术语对照

| 英文 | 中文 |
|---|---|
| Orbit | 轨道 |
| Spacecraft | 航天器 |
| Real-time | 实时 |
| Speed | 时间倍速 |
| Live position | 实时位置 |

---

## Part 2：NASA Worldview（每日卫星影像）

### 打开

访问 https://worldview.earthdata.nasa.gov/ → 加载约 15-30 秒。

### 三步上手

1. **选图层**（左上角 Layers → Add Layers）：
   - 推荐第一层：`Corrected Reflectance (True Color)` 真彩色影像
2. **选日期**（底部时间条）：默认今天，可拖回任意历史日期
3. **找地点**（顶部搜索框）：输入城市拼音如 `Shenzhen`，回车定位

### 课堂任务（第 15 课遥感判读）

1. 搜索定位到你的城市 → 今天的影像
2. 判读：哪里是水体（深色）？植被（红色调取决于图层）？城市（灰白）？
3. 加第二个图层 `Fires and Thermal Anomalies`（火点）→ 看今天全球哪里有火灾
4. 拖日期到台风天 → 观察台风云系的螺旋结构

### 术语对照

| 英文 | 中文 |
|---|---|
| Layers | 图层 |
| True Color | 真彩色 |
| Add Layers | 添加图层 |
| Date | 日期 |
| Fires / Thermal Anomalies | 火点/热异常 |
| Compare | 对比模式（两个日期对比）|

### 💡 网络提示

两个工具均为境外站点，校园网首次加载较慢属正常。若持续无法加载，可改用：
- 本站[轨道参数计算器](/tools/orbit-calculator)（轨道原理）
- 中国气象局风云卫星图（中文）：http://www.nsmc.org.cn/
