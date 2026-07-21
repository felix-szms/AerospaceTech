<template>
  <div class="tool-container">
    <h2 class="tool-title">🛰️ 轨道参数计算器</h2>
    <p class="tool-desc">
      输入轨道高度，根据 <strong>牛顿万有引力定律</strong> 和 <strong>圆周运动</strong> 联立求解，
     实时计算卫星的轨道速度、周期，并绘制轨道示意图。
    </p>

    <!-- 预设按钮 -->
    <div class="preset-buttons">
      <button
        v-for="preset in presets"
        :key="preset.name"
        class="preset-btn"
        @click="applyPreset(preset)"
      >
        {{ preset.name }} ({{ preset.altitude }} km)
      </button>
    </div>

    <!-- 输入控件 -->
    <div class="tool-controls">
      <div class="control-group">
        <label>🌌 轨道高度 h (km)</label>
        <input
          v-model.number="altitude"
          type="number"
          min="100"
          max="100000"
          step="10"
          @input="calculate"
        />
      </div>
      <div class="control-group">
        <label>🌍 轨道类型</label>
        <select v-model="orbitType" @change="onTypeChange">
          <option value="circular">圆轨道</option>
          <option value="elliptical">椭圆轨道（暂仅演示圆轨道）</option>
        </select>
      </div>
    </div>

    <!-- 计算结果显示 -->
    <div class="result-grid">
      <div class="result-card">
        <div class="label">轨道半径 r</div>
        <div class="value">{{ formatNum(results.radius) }}</div>
        <div class="unit">km</div>
      </div>
      <div class="result-card">
        <div class="label">轨道速度 v</div>
        <div class="value">{{ formatNum(results.velocity) }}</div>
        <div class="unit">km/s</div>
      </div>
      <div class="result-card">
        <div class="label">轨道周期 T</div>
        <div class="value">{{ formatPeriod(results.period) }}</div>
        <div class="unit"></div>
      </div>
      <div class="result-card">
        <div class="label">每日绕地圈数</div>
        <div class="value">{{ formatNum(86400 / results.period, 2) }}</div>
        <div class="unit">圈/天</div>
      </div>
    </div>

    <!-- Canvas 轨道可视化 -->
    <div class="canvas-container">
      <canvas ref="canvasRef" width="500" height="500"></canvas>
    </div>

    <!-- 公式说明 -->
    <div class="formula-section">
      <h3>📐 计算公式</h3>
      <p>由 <strong>万有引力 = 向心力</strong> 联立：</p>
      <div class="formula-block">
        <MathFormula tex="G\frac{Mm}{r^2} = \frac{mv^2}{r}" :display="true" />
      </div>
      <p>解出轨道速度：</p>
      <div class="formula-block">
        <MathFormula tex="v = \sqrt{\frac{GM}{r}}" :display="true" />
      </div>
      <p>轨道周期（开普勒第三定律）：</p>
      <div class="formula-block">
        <MathFormula tex="T = 2\pi\sqrt{\frac{r^3}{GM}}" :display="true" />
      </div>
      <p>其中：</p>
      <ul>
        <li><MathFormula tex="G = 6.674 \times 10^{-11} \,\text{N·m}^2/\text{kg}^2" />（万有引力常数）</li>
        <li><MathFormula tex="M = 5.972 \times 10^{24} \,\text{kg}" />（地球质量）</li>
        <li><MathFormula tex="R_\oplus = 6371 \,\text{km}" />（地球半径）</li>
        <li><MathFormula tex="r = R_\oplus + h" />（轨道半径）</li>
      </ul>
    </div>

    <!-- 知识点 -->
    <div class="knowledge-section">
      <h3>💡 轨道类型对照</h3>
      <table>
        <thead>
          <tr>
            <th>类型</th>
            <th>高度</th>
            <th>周期</th>
            <th>典型用途</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>LEO 低轨</td><td>300-2000 km</td><td>90-120 min</td><td>空间站、遥感、星链</td></tr>
          <tr><td>MEO 中轨</td><td>2000-35786 km</td><td>2-24 h</td><td>北斗/GPS 导航</td></tr>
          <tr><td>GEO 地球静止</td><td>35786 km</td><td>23h56min</td><td>通信、气象</td></tr>
          <tr><td>SSO 太阳同步</td><td>500-1000 km</td><td>~95 min</td><td>光学遥感</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 物理常数
const G = 6.674e-11 // 万有引力常数 N·m²/kg²
const M = 5.972e24 // 地球质量 kg
const R_EARTH = 6371 // 地球半径 km
const GM = G * M // m³/s²

// 响应式数据
const altitude = ref(420) // 默认 ISS 高度
const orbitType = ref('circular')
const canvasRef = ref(null)
let animationId = null
let angle = 0

const results = reactive({
  radius: 0,
  velocity: 0,
  period: 0
})

// 预设轨道
const presets = [
  { name: '🛰️ ISS 国际空间站', altitude: 420 },
  { name: '🌌 哈勃望远镜', altitude: 540 },
  { name: '🛰️ 风云气象卫星(SSO)', altitude: 850 },
  { name: '🧭 北斗 MEO', altitude: 21528 },
  { name: '📡 地球静止轨道 GEO', altitude: 35786 }
]

// 计算函数
const calculate = () => {
  const h = altitude.value || 0
  const r_km = R_EARTH + h
  const r_m = r_km * 1000

  // 轨道速度 v = sqrt(GM/r)
  const v = Math.sqrt(GM / r_m) // m/s
  const v_kms = v / 1000

  // 轨道周期 T = 2π·sqrt(r³/GM)
  const T = 2 * Math.PI * Math.sqrt(Math.pow(r_m, 3) / GM)

  results.radius = r_km
  results.velocity = v_kms
  results.period = T
}

// 应用预设
const applyPreset = (preset) => {
  altitude.value = preset.altitude
  calculate()
}

const onTypeChange = () => {
  calculate()
}

// 数字格式化
const formatNum = (num, digits = 2) => {
  if (!num) return '0'
  if (num >= 10000) return num.toFixed(0)
  if (num >= 100) return num.toFixed(digits)
  return num.toFixed(3)
}

// 周期格式化为时分秒
const formatPeriod = (seconds) => {
  if (!seconds) return '0'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}h${m}m`
  if (m > 0) return `${m}m${s}s`
  return `${s}s`
}

// Canvas 绘制轨道
const drawOrbit = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2

  // 清屏（深空背景）
  ctx.fillStyle = '#0a1929'
  ctx.fillRect(0, 0, W, H)

  // 绘制星空
  ctx.fillStyle = 'white'
  const stars = [
    [50, 80], [120, 40], [180, 120], [60, 350], [440, 60],
    [420, 420], [380, 100], [80, 200], [460, 250], [40, 450],
    [350, 380], [150, 420], [250, 30], [30, 250]
  ]
  stars.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 1.2 + 0.3, 0, Math.PI * 2)
    ctx.fill()
  })

  // 绘制地球
  const earthRadius = 80
  const earthGrad = ctx.createRadialGradient(cx - 20, cy - 20, 5, cx, cy, earthRadius)
  earthGrad.addColorStop(0, '#4fc3f7')
  earthGrad.addColorStop(0.5, '#1976d2')
  earthGrad.addColorStop(1, '#0d47a1')
  ctx.fillStyle = earthGrad
  ctx.beginPath()
  ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2)
  ctx.fill()

  // 地球大陆（简化轮廓）
  ctx.fillStyle = '#43a047'
  ctx.beginPath()
  ctx.ellipse(cx - 20, cy - 30, 25, 18, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 25, cy + 20, 22, 15, -0.5, 0, Math.PI * 2)
  ctx.fill()

  // 计算轨道半径（像素，按对数缩放避免GEO过大）
  const h = altitude.value || 0
  // 使用对数映射让低轨和高轨都可见
  const logScale = (Math.log(h + 100) - Math.log(100)) / (Math.log(100000) - Math.log(100))
  const orbitRadiusPx = earthRadius + 30 + logScale * (Math.min(W, H) / 2 - earthRadius - 60)

  // 绘制轨道线
  ctx.strokeStyle = 'rgba(255, 213, 79, 0.5)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(cx, cy, orbitRadiusPx, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // 绘制卫星（沿轨道运动）
  const satX = cx + orbitRadiusPx * Math.cos(angle)
  const satY = cy + orbitRadiusPx * Math.sin(angle)

  // 卫星轨迹尾迹
  ctx.strokeStyle = 'rgba(255, 107, 53, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx + orbitRadiusPx * Math.cos(angle - 0.5), cy + orbitRadiusPx * Math.sin(angle - 0.5))
  ctx.lineTo(satX, satY)
  ctx.stroke()

  // 卫星本体
  ctx.fillStyle = '#ffd54f'
  ctx.shadowColor = '#ffd54f'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(satX, satY, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // 卫星太阳能板
  ctx.fillStyle = '#4fc3f7'
  ctx.fillRect(satX - 12, satY - 1.5, 8, 3)
  ctx.fillRect(satX + 4, satY - 1.5, 8, 3)

  // 标注
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`h = ${h} km`, satX, satY - 12)
  ctx.fillText(`v = ${results.velocity.toFixed(2)} km/s`, cx, H - 15)
  ctx.fillText(`T = ${formatPeriod(results.period)}`, cx, 20)

  // 角度推进（运动速度与实际周期相关，但视觉上限制速度）
  // 较高轨道周期长，视觉上让运动稍慢
  const visualSpeed = 0.005 + 0.03 / Math.sqrt(orbitRadiusPx / earthRadius)
  angle += visualSpeed
}

// 动画循环
const animate = () => {
  drawOrbit()
  animationId = requestAnimationFrame(animate)
}

// 监听变化重绘
watch([altitude, orbitType], () => {
  calculate()
})

onMounted(() => {
  calculate()
  nextTick(() => {
    animate()
  })
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.tool-desc {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.formula-section,
.knowledge-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.formula-block {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  margin: 0.75rem 0;
  overflow-x: auto;
  text-align: center;
}

.tool-container table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.tool-container th,
.tool-container td {
  padding: 0.6rem 0.8rem;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tool-container th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}
</style>
