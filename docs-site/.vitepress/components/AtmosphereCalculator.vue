<template>
  <div class="tool-container">
    <h2 class="tool-title">🌡️ 大气参数计算器</h2>
    <p class="tool-desc">
      基于<strong>国际标准大气（ISA）模型</strong>，输入高度即可查询温度、气压、密度、声速——
      本地运行秒开，中文界面，可替代 NASA AtmosModeler 用于课堂探究。
    </p>

    <!-- 高度输入 -->
    <div class="tool-controls">
      <div class="control-group">
        <label>⛰️ 高度 h (km)</label>
        <input v-model.number="altitude" type="range" min="0" max="80" step="0.5" @input="calc" />
        <div class="range-display">{{ altitude }} km = {{ altitude * 1000 }} m</div>
      </div>
      <div class="control-group">
        <label>📐 快速定位</label>
        <div class="preset-buttons" style="margin-bottom:0">
          <button v-for="p in presets" :key="p.h" class="preset-btn" @click="altitude = p.h; calc()">
            {{ p.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 结果卡片 -->
    <div class="result-grid">
      <div class="result-card">
        <div class="label">温度 T</div>
        <div class="value">{{ results.T.toFixed(1) }}</div>
        <div class="unit">°C</div>
      </div>
      <div class="result-card">
        <div class="label">气压 P</div>
        <div class="value">{{ results.P >= 100 ? results.P.toFixed(0) : results.P.toFixed(2) }}</div>
        <div class="unit">hPa</div>
      </div>
      <div class="result-card">
        <div class="label">相对气压 P/P₀</div>
        <div class="value">{{ (results.P / 1013.25 * 100).toFixed(2) }}</div>
        <div class="unit">%</div>
      </div>
      <div class="result-card">
        <div class="label">密度 ρ</div>
        <div class="value">{{ results.rho.toFixed(4) }}</div>
        <div class="unit">kg/m³</div>
      </div>
      <div class="result-card">
        <div class="label">声速 a</div>
        <div class="value">{{ results.a.toFixed(1) }}</div>
        <div class="unit">m/s</div>
      </div>
      <div class="result-card">
        <div class="label">所在层</div>
        <div class="value" style="font-size:1.05rem">{{ results.layer }}</div>
      </div>
    </div>

    <!-- 曲线图 -->
    <div class="canvas-container">
      <canvas ref="chartRef" width="640" height="360"></canvas>
    </div>
    <p class="chart-hint">📈 曲线上红点即当前高度。观察：温度逐层折线变化，气压/密度单调递减（近似指数衰减）。</p>

    <!-- 与实验联动 -->
    <div class="formula-section">
      <h3>🔗 与本课实验联动（BMP280 气压测高）</h3>
      <p>第 2 课用 Arduino+BMP280 实测楼层气压反推高度。现在反过来验证：</p>
      <div class="calc-check">
        <label>输入 BMP280 实测气压（hPa）：</label>
        <input v-model.number="measuredP" type="number" step="0.1" placeholder="如 1002.5" />
        <div v-if="measuredP > 200 && measuredP < 1100" class="calc-result">
          测压公式反推高度 ≈ <strong>{{ inverseH.toFixed(0) }} m</strong>
          <span class="calc-note">（本计算器 ISA 模型验证：<MathFormula tex="h = 44330\left[1-\left(\frac{P}{1013.25}\right)^{1/5.255}\right]" />）</span>
        </div>
      </div>
    </div>

    <!-- 分层模型说明 -->
    <div class="knowledge-section">
      <h3>📖 ISA 标准大气分层模型</h3>
      <table>
        <thead><tr><th>层</th><th>高度范围</th><th>温度变化</th></tr></thead>
        <tbody>
          <tr><td>对流层</td><td>0 – 11 km</td><td>每升高1km降 6.5°C</td></tr>
          <tr><td>平流层（下）</td><td>11 – 20 km</td><td>恒温 −56.5°C</td></tr>
          <tr><td>平流层（上）</td><td>20 – 32 km</td><td>每升1km升 1.0°C</td></tr>
          <tr><td>中间层（下）</td><td>32 – 47 km</td><td>每升1km升 2.8°C</td></tr>
          <tr><td>中间层（上）</td><td>47 – 80 km</td><td>先恒后降</td></tr>
        </tbody>
      </table>
      <p style="font-size:0.85rem;color:var(--vp-c-text-3);margin-top:0.5rem">
        * 标准大气是"理想化平均状态"，实际大气受天气影响有 ±几 % 偏差——这本身就是课堂可讨论的点。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import MathFormula from './MathFormula.vue'
import { isaAtmosphere, pressureToAltitude } from '../utils/physics'
import { useResponsiveCanvas } from '../composables/useCanvas'

// 层底边界高度（米），仅用于图表绘制层边界虚线；物理计算统一走 utils/physics
const LAYER_BOUNDARIES_M = [11000, 20000, 32000, 47000, 51000, 71000]

// ===== 组件状态 =====
const altitude = ref(5)
const measuredP = ref(1000)
const chartRef = ref(null)

const results = reactive({ T: 15, P: 1013.25, rho: 1.225, a: 340, layer: '对流层' })

const presets = [
  { name: '海平面', h: 0 },
  { name: '深圳地王大厦', h: 0.384 },
  { name: '客机巡航', h: 11 },
  { name: '平流层顶', h: 20 },
  { name: '探空气球', h: 35 },
  { name: '卡门线附近', h: 80 }
]

function calc() {
  const r = isaAtmosphere(altitude.value * 1000)
  results.T = r.T - 273.15 // 展示层：开尔文 → 摄氏度
  results.P = r.P / 100 // 展示层：帕斯卡 → hPa
  results.rho = r.rho
  results.a = r.a
  results.layer = r.layer
  drawChart()
}

// 测压反推高度
const inverseH = computed(() => pressureToAltitude(measuredP.value))

// ===== Canvas 曲线图：按 640×360 设计坐标绘制，每次按当前 CSS 尺寸等比缩放（dpr 保清晰） =====
const CHART_DESIGN = { w: 640, h: 360 }
function drawChart() {
  const canvas = chartRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const cw = canvas.clientWidth
  const ch = canvas.clientHeight
  if (!cw || !ch) return
  const dpr = window.devicePixelRatio || 1
  ctx.setTransform((dpr * cw) / CHART_DESIGN.w, 0, 0, (dpr * ch) / CHART_DESIGN.h, 0, 0)
  const W = CHART_DESIGN.w
  const H = CHART_DESIGN.h
  const pad = { l: 55, r: 55, t: 30, b: 40 }
  const pw = W - pad.l - pad.r
  const ph = H - pad.t - pad.b

  ctx.fillStyle = '#0a1929'
  ctx.fillRect(0, 0, W, H)

  // 采样 0-80km（isaAtmosphere 返回 Pa，图表用 hPa）
  const pts = []
  for (let h = 0; h <= 80000; h += 500) {
    const r = isaAtmosphere(h)
    pts.push({ h, T: r.T, P: r.P / 100 })
  }

  // 温度范围 -70~20°C；气压对数轴 0.01-1100 hPa
  const T2Y = (t) => pad.t + ph * (1 - (t + 70) / 90)
  const P2Y = (p) => pad.t + ph * (1 - (Math.log10(Math.max(p, 0.01)) + 2) / 5.1)
  const H2X = (h) => pad.l + pw * (h / 80000)

  // 网格+轴
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '11px sans-serif'
  ctx.lineWidth = 1
  for (let h = 0; h <= 80; h += 10) {
    const x = H2X(h * 1000)
    ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ph); ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillText(h + 'km', x, H - 22)
  }
  ctx.textAlign = 'right'
  const tLabels = [20, 0, -20, -40, -60]
  tLabels.forEach(t => {
    const y = T2Y(t)
    ctx.fillText(t + '°C', pad.l - 6, y + 3)
  })
  ctx.textAlign = 'left'
  const pLabels = [1000, 100, 10, 1, 0.1]
  pLabels.forEach(p => {
    const y = P2Y(p)
    ctx.fillText(p + 'hPa', W - pad.r + 6, y + 3)
  })

  // 层边界虚线
  ctx.strokeStyle = 'rgba(179,136,255,0.3)'
  ctx.setLineDash([4, 4])
  LAYER_BOUNDARIES_M.forEach(h0 => {
    const x = H2X(h0)
    ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ph); ctx.stroke()
  })
  ctx.setLineDash([])

  // 温度曲线（橙）
  ctx.strokeStyle = '#ff6b35'
  ctx.lineWidth = 2
  ctx.beginPath()
  pts.forEach((p, i) => {
    const x = H2X(p.h), y = T2Y(p.T - 273.15)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // 气压曲线（青，对数）
  ctx.strokeStyle = '#4fc3f7'
  ctx.beginPath()
  pts.forEach((p, i) => {
    const x = H2X(p.h), y = P2Y(p.P)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // 图例
  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#ff6b35'
  ctx.fillText('■ 温度', pad.l + 5, pad.t + 4)
  ctx.fillStyle = '#4fc3f7'
  ctx.fillText('■ 气压(对数)', pad.l + 70, pad.t + 4)

  // 当前高度红点
  const cur = isaAtmosphere(altitude.value * 1000)
  const cx = H2X(altitude.value * 1000)
  ctx.fillStyle = '#ffd54f'
  ctx.shadowColor = '#ffd54f'
  ctx.shadowBlur = 10
  ;[[T2Y(cur.T - 273.15)], [P2Y(cur.P / 100)]].forEach(([y]) => {
    ctx.beginPath(); ctx.arc(cx, y, 5, 0, Math.PI * 2); ctx.fill()
  })
  ctx.shadowBlur = 0
  // 竖线
  ctx.strokeStyle = 'rgba(255,213,79,0.5)'
  ctx.setLineDash([3, 3])
  ctx.beginPath(); ctx.moveTo(cx, pad.t); ctx.lineTo(cx, pad.t + ph); ctx.stroke()
  ctx.setLineDash([])
}

// 响应式画布：16:9，宽度自适应容器（最大 640px）；无持续动画，尺寸变化时重绘即可
useResponsiveCanvas(chartRef, 640 / 360, () => {
  drawChart()
}, 640)

watch(altitude, calc)
onMounted(calc)
</script>

<style scoped>
.tool-desc { color: var(--vp-c-text-2); line-height: 1.7; margin-bottom: 1.5rem; }
.range-display { font-size: 0.85rem; color: var(--vp-c-brand-1); font-weight: 600; margin-top: 0.3rem; }
.chart-hint { font-size: 0.85rem; color: var(--vp-c-text-3); text-align: center; margin: 0.5rem 0 0; }
.formula-section, .knowledge-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--vp-c-divider); }
.calc-check { display: flex; flex-direction: column; gap: 0.6rem; background: var(--vp-c-bg); padding: 1rem; border-radius: 8px; }
.calc-check input { padding: 0.5rem 0.8rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); max-width: 280px; }
.calc-result { font-size: 0.95rem; color: var(--vp-c-text-2); }
.calc-result strong { color: var(--vp-c-brand-1); font-size: 1.2rem; }
.calc-note { display: block; font-size: 0.82rem; margin-top: 0.4rem; color: var(--vp-c-text-3); }
.tool-container table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; }
.tool-container th, .tool-container td { padding: 0.5rem 0.8rem; text-align: left; border-bottom: 1px solid var(--vp-c-divider); font-size: 0.9rem; }
.tool-container th { background: var(--vp-c-bg-soft); }
</style>
