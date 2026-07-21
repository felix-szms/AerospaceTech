<template>
  <div class="science-diagram">
    <div class="diagram-title" v-if="title">{{ title }}</div>
    <div class="diagram-canvas" v-html="svgContent"></div>
    <div class="diagram-caption" v-if="caption">{{ caption }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  title: String,
  caption: String
})

const diagrams = {
  // 卡门线：大气分层示意
  karmanLine: `<svg viewBox="0 0 560 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="atmGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#5dade2" stop-opacity="0.6"/>
        <stop offset="30%" stop-color="#85c1e9" stop-opacity="0.4"/>
        <stop offset="60%" stop-color="#1a5276" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000814" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <rect width="560" height="500" fill="#0a1929"/>
    <rect x="50" y="50" width="350" height="420" fill="url(#atmGrad)"/>
    <!-- 太空 -->
    <text x="225" y="35" fill="#ffd54f" text-anchor="middle" font-size="13" font-weight="bold">🌌 太空</text>
    <!-- 散逸层 -->
    <line x1="50" y1="70" x2="400" y2="70" stroke="#b388ff" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="410" y="74" fill="#b388ff" font-size="11">散逸层 &gt;800km</text>
    <!-- 热层 -->
    <line x1="50" y1="130" x2="400" y2="130" stroke="#9b59b6" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="410" y="100" fill="#9b59b6" font-size="11">热层 85-800km</text>
    <circle cx="225" cy="100" r="6" fill="#4fc3f7"/><text x="235" y="103" fill="white" font-size="10">国际空间站 420km</text>
    <circle cx="330" cy="115" r="5" fill="#ffd54f"/><text x="338" y="118" fill="white" font-size="10">卫星</text>
    <!-- 中间层 -->
    <line x1="50" y1="200" x2="400" y2="200" stroke="#e74c3c" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="410" y="204" fill="#e74c3c" font-size="11">中间层 50-85km</text>
    <!-- 平流层 -->
    <line x1="50" y1="290" x2="400" y2="290" stroke="#f39c12" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="410" y="245" fill="#ffd54f" font-size="11">平流层 12-50km</text>
    <text x="225" y="260" fill="white" text-anchor="middle" font-size="10">✈️ 客机巡航</text>
    <!-- 卡门线 -->
    <line x1="50" y1="280" x2="400" y2="280" stroke="#ff6b35" stroke-width="2.5"/>
    <text x="225" y="275" fill="#ff6b35" text-anchor="middle" font-size="12" font-weight="bold">⭐ 卡门线 100km</text>
    <!-- 对流层 -->
    <text x="225" y="320" fill="#5dade2" text-anchor="middle" font-size="11" font-weight="bold">对流层 0-12km</text>
    <text x="225" y="335" fill="white" text-anchor="middle" font-size="10">🌤️ 云 雨 雷暴</text>
    <circle cx="345" cy="340" r="15" fill="#ecf0f1" opacity="0.7"/>
    <circle cx="360" cy="345" r="12" fill="#ecf0f1" opacity="0.6"/>
    <!-- 地面 -->
    <rect x="50" y="460" width="350" height="10" fill="#27ae60"/>
    <text x="225" y="485" fill="#27ae60" text-anchor="middle" font-size="11">🌍 地表</text>
    <!-- 标签 -->
    <text x="225" y="490" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9">高度（非等比）</text>
  </svg>`,

  // 伯努利原理：翼型气流
  bernoulliAirfoil: `<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="300" fill="#0a1929"/>
    <!-- 流线（上方密集=流速快） -->
    <g stroke="#4fc3f7" fill="none" stroke-width="1.5" opacity="0.8">
      <path d="M0,60 Q250,30 500,60"/>
      <path d="M0,80 Q250,45 500,80"/>
      <path d="M0,100 Q250,60 500,100"/>
      <path d="M0,120 Q250,85 500,120"/>
    </g>
    <!-- 流线（下方稀疏=流速慢） -->
    <g stroke="#29b6f6" fill="none" stroke-width="1.5" opacity="0.6">
      <path d="M0,180 Q250,195 500,180"/>
      <path d="M0,210 Q250,215 500,210"/>
      <path d="M0,240 Q250,235 500,240"/>
    </g>
    <!-- 翼型 -->
    <path d="M150,150 Q250,115 380,150 Q250,165 150,150" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="2"/>
    <!-- 升力箭头 -->
    <line x1="265" y1="140" x2="265" y2="70" stroke="#ff6b35" stroke-width="3"/>
    <polygon points="265,60 258,75 272,75" fill="#ff6b35"/>
    <text x="280" y="90" fill="#ff6b35" font-size="13" font-weight="bold">升力 L</text>
    <!-- 压强标注 -->
    <text x="265" y="135" fill="#ff6b35" text-anchor="middle" font-size="10" font-weight="bold">低压（流速快）</text>
    <text x="265" y="185" fill="#4fc3f7" text-anchor="middle" font-size="10" font-weight="bold">高压（流速慢）</text>
    <!-- 气流方向 -->
    <text x="30" y="50" fill="#4fc3f7" font-size="11">气流 →</text>
    <text x="450" y="270" fill="rgba(255,255,255,0.5)" text-anchor="end" font-size="9">伯努利原理：流速大处压强小</text>
  </svg>`,

  // 四力平衡
  fourForces: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0a1929"/>
    <!-- 飞机简图 -->
    <ellipse cx="200" cy="150" rx="70" ry="15" fill="#ecf0f1"/>
    <polygon points="170,150 200,120 230,150" fill="#bdc3c7"/>
    <polygon points="180,150 200,165 220,150" fill="#bdc3c7"/>
    <!-- 升力（向上） -->
    <line x1="200" y1="140" x2="200" y2="60" stroke="#4fc3f7" stroke-width="3"/>
    <polygon points="200,50 193,65 207,65" fill="#4fc3f7"/>
    <text x="210" y="80" fill="#4fc3f7" font-size="13" font-weight="bold">升力 L ↑</text>
    <!-- 重力（向下） -->
    <line x1="200" y1="160" x2="200" y2="240" stroke="#e74c3c" stroke-width="3"/>
    <polygon points="200,250 193,235 207,235" fill="#e74c3c"/>
    <text x="210" y="230" fill="#e74c3c" font-size="13" font-weight="bold">重力 W ↓</text>
    <!-- 推力（向右） -->
    <line x1="270" y1="150" x2="360" y2="150" stroke="#2ecc71" stroke-width="3"/>
    <polygon points="370,150 355,143 355,157" fill="#2ecc71"/>
    <text x="290" y="140" fill="#2ecc71" font-size="13" font-weight="bold">推力 T →</text>
    <!-- 阻力（向左） -->
    <line x1="130" y1="150" x2="40" y2="150" stroke="#f39c12" stroke-width="3"/>
    <polygon points="30,150 45,143 45,157" fill="#f39c12"/>
    <text x="50" y="140" fill="#f39c12" font-size="13" font-weight="bold">← 阻力 D</text>
    <!-- 匀速平飞条件 -->
    <text x="200" y="280" fill="white" text-anchor="middle" font-size="11">匀速平飞：L = W，T = D</text>
  </svg>`,

  // EDP 工程设计过程
  edpCycle: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="400" fill="#0a1929"/>
    <!-- 中心 -->
    <circle cx="250" cy="200" r="45" fill="#1a3a5c" stroke="#4fc3f7" stroke-width="2"/>
    <text x="250" y="195" fill="#4fc3f7" text-anchor="middle" font-size="11" font-weight="bold">EDP</text>
    <text x="250" y="210" fill="white" text-anchor="middle" font-size="9">循环</text>
    <!-- 六个步骤（环形） -->
    <g font-size="11" font-weight="bold">
      <!-- 1 Ask -->
      <circle cx="250" cy="60" r="30" fill="#4fc3f7"/>
      <text x="250" y="55" text-anchor="middle" fill="#0a1929">1</text>
      <text x="250" y="70" text-anchor="middle" fill="#0a1929">Ask</text>
      <text x="250" y="100" text-anchor="middle" fill="white" font-size="9" font-weight="normal">提问</text>
      <!-- 2 Imagine -->
      <circle cx="380" cy="130" r="30" fill="#29b6f6"/>
      <text x="380" y="125" text-anchor="middle" fill="#0a1929">2</text>
      <text x="380" y="140" text-anchor="middle" fill="#0a1929">Imagine</text>
      <text x="420" y="135" fill="white" font-size="9" font-weight="normal">构思</text>
      <!-- 3 Plan -->
      <circle cx="380" cy="270" r="30" fill="#26c6da"/>
      <text x="380" y="265" text-anchor="middle" fill="#0a1929">3</text>
      <text x="380" y="280" text-anchor="middle" fill="#0a1929">Plan</text>
      <text x="420" y="275" fill="white" font-size="9" font-weight="normal">计划</text>
      <!-- 4 Create -->
      <circle cx="250" cy="340" r="30" fill="#66bb6a"/>
      <text x="250" y="335" text-anchor="middle" fill="#0a1929">4</text>
      <text x="250" y="350" text-anchor="middle" fill="#0a1929">Create</text>
      <text x="250" y="380" text-anchor="middle" fill="white" font-size="9" font-weight="normal">制作</text>
      <!-- 5 Test -->
      <circle cx="120" cy="270" r="30" fill="#ffd54f"/>
      <text x="120" y="265" text-anchor="middle" fill="#0a1929">5</text>
      <text x="120" y="280" text-anchor="middle" fill="#0a1929">Test</text>
      <text x="80" y="275" fill="white" font-size="9" font-weight="normal" text-anchor="end">测试</text>
      <!-- 6 Improve -->
      <circle cx="120" cy="130" r="30" fill="#ff6b35"/>
      <text x="120" y="125" text-anchor="middle" fill="#0a1929">6</text>
      <text x="120" y="140" text-anchor="middle" fill="#0a1929">Improve</text>
      <text x="80" y="135" fill="white" font-size="9" font-weight="normal" text-anchor="end">改进</text>
    </g>
    <!-- 箭头连接 -->
    <g stroke="#4fc3f7" stroke-width="1.5" fill="none" stroke-dasharray="3,3" opacity="0.6">
      <path d="M275,80 Q330,90 355,110"/>
      <path d="M380,160 Q380,200 380,240"/>
      <path d="M355,290 Q330,310 275,320"/>
      <path d="M225,320 Q170,310 145,290"/>
      <path d="M120,240 Q120,200 120,160"/>
      <path d="M145,110 Q170,90 225,80"/>
    </g>
  </svg>`,

  // 火箭反冲原理
  rocketRecoil: `<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="300" fill="#0a1929"/>
    <!-- 火箭 -->
    <path d="M180,130 L180,170 L240,170 L240,130 L225,110 L195,110 Z" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="2"/>
    <polygon points="180,130 195,110 195,130" fill="#ff6b35"/>
    <polygon points="240,130 225,110 225,130" fill="#ff6b35"/>
    <circle cx="210" cy="145" r="6" fill="#4fc3f7"/>
    <!-- 火焰 -->
    <path d="M180,135 Q160,150 145,135 Q150,150 140,160" stroke="#ffd54f" stroke-width="3" fill="none"/>
    <path d="M180,165 Q160,150 145,165 Q150,150 140,140" stroke="#ff6b35" stroke-width="3" fill="none"/>
    <!-- 排气方向 -->
    <text x="100" y="155" fill="#ffd54f" font-size="12" font-weight="bold">气流 ←</text>
    <text x="100" y="170" fill="white" font-size="10">v_e</text>
    <!-- 火箭运动方向 -->
    <line x1="250" y1="150" x2="330" y2="150" stroke="#2ecc71" stroke-width="3"/>
    <polygon points="340,150 325,143 325,157" fill="#2ecc71"/>
    <text x="290" y="140" fill="#2ecc71" font-size="12" font-weight="bold">火箭 →</text>
    <!-- 公式标注 -->
    <text x="250" y="220" fill="white" text-anchor="middle" font-size="11">动量守恒：m·v（气流）= M·V（火箭）</text>
    <text x="250" y="240" fill="#4fc3f7" text-anchor="middle" font-size="13" font-weight="bold">反冲推进，无需"推空气"</text>
    <text x="250" y="270" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-size="10">真空中同样有效</text>
  </svg>`,

  // 轨道类型对比
  orbitTypes: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="400" fill="#0a1929"/>
    <!-- 地球 -->
    <circle cx="250" cy="200" r="40" fill="url(#earthG)"/>
    <defs>
      <radialGradient id="earthG">
        <stop offset="0%" stop-color="#4fc3f7"/>
        <stop offset="70%" stop-color="#1976d2"/>
        <stop offset="100%" stop-color="#0d47a1"/>
      </radialGradient>
    </defs>
    <path d="M225,195 Q240,190 245,200 Q235,210 225,205" fill="#27ae60" opacity="0.7"/>
    <path d="M260,205 Q270,200 268,215" fill="#27ae60" opacity="0.6"/>
    <!-- LEO -->
    <circle cx="250" cy="200" r="60" fill="none" stroke="#4fc3f7" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="305" y="155" fill="#4fc3f7" font-size="11">LEO 低轨</text>
    <text x="305" y="168" fill="white" font-size="9">400-2000km</text>
    <text x="305" y="180" fill="rgba(255,255,255,0.6)" font-size="8">空间站·遥感·星链</text>
    <circle cx="310" cy="200" r="4" fill="#4fc3f7"/>
    <!-- MEO -->
    <circle cx="250" cy="200" r="100" fill="none" stroke="#ffd54f" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="345" y="115" fill="#ffd54f" font-size="11">MEO 中轨</text>
    <text x="345" y="128" fill="white" font-size="9">2000-35786km</text>
    <text x="345" y="140" fill="rgba(255,255,255,0.6)" font-size="8">北斗·GPS 导航</text>
    <circle cx="350" cy="200" r="4" fill="#ffd54f"/>
    <!-- GEO -->
    <circle cx="250" cy="200" r="160" fill="none" stroke="#ff6b35" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="405" y="55" fill="#ff6b35" font-size="11">GEO 地球静止</text>
    <text x="405" y="68" fill="white" font-size="9">35786km</text>
    <text x="405" y="80" fill="rgba(255,255,255,0.6)" font-size="8">通信·气象</text>
    <circle cx="410" cy="200" r="4" fill="#ff6b35"/>
    <!-- 标注 -->
    <text x="250" y="380" text-anchor="middle" fill="white" font-size="11">轨道高度越高 → 速度越慢，周期越长</text>
    <text x="250" y="395" text-anchor="middle" fill="#4fc3f7" font-size="10" font-weight="bold">开普勒第三定律：T² ∝ a³</text>
  </svg>`,

  // 立方星 CubeSat 结构
  cubesat: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#0a1929"/>
    <!-- 1U 立方星 -->
    <g transform="translate(120,100)">
      <!-- 主体 -->
      <rect x="0" y="0" width="160" height="160" fill="#1a3a5c" stroke="#4fc3f7" stroke-width="2"/>
      <rect x="0" y="0" width="160" height="160" fill="none" stroke="#4fc3f7" stroke-width="1" stroke-dasharray="2,2" transform="translate(5,5)"/>
      <!-- 太阳能板 -->
      <rect x="-50" y="40" width="40" height="80" fill="#000814" stroke="#ffd54f" stroke-width="1"/>
      <line x1="-50" y1="60" x2="-10" y2="60" stroke="#ffd54f" stroke-width="0.5"/>
      <line x1="-50" y1="80" x2="-10" y2="80" stroke="#ffd54f" stroke-width="0.5"/>
      <line x1="-50" y1="100" x2="-10" y2="100" stroke="#ffd54f" stroke-width="0.5"/>
      <rect x="170" y="40" width="40" height="80" fill="#000814" stroke="#ffd54f" stroke-width="1"/>
      <line x1="170" y1="60" x2="210" y2="60" stroke="#ffd54f" stroke-width="0.5"/>
      <line x1="170" y1="80" x2="210" y2="80" stroke="#ffd54f" stroke-width="0.5"/>
      <line x1="170" y1="100" x2="210" y2="100" stroke="#ffd54f" stroke-width="0.5"/>
      <!-- 天线 -->
      <line x1="80" y1="0" x2="80" y2="-30" stroke="#bdc3c7" stroke-width="2"/>
      <line x1="70" y1="0" x2="65" y2="-25" stroke="#bdc3c7" stroke-width="1.5"/>
      <line x1="90" y1="0" x2="95" y2="-25" stroke="#bdc3c7" stroke-width="1.5"/>
      <!-- 内部模块 -->
      <rect x="20" y="20" width="50" height="30" fill="#0d47a1" stroke="#4fc3f7" stroke-width="1"/>
      <text x="45" y="40" text-anchor="middle" fill="white" font-size="9">电源</text>
      <rect x="90" y="20" width="50" height="30" fill="#1b5e20" stroke="#66bb6a" stroke-width="1"/>
      <text x="115" y="40" text-anchor="middle" fill="white" font-size="9">飞控</text>
      <rect x="20" y="60" width="120" height="40" fill="#3e2723" stroke="#ffd54f" stroke-width="1"/>
      <text x="80" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">载荷 Payload</text>
      <rect x="20" y="110" width="50" height="30" fill="#4a148c" stroke="#b388ff" stroke-width="1"/>
      <text x="45" y="130" text-anchor="middle" fill="white" font-size="9">通信</text>
      <rect x="90" y="110" width="50" height="30" fill="#bf360c" stroke="#ff6b35" stroke-width="1"/>
      <text x="115" y="130" text-anchor="middle" fill="white" font-size="9">热控</text>
    </g>
    <!-- 标注 -->
    <text x="200" y="300" text-anchor="middle" fill="#4fc3f7" font-size="13" font-weight="bold">CubeSat 1U（10×10×10cm，约1kg）</text>
    <text x="200" y="325" text-anchor="middle" fill="white" font-size="11">标准化接口，降低卫星研制门槛</text>
    <text x="200" y="345" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="10">可扩展为 2U / 3U / 6U</text>
    <text x="200" y="380" text-anchor="middle" fill="#ffd54f" font-size="10" font-style="italic">八一·少年行、少年星一号</text>
  </svg>`,

  // 无人机四旋翼原理
  quadcopter: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0a1929"/>
    <!-- 中心 -->
    <rect x="170" y="130" width="60" height="40" fill="#1a3a5c" stroke="#4fc3f7" stroke-width="2" rx="5"/>
    <text x="200" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">飞控</text>
    <!-- 四个臂 -->
    <line x1="170" y1="140" x2="100" y2="80" stroke="#bdc3c7" stroke-width="3"/>
    <line x1="230" y1="140" x2="300" y2="80" stroke="#bdc3c7" stroke-width="3"/>
    <line x1="170" y1="160" x2="100" y2="220" stroke="#bdc3c7" stroke-width="3"/>
    <line x1="230" y1="160" x2="300" y2="220" stroke="#bdc3c7" stroke-width="3"/>
    <!-- 旋翼（旋转效果） -->
    <g>
      <circle cx="100" cy="80" r="25" fill="rgba(79,195,247,0.2)" stroke="#4fc3f7" stroke-width="1.5"/>
      <ellipse cx="100" cy="80" rx="22" ry="3" fill="#4fc3f7" opacity="0.6"/>
      <ellipse cx="100" cy="80" rx="3" ry="22" fill="#4fc3f7" opacity="0.6"/>
    </g>
    <g>
      <circle cx="300" cy="80" r="25" fill="rgba(79,195,247,0.2)" stroke="#4fc3f7" stroke-width="1.5"/>
      <ellipse cx="300" cy="80" rx="22" ry="3" fill="#4fc3f7" opacity="0.6"/>
      <ellipse cx="300" cy="80" rx="3" ry="22" fill="#4fc3f7" opacity="0.6"/>
    </g>
    <g>
      <circle cx="100" cy="220" r="25" fill="rgba(79,195,247,0.2)" stroke="#4fc3f7" stroke-width="1.5"/>
      <ellipse cx="100" cy="220" rx="22" ry="3" fill="#4fc3f7" opacity="0.6"/>
      <ellipse cx="100" cy="220" rx="3" ry="22" fill="#4fc3f7" opacity="0.6"/>
    </g>
    <g>
      <circle cx="300" cy="220" r="25" fill="rgba(79,195,247,0.2)" stroke="#4fc3f7" stroke-width="1.5"/>
      <ellipse cx="300" cy="220" rx="22" ry="3" fill="#4fc3f7" opacity="0.6"/>
      <ellipse cx="300" cy="220" rx="3" ry="22" fill="#4fc3f7" opacity="0.6"/>
    </g>
    <!-- 旋转方向标注 -->
    <text x="100" y="50" text-anchor="middle" fill="#ffd54f" font-size="14">↻</text>
    <text x="300" y="50" text-anchor="middle" fill="#ff6b35" font-size="14">↺</text>
    <text x="100" y="265" text-anchor="middle" fill="#ff6b35" font-size="14">↺</text>
    <text x="300" y="265" text-anchor="middle" fill="#ffd54f" font-size="14">↻</text>
    <!-- 升力箭头 -->
    <line x1="100" y1="55" x2="100" y2="25" stroke="#66bb6a" stroke-width="2"/>
    <polygon points="100,20 95,30 105,30" fill="#66bb6a"/>
    <text x="200" y="285" text-anchor="middle" fill="white" font-size="10">对角线同向 + 相邻反向 → 抵消反扭矩</text>
  </svg>`,

  // 水火箭结构
  waterRocket: `<svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="500" fill="#0a1929"/>
    <!-- 火箭主体（瓶身） -->
    <path d="M120,80 L120,380 L110,420 L110,440 L190,440 L190,420 L180,380 L180,80 Q180,40 150,30 Q120,40 120,80 Z" fill="#4fc3f7" fill-opacity="0.3" stroke="#4fc3f7" stroke-width="2"/>
    <!-- 鼻锥（配重） -->
    <ellipse cx="150" cy="55" rx="30" ry="25" fill="#ff6b35"/>
    <text x="150" y="60" text-anchor="middle" fill="white" font-size="9">配重</text>
    <!-- 尾翼 -->
    <polygon points="120,330 90,380 120,380" fill="#ffd54f" opacity="0.8"/>
    <polygon points="180,330 210,380 180,380" fill="#ffd54f" opacity="0.8"/>
    <!-- 水（占1/3） -->
    <rect x="122" y="280" width="56" height="100" fill="#1976d2" fill-opacity="0.6"/>
    <text x="150" y="335" text-anchor="middle" fill="white" font-size="10" font-weight="bold">水</text>
    <line x1="122" y1="280" x2="178" y2="280" stroke="#4fc3f7" stroke-width="1.5" stroke-dasharray="3,2"/>
    <!-- 压缩空气 -->
    <text x="150" y="200" text-anchor="middle" fill="#ffd54f" font-size="11" font-weight="bold">压缩空气</text>
    <text x="150" y="215" text-anchor="middle" fill="white" font-size="9">储能</text>
    <!-- 喷嘴 -->
    <polygon points="140,440 160,440 155,470 145,470" fill="#bdc3c7"/>
    <!-- 喷出水 -->
    <ellipse cx="150" cy="480" rx="8" ry="3" fill="#4fc3f7" opacity="0.6"/>
    <ellipse cx="150" cy="490" rx="5" ry="2" fill="#4fc3f7" opacity="0.4"/>
    <!-- 标注 -->
    <line x1="180" y1="280" x2="220" y2="280" stroke="#4fc3f7" stroke-width="1"/>
    <text x="225" y="285" fill="white" font-size="10">水面（约1/3）</text>
    <line x1="90" y1="355" x2="60" y2="355" stroke="#ffd54f" stroke-width="1"/>
    <text x="55" y="360" fill="#ffd54f" font-size="10" text-anchor="end">尾翼</text>
    <line x1="150" y1="30" x2="240" y2="30" stroke="#ff6b35" stroke-width="1"/>
    <text x="245" y="35" fill="#ff6b35" font-size="10">鼻锥</text>
    <text x="150" y="495" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="9">↓ 水喷出 → 火箭上升（动量守恒）</text>
  </svg>`,

  // 北斗卫星导航
  beidouNav: `<svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="350" fill="#0a1929"/>
    <!-- 地球 -->
    <circle cx="250" cy="200" r="60" fill="url(#earthB)"/>
    <defs>
      <radialGradient id="earthB">
        <stop offset="0%" stop-color="#4fc3f7"/>
        <stop offset="70%" stop-color="#1976d2"/>
        <stop offset="100%" stop-color="#0d47a1"/>
      </radialGradient>
    </defs>
    <path d="M225,190 Q245,185 260,195 Q255,215 235,210" fill="#27ae60" opacity="0.7"/>
    <!-- 三种轨道卫星 -->
    <!-- GEO 卫星 -->
    <circle cx="250" cy="200" r="110" fill="none" stroke="#ff6b35" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
    <circle cx="250" cy="90" r="6" fill="#ff6b35"/>
    <text x="265" y="93" fill="#ff6b35" font-size="10">GEO（3颗）</text>
    <text x="265" y="105" fill="white" font-size="8">通信增强</text>
    <!-- IGSO 卫星 -->
    <circle cx="320" cy="170" r="6" fill="#ffd54f"/>
    <text x="335" y="173" fill="#ffd54f" font-size="10">IGSO（3颗）</text>
    <text x="335" y="185" fill="white" font-size="8">倾斜同步</text>
    <!-- MEO 卫星组 -->
    <circle cx="250" cy="200" r="85" fill="none" stroke="#4fc3f7" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
    <circle cx="335" cy="200" r="5" fill="#4fc3f7"/>
    <circle cx="250" cy="115" r="5" fill="#4fc3f7"/>
    <circle cx="165" cy="200" r="5" fill="#4fc3f7"/>
    <circle cx="250" cy="285" r="5" fill="#4fc3f7"/>
    <text x="350" y="240" fill="#4fc3f7" font-size="10">MEO（24颗）</text>
    <text x="350" y="252" fill="white" font-size="8">全球组网 21528km</text>
    <!-- 用户 -->
    <circle cx="250" cy="280" r="6" fill="#66bb6a"/>
    <text x="265" y="283" fill="#66bb6a" font-size="10">用户</text>
    <!-- 信号线 -->
    <line x1="250" y1="275" x2="250" y2="115" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6"/>
    <line x1="250" y1="275" x2="335" y2="200" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6"/>
    <line x1="250" y1="275" x2="165" y2="200" stroke="#4fc3f7" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6"/>
    <!-- 三步走标注 -->
    <text x="250" y="335" text-anchor="middle" fill="white" font-size="11">北斗三号：BD-1（双星）→ BD-2（区域）→ BD-3（2020全球）</text>
  </svg>`
}

const svgContent = computed(() => diagrams[props.type] || `<div style="padding:2rem;color:#999">未找到图示类型: ${props.type}</div>`)
</script>

<style scoped>
.science-diagram {
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.diagram-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.diagram-canvas {
  display: flex;
  justify-content: center;
  align-items: center;
}

.diagram-canvas :deep(svg) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.diagram-caption {
  margin-top: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-style: italic;
}
</style>
