<template>
  <div class="tool-container">
    <h2 class="tool-title">🚀 火箭仿真器</h2>
    <p class="tool-desc">
      基于齐奥尔科夫斯基火箭方程与垂直弹道学，仿真火箭的主动段加速、惯性上升与自由落体全过程。
      调整参数，观察最大高度变化。
    </p>

    <!-- 预设按钮 -->
    <div class="preset-buttons">
      <button
        v-for="preset in presets"
        :key="preset.name"
        class="preset-btn"
        @click="applyPreset(preset)"
      >
        {{ preset.name }}
      </button>
    </div>

    <!-- 输入控件 -->
    <div class="tool-controls">
      <div class="control-group">
        <label>🚀 总质量 m₀ (kg)</label>
        <input v-model.number="params.totalMass" type="number" min="0.01" step="0.01" @input="simulate" />
      </div>
      <div class="control-group">
        <label>⛽ 推进剂质量 m_f (kg)</label>
        <input v-model.number="params.propellantMass" type="number" min="0" step="0.01" @input="simulate" />
      </div>
      <div class="control-group">
        <label>💨 排气速度 v_e (m/s)</label>
        <input v-model.number="params.exhaustVelocity" type="number" min="100" step="10" @input="simulate" />
      </div>
      <div class="control-group">
        <label>🔥 发动机推力 F (N)</label>
        <input v-model.number="params.thrust" type="number" min="0.1" step="0.1" @input="simulate" />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
      <button class="btn" @click="runSimulation">{{ isRunning ? '⏸️ 暂停' : '▶️ 运行仿真' }}</button>
      <button class="btn btn-secondary" @click="resetSimulation">🔄 重置</button>
    </div>

    <!-- 计算结果 -->
    <div class="result-grid">
      <div class="result-card">
        <div class="label">Δv 速度增量</div>
        <div class="value">{{ formatNum(results.deltaV, 1) }}</div>
        <div class="unit">m/s</div>
      </div>
      <div class="result-card">
        <div class="label">燃烧时间 t_b</div>
        <div class="value">{{ formatNum(results.burnTime, 1) }}</div>
        <div class="unit">s</div>
      </div>
      <div class="result-card">
        <div class="label">主动段末速度</div>
        <div class="value">{{ formatNum(results.burnoutVelocity, 1) }}</div>
        <div class="unit">m/s</div>
      </div>
      <div class="result-card">
        <div class="label">🏆 最大高度</div>
        <div class="value">{{ formatNum(results.maxAltitude, 1) }}</div>
        <div class="unit">m</div>
      </div>
    </div>

    <!-- 火箭飞行动画 -->
    <div class="canvas-container">
      <canvas ref="canvasRef" width="200" height="500"></canvas>
    </div>

    <!-- 高度-时间曲线 -->
    <div class="canvas-container">
      <canvas ref="chartRef" width="600" height="300"></canvas>
    </div>

    <!-- 公式说明 -->
    <div class="formula-section">
      <h3>📐 物理模型</h3>
      <p><strong>齐奥尔科夫斯基火箭方程</strong>（理想速度增量）：</p>
      <div class="formula-block">
        <MathFormula tex="\Delta v = v_e \cdot \ln\frac{m_0}{m_0 - m_f}" :display="true" />
      </div>
      <p><strong>燃烧时间</strong>（推进剂质量流量 = 推力/排气速度）：</p>
      <div class="formula-block">
        <MathFormula tex="t_b = \frac{m_f \cdot v_e}{F}" :display="true" />
      </div>
      <p><strong>主动段末速度</strong>（考虑重力损失）：</p>
      <div class="formula-block">
        <MathFormula tex="v_{bo} = \Delta v - g \cdot t_b" :display="true" />
      </div>
      <p><strong>最大高度</strong>（主动段高度 + 惯性上升）：</p>
      <div class="formula-block">
        <MathFormula tex="h_{max} = h_{bo} + \frac{v_{bo}^2}{2g}, \quad g = 9.8 \,\text{m/s}^2" :display="true" />
      </div>
    </div>

    <!-- 知识点 -->
    <div class="knowledge-section">
      <h3>💡 多级火箭与比冲</h3>
      <p>本仿真器为<strong>单级火箭</strong>简化模型。真实火箭为提升性能采用多级设计——</p>
      <p><strong>比冲 Isp</strong>（衡量推进剂效率）：<MathFormula tex="I_{sp} = v_e / g" /></p>
      <table>
        <thead>
          <tr><th>推进剂</th><th>排气速度 v_e</th><th>比冲 Isp</th><th>典型应用</th></tr>
        </thead>
        <tbody>
          <tr><td>液氢液氧</td><td>~4400 m/s</td><td>~450 s</td><td>长征五号氢氧上面级</td></tr>
          <tr><td>煤油液氧</td><td>~3000 m/s</td><td>~310 s</td><td>猎鹰9号、长征五号助推</td></tr>
          <tr><td>偏二甲肼+四氧化二氮</td><td>~2800 m/s</td><td>~285 s</td><td>长二F/长三B</td></tr>
          <tr><td>固体推进剂</td><td>~2500 m/s</td><td>~250 s</td><td>导弹、长征十一号</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'

const g = 9.8 // 重力加速度

const params = reactive({
  totalMass: 0.053,         // 总质量 kg（A8-3模型火箭发动机典型）
  propellantMass: 0.0167,   // 推进剂质量 kg
  exhaustVelocity: 2500,    // 排气速度 m/s（固体）
  thrust: 8                  // 平均推力 N
})

const results = reactive({
  deltaV: 0,
  burnTime: 0,
  burnoutVelocity: 0,
  burnoutAltitude: 0,
  maxAltitude: 0
})

const presets = [
  { name: '🚀 A8-3 模型火箭', totalMass: 0.053, propellantMass: 0.0167, exhaustVelocity: 2500, thrust: 8 },
  { name: '🚀 B6-4 模型火箭', totalMass: 0.062, propellantMass: 0.021, exhaustVelocity: 2500, thrust: 6 },
  { name: '🚀 水火箭(1L水)', totalMass: 1.5, propellantMass: 0.5, exhaustVelocity: 80, thrust: 30 },
  { name: '🚀 探空火箭(小型)', totalMass: 20, propellantMass: 8, exhaustVelocity: 2200, thrust: 5000 }
]

const canvasRef = ref(null)
const chartRef = ref(null)
const isRunning = ref(false)
let animationId = null
let simTime = 0
let simAltitude = 0
let simVelocity = 0
let altitudeHistory = []

// 仿真主函数
const simulate = () => {
  const { totalMass, propellantMass, exhaustVelocity, thrust } = params

  if (totalMass <= propellantMass || totalMass <= 0 || propellantMass < 0 || exhaustVelocity <= 0 || thrust <= 0) {
    Object.keys(results).forEach(k => results[k] = 0)
    return
  }

  // 质量比
  const massRatio = totalMass / (totalMass - propellantMass)
  // Δv
  const deltaV = exhaustVelocity * Math.log(massRatio)
  // 燃烧时间
  const burnTime = (propellantMass * exhaustVelocity) / thrust
  // 主动段末速度（考虑重力损失）
  const burnoutVelocity = Math.max(0, deltaV - g * burnTime)
  // 主动段高度（近似为平均速度乘时间）
  const burnoutAltitude = (burnoutVelocity / 2) * burnTime
  // 惯性上升高度
  const coastAltitude = (burnoutVelocity * burnoutVelocity) / (2 * g)
  // 最大高度
  const maxAltitude = burnoutAltitude + coastAltitude

  results.deltaV = deltaV
  results.burnTime = burnTime
  results.burnoutVelocity = burnoutVelocity
  results.burnoutAltitude = burnoutAltitude
  results.maxAltitude = maxAltitude
}

const applyPreset = (preset) => {
  Object.assign(params, preset)
  simulate()
}

const formatNum = (num, digits = 2) => {
  if (!num || isNaN(num)) return '0'
  if (Math.abs(num) >= 1000) return num.toFixed(0)
  if (Math.abs(num) >= 10) return num.toFixed(digits)
  return num.toFixed(digits + 1)
}

// 运行仿真动画
const runSimulation = () => {
  if (isRunning.value) {
    isRunning.value = false
    if (animationId) cancelAnimationFrame(animationId)
    return
  }
  // 重置
  simTime = 0
  simAltitude = 0
  simVelocity = 0
  altitudeHistory = []
  isRunning.value = true
  step()
}

const resetSimulation = () => {
  isRunning.value = false
  if (animationId) cancelAnimationFrame(animationId)
  simTime = 0
  simAltitude = 0
  simVelocity = 0
  altitudeHistory = []
  drawRocket()
  drawChart()
}

const step = () => {
  if (!isRunning.value) return
  const dt = 0.05 // 仿真步长
  simTime += dt

  const { totalMass, propellantMass, exhaustVelocity, thrust } = params
  const burnTime = (propellantMass * exhaustVelocity) / thrust

  // 主动段
  if (simTime <= burnTime) {
    const currentMass = totalMass - (propellantMass * simTime / burnTime)
    const accel = thrust / currentMass - g
    simVelocity += accel * dt
    simAltitude += simVelocity * dt
  } else {
    // 惯性段
    simVelocity -= g * dt
    simAltitude += simVelocity * dt
    if (simAltitude <= 0) {
      simAltitude = 0
      simVelocity = 0
      isRunning.value = false
    }
  }

  altitudeHistory.push({ t: simTime, h: simAltitude })
  if (altitudeHistory.length > 500) altitudeHistory.shift()

  drawRocket()
  drawChart()

  if (isRunning.value) {
    animationId = requestAnimationFrame(step)
  }
}

// 绘制火箭
const drawRocket = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  // 背景渐变（天空到太空）
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#000814')
  grad.addColorStop(0.5, '#0a1929')
  grad.addColorStop(1, '#1a3a5c')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // 地面
  ctx.fillStyle = '#2d4a22'
  ctx.fillRect(0, H - 20, W, 20)

  // 高度比例尺（最大高度对应画布顶部）
  const maxH = Math.max(results.maxAltitude, 100)
  const groundY = H - 20
  const rocketY = groundY - (simAltitude / maxH) * (H - 40)

  // 绘制刻度
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '10px monospace'
  ctx.lineWidth = 1
  for (let i = 1; i <= 4; i++) {
    const y = groundY - (i / 4) * (H - 40)
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
    ctx.fillText(`${(maxH * i / 4).toFixed(0)}m`, 5, y - 2)
  }

  // 火箭
  const rx = W / 2
  ctx.save()
  ctx.translate(rx, rocketY)

  // 火焰（主动段）
  const burnTime = results.burnTime
  if (burnTime > 0 && simTime <= burnTime && isRunning.value) {
    const flameLen = 15 + Math.random() * 10
    const flameGrad = ctx.createLinearGradient(0, 10, 0, 10 + flameLen)
    flameGrad.addColorStop(0, '#ffd54f')
    flameGrad.addColorStop(0.5, '#ff6b35')
    flameGrad.addColorStop(1, 'rgba(211, 47, 47, 0)')
    ctx.fillStyle = flameGrad
    ctx.beginPath()
    ctx.moveTo(-6, 10)
    ctx.lineTo(0, 10 + flameLen)
    ctx.lineTo(6, 10)
    ctx.closePath()
    ctx.fill()
  }

  // 火箭主体
  ctx.fillStyle = '#e0e0e0'
  ctx.beginPath()
  ctx.moveTo(0, -15)
  ctx.lineTo(-7, -2)
  ctx.lineTo(-7, 10)
  ctx.lineTo(7, 10)
  ctx.lineTo(7, -2)
  ctx.closePath()
  ctx.fill()

  // 火箭头
  ctx.fillStyle = '#ff6b35'
  ctx.beginPath()
  ctx.moveTo(0, -15)
  ctx.lineTo(-7, -2)
  ctx.lineTo(7, -2)
  ctx.closePath()
  ctx.fill()

  // 窗口
  ctx.fillStyle = '#4fc3f7'
  ctx.beginPath()
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2)
  ctx.fill()

  // 翼
  ctx.fillStyle = '#9e9e9e'
  ctx.beginPath()
  ctx.moveTo(-7, 5)
  ctx.lineTo(-11, 12)
  ctx.lineTo(-7, 10)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(7, 5)
  ctx.lineTo(11, 12)
  ctx.lineTo(7, 10)
  ctx.closePath()
  ctx.fill()

  ctx.restore()

  // 信息标注
  ctx.fillStyle = 'white'
  ctx.font = 'bold 11px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`t=${simTime.toFixed(1)}s`, W / 2, 15)
  ctx.fillText(`h=${simAltitude.toFixed(0)}m`, W / 2, 30)
  ctx.fillText(`v=${simVelocity.toFixed(0)}m/s`, W / 2, 45)
}

// 绘制高度-时间曲线
const drawChart = () => {
  const canvas = chartRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  // 背景
  ctx.fillStyle = '#0a1929'
  ctx.fillRect(0, 0, W, H)

  const padding = 40
  const plotW = W - padding * 2
  const plotH = H - padding * 2

  // 坐标轴
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, H - padding)
  ctx.lineTo(W - padding, H - padding)
  ctx.stroke()

  // 网格
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  for (let i = 1; i < 5; i++) {
    const y = padding + (i / 5) * plotH
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(W - padding, y)
    ctx.stroke()
  }

  // 标签
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '11px monospace'
  ctx.textAlign = 'right'
  ctx.fillText('高度 (m)', padding - 8, padding + 5)
  ctx.textAlign = 'center'
  ctx.fillText('时间 (s)', W / 2, H - 8)

  // 理论最大值
  const maxT = Math.max(results.burnTime * 2 + results.burnoutVelocity / g, 10) * 1.2
  const maxH = Math.max(results.maxAltitude, 10) * 1.2

  // 刻度
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const y = H - padding - (i / 5) * plotH
    ctx.fillText(`${(maxH * i / 5).toFixed(0)}`, padding - 5, y + 3)
  }
  ctx.textAlign = 'center'
  for (let i = 0; i <= 5; i++) {
    const x = padding + (i / 5) * plotW
    ctx.fillText(`${(maxT * i / 5).toFixed(1)}`, x, H - padding + 15)
  }

  // 绘制曲线
  if (altitudeHistory.length > 1) {
    ctx.strokeStyle = '#4fc3f7'
    ctx.lineWidth = 2
    ctx.beginPath()
    altitudeHistory.forEach((p, i) => {
      const x = padding + (p.t / maxT) * plotW
      const y = H - padding - (p.h / maxH) * plotH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // 当前点
    const last = altitudeHistory[altitudeHistory.length - 1]
    const cx = padding + (last.t / maxT) * plotW
    const cy = H - padding - (last.h / maxH) * plotH
    ctx.fillStyle = '#ffd54f'
    ctx.shadowColor = '#ffd54f'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // 标题
  ctx.fillStyle = 'white'
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('📈 高度-时间曲线', padding, 20)
}

watch(params, () => simulate(), { deep: true })

onMounted(() => {
  simulate()
  nextTick(() => {
    drawRocket()
    drawChart()
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
  text-align: center;
  overflow-x: auto;
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
}
</style>
