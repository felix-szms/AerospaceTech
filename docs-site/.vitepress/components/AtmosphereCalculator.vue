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
import { ref, reactive, onMounted, watch } from 'vue'
import MathFormula from './MathFormula.vue'

// ===== ISA 国际标准大气模型 =====
// 各层参数：[底边界高度m, 底界温度K, 温度递减率K/m]
const LAYERS = [
  { h0: 0,     T0: 288.15, L: -0.0065 },
  { h0: 11000, T0: 216.65, L: 0.0 },
  { h0: 20000, T0: 216.65, L: 0.001 },
  { h0: 32000, T0: 228.65, L: 0.0028 },
  { h0: 47000, T0: 270.65, L: 0.0 },
  { h0: 51000, T0: 270.65, L: -0.0028 },
  { h0: 71000, T0: 214.65, L: -0.002 },
]
const LAYER_NAMES = ['对流层', '平流层（下）', '平流层（上）', '中间层（下）', '中间层（恒温）', '中间层（上）', '热层（起始）']

const P0 = 101325 // Pa
const g = 9.80665
const R = 287.05287

// 计算 ISA 大气参数
function isa(h) {
  h = Math.max(0, Math.min(80000, h))
  let layerIdx = 0
  for (let i = LAYERS.length - 1; i >= 0; i--) {
    if (h >= LAYERS[i].h0) { layerIdx = i; break }
  }
  const layer = LAYERS[layerIdx]
  const dh = h - layer.h0
  const T = layer.T0 + layer.L * dh

  // 气压：需要从海平面逐层积分
  let P = P0
  for (let i = 0; i < layerIdx; i++) {
    const l = LAYERS[i]
    const dhLayer = LAYERS[i + 1].h0 - l.h0
    P = layerPressure(P, l, dhLayer)
  }
  P = layerPressure(P, layer, dh)

  const rho = P / (R * T)
  const a = Math.sqrt(1.4 * R * T)
  return { T, P: P / 100, rho, a, layer: LAYER_NAMES[layerIdx] }
}

function layerPressure(P, layer, dh) {
  if (Math.abs(layer.L) < 1e-9) {
    return P * Math.exp(-g * dh / (R * layer.T0))
  }
  return P * Math.pow(1 + layer.L * dh / layer.T0, -g / (layer.L * R))
}

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
  const r = isa(altitude.value * 1000)
  results.T = r.T - 273.15
  results.P = r.P
  results.rho = r.rho
  results.a = r.a
  results.layer = r.layer
  drawChart()
}

// 测压反推高度
function inverseAltitude(P_hPa) {
  const ratio = P_hPa / 1013.25
  if (ratio <= 0) return 0
  return 44330 * (1 - Math.pow(ratio, 1 / 5.255))
}
const invH = () => inverseAltitude(measuredP.value)

import { computed } from 'vue'
const inverseH = computed(() => inverseAltitude(measuredP.value))

// ===== Canvas 曲线图 =====
function drawChart() {
  const canvas = chartRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const pad = { l: 55, r: 55, t: 30, b: 40 }
  const pw = W - pad.l - pad.r
  const ph = H - pad.t - pad.b

  ctx.fillStyle = '#0a1929'
  ctx.fillRect(0, 0, W, H)

  // 采样 0-80km
  const pts = []
  for (let h = 0; h <= 80000; h += 500) {
    pts.push({ h, ...isa(h) })
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
  LAYERS.slice(1).forEach(l => {
    const x = H2X(l.h0)
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
  const cur = isa(altitude.value * 1000)
  const cx = H2X(altitude.value * 1000)
  ctx.fillStyle = '#ffd54f'
  ctx.shadowColor = '#ffd54f'
  ctx.shadowBlur = 10
  ;[[T2Y(cur.T - 273.15)], [P2Y(cur.P)]].forEach(([y]) => {
    ctx.beginPath(); ctx.arc(cx, y, 5, 0, Math.PI * 2); ctx.fill()
  })
  ctx.shadowBlur = 0
  // 竖线
  ctx.strokeStyle = 'rgba(255,213,79,0.5)'
  ctx.setLineDash([3, 3])
  ctx.beginPath(); ctx.moveTo(cx, pad.t); ctx.lineTo(cx, pad.t + ph); ctx.stroke()
  ctx.setLineDash([])
}

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
