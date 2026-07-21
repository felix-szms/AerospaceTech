<template>
  <div class="tool-container">
    <h2 class="tool-title">🛩️ 升力演示器</h2>
    <p class="tool-desc">
      调整飞行参数，根据 <strong>升力公式</strong>
      <span class="inline-formula">L = ½ ρ v² S C<sub>L</sub></span>
      实时计算飞机产生的升力，并通过 Canvas 动画观察气流如何流过翼型、迎角如何影响升力，以及失速现象。
    </p>

    <!-- 预设场景按钮 -->
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

    <!-- 输入控件：滑块 -->
    <div class="tool-controls">
      <div class="control-group">
        <label>💨 速度 v：{{ params.velocity.toFixed(0) }} m/s</label>
        <input
          v-model.number="params.velocity"
          type="range"
          min="5"
          max="100"
          step="1"
        />
        <span class="range-hint">5 ~ 100</span>
      </div>
      <div class="control-group">
        <label>📐 机翼面积 S：{{ params.area.toFixed(1) }} m²</label>
        <input
          v-model.number="params.area"
          type="range"
          min="0.5"
          max="5"
          step="0.1"
        />
        <span class="range-hint">0.5 ~ 5</span>
      </div>
      <div class="control-group">
        <label>
          📈 迎角 α：{{ params.alpha.toFixed(0) }}°
          <span v-if="isStalled" class="stall-tag">失速</span>
        </label>
        <input
          v-model.number="params.alpha"
          type="range"
          min="-5"
          max="20"
          step="1"
        />
        <span class="range-hint">-5° ~ 20°（>15° 失速）</span>
      </div>
      <div class="control-group">
        <label>🌍 空气密度 ρ：{{ params.density.toFixed(3) }} kg/m³</label>
        <select v-model.number="params.density">
          <option :value="1.225">海平面（0 m）  1.225</option>
          <option :value="0.736">中空（5 000 m）  0.736</option>
          <option :value="0.414">高空（10 000 m） 0.414</option>
        </select>
        <span class="range-hint">高度越高，空气越稀薄</span>
      </div>
    </div>

    <!-- 实时计算结果 -->
    <div class="result-grid">
      <div class="result-card">
        <div class="label">升力 L</div>
        <div class="value">{{ formatNum(results.lift, 0) }}</div>
        <div class="unit">N</div>
      </div>
      <div class="result-card">
        <div class="label">升力系数 C<sub>L</sub></div>
        <div class="value">{{ formatNum(results.CL, 3) }}</div>
        <div class="unit"></div>
      </div>
      <div class="result-card">
        <div class="label">动压 q</div>
        <div class="value">{{ formatNum(results.dynamicPressure, 0) }}</div>
        <div class="unit">Pa</div>
      </div>
      <div class="result-card">
        <div class="label">流速状态</div>
        <div class="value" :class="{ 'stall-value': isStalled }">
          {{ isStalled ? '紊流' : '层流' }}
        </div>
        <div class="unit">{{ results.flowRegime }}</div>
      </div>
    </div>

    <!-- 失速警告 -->
    <div v-if="isStalled" class="callout callout-warning stall-banner">
      ⚠️ <strong>失速！</strong> 迎角 {{ params.alpha.toFixed(0) }}° 超过临界值 15°，
      机翼上表面气流分离，升力急剧下降。飞行员应推杆减小迎角以恢复升力。
    </div>

    <!-- Canvas 可视化 -->
    <div class="canvas-container">
      <canvas ref="canvasRef" width="760" height="380"></canvas>
    </div>

    <!-- 公式说明 -->
    <div class="formula-section">
      <h3>📐 升力公式</h3>
      <div ref="formulaLift" class="formula-block"></div>
      <p>其中：</p>
      <ul>
        <li><strong>ρ（空气密度）</strong>：海平面 1.225 kg/m³，随高度升高而减小</li>
        <li><strong>v（来流速度）</strong>：速度翻倍，升力变为 <strong>4 倍</strong>（平方关系）</li>
        <li><strong>S（机翼面积）</strong>：升力与面积成线性正比</li>
        <li><strong>C<sub>L</sub>（升力系数）</strong>：由翼型形状与迎角共同决定</li>
      </ul>

      <h3>🔬 升力系数 C<sub>L</sub> 与迎角 α 的关系</h3>
      <div ref="formulaCL" class="formula-block"></div>
      <p>
        在失速前，C<sub>L</sub> 与迎角近似 <strong>线性</strong> 关系。本演示采用简化模型：
        C<sub>L0</sub> ≈ 0.3（对称翼型 α=0 时的参考升力系数），C<sub>Lα</sub> ≈ 0.1 / 度。
        当 α &gt; 15°（临界迎角）时气流分离，C<sub>L</sub> 急剧下降，进入<strong>失速区</strong>。
      </p>
    </div>

    <!-- 知识拓展 -->
    <div class="knowledge-section">
      <h3>💡 典型飞行器升力数据</h3>
      <table>
        <thead>
          <tr>
            <th>飞行器</th>
            <th>起飞重量</th>
            <th>机翼面积</th>
            <th>起飞速度</th>
            <th>所需 C<sub>L</sub></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>✈️ Cessna 172</td>
            <td>1 110 kg</td>
            <td>16.2 m²</td>
            <td>25 m/s</td>
            <td>≈ 1.4</td>
          </tr>
          <tr>
            <td>🛩️ Boeing 737</td>
            <td>78 000 kg</td>
            <td>124 m²</td>
            <td>80 m/s</td>
            <td>≈ 1.5</td>
          </tr>
          <tr>
            <td>🚁 F-16 战斗机</td>
            <td>19 000 kg</td>
            <td>27.9 m²</td>
            <td>90 m/s</td>
            <td>≈ 1.0</td>
          </tr>
          <tr>
            <td>🪂 降落伞</td>
            <td>80 kg</td>
            <td>≈ 30 m²</td>
            <td>5 m/s</td>
            <td>≈ 1.7</td>
          </tr>
          <tr>
            <td>🪁 纸飞机</td>
            <td>0.005 kg</td>
            <td>0.01 m²</td>
            <td>3 m/s</td>
            <td>≈ 0.8</td>
          </tr>
        </tbody>
      </table>

      <div class="callout callout-tip">
        <strong>🎯 直觉：</strong>
        你能从表格看出 —— Cessna 172 与 Boeing 737 的起飞 C<sub>L</sub> 都接近 1.5。
        因为升力需要平衡重力，无论大小飞机，<strong>相似的工作点对应着相似的迎角</strong>。
      </div>

      <h3>🌪️ 失速原理</h3>
      <p>
        当迎角逐渐增大，机翼上表面的<strong>压力梯度</strong>也随之增大，
        附面层气流无法克服逆压梯度而<strong>从翼面分离</strong>。
        气流分离后形成紊乱的涡流（动画中橙色区域），上表面低压区被破坏，
        升力陡降、阻力陡增 —— 这就是<strong>失速</strong>。
      </p>
      <ul>
        <li><strong>临界迎角</strong>：典型翼型约 15°，超过后即失速</li>
        <li><strong>失速速度 v<sub>s</sub></strong>：维持所需升力的最低飞行速度，低速飞行更易失速</li>
        <li><strong>恢复方法</strong>：<strong>推杆减小迎角</strong>，必要时加油门增速</li>
      </ul>

      <div class="callout callout-warning">
        <strong>⚠️ 安全提示：</strong>
        失速与速度无关，<em>只与迎角有关</em>。高速大过载机动也可能失速（高速失速）。
      </div>

      <h3>🧠 两种视角：伯努利 vs 牛顿</h3>
      <div class="perspective-grid">
        <div class="perspective-card">
          <h4>💧 伯努利原理（能量守恒）</h4>
          <p>
            翼型上表面弯曲程度大，气流被压缩、流速加快，
            根据 <strong>伯努利方程</strong> 流速越快静压越低。
            上下表面<strong>压强差</strong>即为升力来源。
          </p>
          <div ref="formulaBernoulli" class="formula-block small"></div>
        </div>
        <div class="perspective-card">
          <h4>🍎 牛顿第三定律（动量定理）</h4>
          <p>
            翼型将气流<strong>向下偏转</strong>（下洗），
            给予空气向下的动量。根据 <strong>作用力与反作用力</strong>，
            空气对翼型产生向上的反作用力 —— 这就是升力。
          </p>
          <div ref="formulaNewton" class="formula-block small"></div>
        </div>
      </div>
      <div class="callout callout-success">
        <strong>✅ 结论：</strong>
        两种解释并不矛盾 —— 它们是同一物理现象的不同侧面。
        完整的空气动力学理论（如 Kutta-Joukowski 定理）将两者统一。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import katex from 'katex'

/* ============== 物理常数与模型参数 ============== */
const CL0 = 0.3 // α=0 时的升力系数（对称翼型参考）
const CL_ALPHA = 0.1 // 升力系数随迎角的斜率（/度）
const STALL_ALPHA = 15 // 临界迎角（度）
const STALL_ALPHA_MIN = -5 // 负失速迎角（度）

/* ============== 响应式状态 ============== */
const params = reactive({
  velocity: 30, // m/s
  area: 2, // m²
  alpha: 5, // 度
  density: 1.225 // kg/m³
})

const canvasRef = ref(null)
const formulaLift = ref(null)
const formulaCL = ref(null)
const formulaBernoulli = ref(null)
const formulaNewton = ref(null)

let animationId = null
let time = 0 // 动画时钟（用于粒子位移）
let particles = [] // 气流粒子
const PARTICLE_COUNT = 90

/* ============== 计算结果 ============== */
const isStalled = computed(
  () => params.alpha > STALL_ALPHA || params.alpha < STALL_ALPHA_MIN
)

const results = reactive({
  lift: 0,
  CL: 0,
  dynamicPressure: 0,
  flowRegime: ''
})

// 升力系数模型：线性 + 失速衰减
const computeCL = (alphaDeg) => {
  if (alphaDeg > STALL_ALPHA) {
    // 失速后 CL 急剧下降（每超 1° 衰减 0.07）
    const overshoot = alphaDeg - STALL_ALPHA
    const clMax = CL0 + CL_ALPHA * STALL_ALPHA
    return Math.max(0.2, clMax - overshoot * 0.07)
  }
  if (alphaDeg < STALL_ALPHA_MIN) {
    const overshoot = STALL_ALPHA_MIN - alphaDeg
    const clMin = CL0 + CL_ALPHA * STALL_ALPHA_MIN
    return Math.min(-0.2, clMin + overshoot * 0.07)
  }
  return CL0 + CL_ALPHA * alphaDeg
}

const calculate = () => {
  const v = params.velocity
  const S = params.area
  const rho = params.density
  const alpha = params.alpha

  const CL = computeCL(alpha)
  const q = 0.5 * rho * v * v // 动压
  const L = q * S * CL // 升力

  results.CL = CL
  results.dynamicPressure = q
  results.lift = Math.max(0, L)

  // 流态描述
  if (isStalled.value) results.flowRegime = '气流分离'
  else if (alpha > 12) results.flowRegime = '高升力'
  else if (alpha < 0) results.flowRegime = '负升力'
  else results.flowRegime = '正常巡航'
}

/* ============== 预设场景 ============== */
const presets = [
  { name: '🛫 起飞', velocity: 30, area: 2, alpha: 10, density: 1.225 },
  { name: '🛩️ 巡航', velocity: 70, area: 2, alpha: 3, density: 0.414 },
  { name: '🪂 着陆', velocity: 15, area: 3, alpha: 8, density: 1.225 },
  { name: '⚠️ 失速', velocity: 20, area: 2, alpha: 18, density: 1.225 }
]

const applyPreset = (preset) => {
  params.velocity = preset.velocity
  params.area = preset.area
  params.alpha = preset.alpha
  params.density = preset.density
}

/* ============== 数字格式化 ============== */
const formatNum = (num, digits = 2) => {
  if (num === null || num === undefined || Number.isNaN(num)) return '0'
  if (Math.abs(num) >= 10000) return num.toFixed(0)
  if (Math.abs(num) >= 100) return num.toFixed(digits < 1 ? 0 : digits)
  return num.toFixed(digits)
}

/* ============== KaTeX 公式渲染 ============== */
const renderFormula = (el, tex, displayMode = true) => {
  if (!el) return
  try {
    el.innerHTML = katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      output: 'htmlAndMathml'
    })
  } catch (e) {
    el.textContent = tex
  }
}

const renderAllFormulas = () => {
  renderFormula(
    formulaLift.value,
    'L = \\dfrac{1}{2}\\,\\rho\\,v^{2}\\,S\\,C_L',
    true
  )
  renderFormula(
    formulaCL.value,
    'C_L = C_{L0} + C_{L\\alpha}\\cdot\\alpha \\approx 0.3 + 0.1\\,\\alpha',
    true
  )
  renderFormula(
    formulaBernoulli.value,
    'p + \\tfrac{1}{2}\\rho v^{2} = \\text{const}',
    false
  )
  renderFormula(
    formulaNewton.value,
    'L = \\dot{m}\\,\\Delta v_{\\downarrow}',
    false
  )
}

/* ============== Canvas 可视化 ============== */
// 初始化气流粒子
const initParticles = (canvasW, canvasH) => {
  particles = []
  const rows = 9
  const perRow = Math.ceil(PARTICLE_COUNT / rows)
  for (let r = 0; r < rows; r++) {
    const baseY = 60 + (r / (rows - 1)) * (canvasH - 120)
    for (let i = 0; i < perRow; i++) {
      particles.push({
        x: (i / perRow) * canvasW + Math.random() * 30,
        baseY,
        y: baseY,
        row: r,
        rows,
        speed: 1
      })
    }
  }
}

// 翼型轮廓（NACA 风格简化，单位为归一化坐标）
// 返回一系列 (x, y) 描述翼型上下表面（弦长 = 1）
const airfoilProfile = () => {
  const top = []
  const bottom = []
  const N = 30
  for (let i = 0; i <= N; i++) {
    const x = i / N
    // 不对称翼型：上表面更弯
    const yt = 0.12 * Math.sin(Math.PI * Math.sqrt(x)) // 上表面厚度
    const yb = -0.06 * Math.sin(Math.PI * Math.sqrt(x)) // 下表面较平
    top.push([x, yt])
    bottom.push([x, yb])
  }
  return { top, bottom }
}

const drawScene = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  // 翼型参数（像素）
  const cx = W / 2
  const cy = H / 2 + 10 // 翼型中心略偏下
  const chord = 260 // 弦长（像素）
  const alphaRad = (params.alpha * Math.PI) / 180

  /* ----- 1. 背景：深空 ----- */
  ctx.fillStyle = '#0a1929'
  ctx.fillRect(0, 0, W, H)

  // 微弱网格（增加深度感）
  ctx.strokeStyle = 'rgba(79, 195, 247, 0.05)'
  ctx.lineWidth = 1
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  /* ----- 2. 计算流线弯曲量（基于翼型局部 y） ----- */
  // 给定 x（屏幕坐标），返回翼型上下表面 y（屏幕坐标，未旋转）
  const profile = airfoilProfile()

  // 翼型在屏幕坐标的边界（未旋转，前缘在 cx-chord/2）
  const leadingX = cx - chord / 2

  // 计算 x 对应的翼型上下表面 y（局部，未旋转）
  const airfoilTopY = (xLocal) => {
    // xLocal: 0..1
    const idx = Math.round(xLocal * profile.top.length)
    const i = Math.max(0, Math.min(profile.top.length - 1, idx))
    return cy - profile.top[i][1] * chord
  }
  const airfoilBottomY = (xLocal) => {
    const idx = Math.round(xLocal * profile.bottom.length)
    const i = Math.max(0, Math.min(profile.bottom.length - 1, idx))
    return cy - profile.bottom[i][1] * chord
  }

  // 流线偏移函数：粒子在翼型附近被"挤压"或"舒展"
  // 上方流线向上弯曲（绕过翼型上表面），下方流线略向下弯曲
  const streamOffset = (px, py) => {
    // px: 粒子 x 屏幕坐标
    const dx = (px - leadingX) / chord // 0 = 前缘, 1 = 后缘
    if (dx < -0.3 || dx > 1.3) return 0
    // 影响范围 [-0.3, 1.3]，峰值在翼型中部
    let envelope
    if (dx < 0) envelope = Math.max(0, 1 + dx / 0.3) * 0.4 // 进入段渐入
    else if (dx > 1) envelope = Math.max(0, 1 - (dx - 1) / 0.3) * 0.4 // 离开段渐出
    else envelope = Math.sin(Math.PI * dx) * 0.6 + 0.4 // 中间强

    const relY = py - cy // 相对翼型中心
    // 上方粒子（relY<0）按上表面抬升；下方粒子按迎角+下表面下沉
    const upperSurface = airfoilTopY(Math.max(0, Math.min(1, dx))) - cy
    const lowerSurface = airfoilBottomY(Math.max(0, Math.min(1, dx))) - cy
    if (relY < 0) {
      // 上方：被向上推（绕流），推力随距翼面距离衰减
      const dist = Math.abs(relY)
      const decay = Math.exp(-dist / 80)
      return (upperSurface - relY) * envelope * decay * 0.85
    } else {
      const dist = Math.abs(relY)
      const decay = Math.exp(-dist / 80)
      return (lowerSurface - relY) * envelope * decay * 0.6
    }
  }

  /* ----- 3. 绘制流线（连续曲线）+ 失速时叠加涡流抖动 ----- */
  const drawStreamlines = () => {
    const rows = 9
    const stalled = isStalled.value
    ctx.lineWidth = 1.2
    for (let r = 0; r < rows; r++) {
      const baseY = 60 + (r / (rows - 1)) * (H - 120)
      const relY = baseY - cy
      const isUpper = relY < 0
      // 失速时上表面流线变色
      if (stalled && isUpper) {
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.35)'
      } else {
        // 上方流线稍亮（流速快），下方略暗
        const alpha = isUpper ? 0.55 : 0.32
        ctx.strokeStyle = `rgba(79, 195, 247, ${alpha})`
      }
      ctx.beginPath()
      const step = 4
      for (let px = 0; px <= W; px += step) {
        let y = baseY + streamOffset(px, baseY)
        // 失速时上方流线叠加紊乱抖动
        if (stalled && isUpper) {
          const dx = (px - leadingX) / chord
          if (dx > 0 && dx < 1.5) {
            const turb = Math.sin(px * 0.15 + time * 0.08 + r) * 8
            const turb2 = Math.sin(px * 0.07 - time * 0.05) * 6
            y += (turb + turb2) * Math.min(1, dx)
          }
        }
        if (px === 0) ctx.moveTo(px, y)
        else ctx.lineTo(px, y)
      }
      ctx.stroke()
    }
  }
  drawStreamlines()

  /* ----- 4. 翼型（旋转后绘制） ----- */
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(-alphaRad) // 迎角正值 → 前缘抬起（屏幕坐标系 y 向下，取负）

  // 翼型路径
  const drawAirfoilPath = () => {
    ctx.beginPath()
    const top = profile.top
    const bottom = profile.bottom
    ctx.moveTo(-chord / 2, -top[0][1] * chord)
    for (let i = 1; i < top.length; i++) {
      ctx.lineTo(-chord / 2 + top[i][0] * chord, -top[i][1] * chord)
    }
    for (let i = bottom.length - 1; i >= 0; i--) {
      ctx.lineTo(-chord / 2 + bottom[i][0] * chord, -bottom[i][1] * chord)
    }
    ctx.closePath()
  }

  // 翼型填充（带渐变高光）
  const grad = ctx.createLinearGradient(0, -30, 0, 20)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.5, '#e3f2fd')
  grad.addColorStop(1, '#b0bec5')
  ctx.fillStyle = grad
  drawAirfoilPath()
  ctx.fill()

  // 翼型描边
  ctx.strokeStyle = '#cfd8dc'
  ctx.lineWidth = 1.5
  drawAirfoilPath()
  ctx.stroke()

  // 前缘高光圆点
  ctx.fillStyle = '#4fc3f7'
  ctx.beginPath()
  ctx.arc(-chord / 2, 0, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  /* ----- 5. 气流粒子（沿流线移动的小圆点） ----- */
  ctx.save()
  particles.forEach((p) => {
    // 粒子速度：上方流线更快（伯努利效应可视化）
    const relY = p.baseY - cy
    const speedFactor = relY < 0 ? 1.4 : 0.85
    // 真实流速也影响动画速度
    const vFactor = 0.4 + (params.velocity / 100) * 1.2
    p.x += speedFactor * vFactor * 1.6

    if (p.x > W + 10) p.x = -10

    let y = p.baseY + streamOffset(p.x, p.baseY)
    // 失速时上方粒子抖动
    if (isStalled.value && relY < 0) {
      const dx = (p.x - leadingX) / chord
      if (dx > 0 && dx < 1.5) {
        y += Math.sin(p.x * 0.2 + time * 0.1 + p.row) * 6
      }
    }
    p.y = y

    // 粒子颜色：上方青色更亮，失速时上方变橙
    const stalled = isStalled.value
    if (stalled && relY < 0 && (p.x - leadingX) / chord > 0) {
      ctx.fillStyle = 'rgba(255, 107, 53, 0.9)'
      ctx.shadowColor = '#ff6b35'
    } else if (relY < 0) {
      ctx.fillStyle = 'rgba(129, 212, 250, 0.95)'
      ctx.shadowColor = '#4fc3f7'
    } else {
      ctx.fillStyle = 'rgba(79, 195, 247, 0.7)'
      ctx.shadowColor = '#4fc3f7'
    }
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
  ctx.shadowBlur = 0

  /* ----- 6. 升力箭头（向上）----- */
  if (results.lift > 0) {
    // 箭头长度按升力大小对数缩放，避免极端值溢出
    const arrowLen = Math.min(160, 18 + Math.log10(results.lift + 1) * 42)
    const arrowX = cx
    const arrowY0 = cy - 18
    const arrowY1 = arrowY0 - arrowLen

    // 箭杆（带渐变）
    const ag = ctx.createLinearGradient(arrowX, arrowY0, arrowX, arrowY1)
    ag.addColorStop(0, 'rgba(255, 213, 79, 0.4)')
    ag.addColorStop(1, '#ffd54f')
    ctx.strokeStyle = ag
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(arrowX, arrowY0)
    ctx.lineTo(arrowX, arrowY1)
    ctx.stroke()

    // 箭头
    ctx.fillStyle = '#ffd54f'
    ctx.shadowColor = '#ffd54f'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.moveTo(arrowX, arrowY1 - 12)
    ctx.lineTo(arrowX - 8, arrowY1)
    ctx.lineTo(arrowX + 8, arrowY1)
    ctx.closePath()
    ctx.fill()
    ctx.shadowBlur = 0

    // 标签
    ctx.fillStyle = '#ffd54f'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`升力 L = ${formatNum(results.lift, 0)} N`, arrowX + 14, arrowY1 + 6)
  }

  /* ----- 7. 迎角标识线（弦线 + 来流方向） ----- */
  // 弦线已隐含在翼型中；画一条水平参考线表示来流方向
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
  ctx.lineWidth = 1
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.moveTo(cx - chord / 2 - 30, cy)
  ctx.lineTo(cx + chord / 2 + 30, cy)
  ctx.stroke()
  ctx.setLineDash([])

  // 迎角弧线与角度文本（在前缘附近）
  if (Math.abs(params.alpha) > 0.5) {
    ctx.strokeStyle = 'rgba(179, 136, 255, 0.8)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    const arcR = 36
    const startA = Math.PI
    const endA = Math.PI + alphaRad
    ctx.arc(cx - chord / 2, cy, arcR, Math.min(startA, endA), Math.max(startA, endA))
    ctx.stroke()
    ctx.fillStyle = '#b388ff'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`α=${params.alpha.toFixed(0)}°`, cx - chord / 2 - 8, cy - 12)
  }

  /* ----- 8. HUD 信息（左上角） ----- */
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.font = '12px monospace'
  ctx.textAlign = 'left'
  const hudLines = [
    `v = ${params.velocity.toFixed(0)} m/s`,
    `S = ${params.area.toFixed(1)} m²`,
    `ρ = ${params.density.toFixed(3)} kg/m³`,
    `q = ${formatNum(results.dynamicPressure, 0)} Pa`,
    `C_L = ${results.CL.toFixed(3)}`
  ]
  hudLines.forEach((line, i) => {
    ctx.fillText(line, 12, 20 + i * 16)
  })

  // 失速警示横幅
  if (isStalled.value) {
    ctx.fillStyle = 'rgba(255, 107, 53, 0.92)'
    ctx.fillRect(W / 2 - 80, 12, 160, 26)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚠️ 失速 STALL', W / 2, 30)
  }

  time += 1
}

const animate = () => {
  drawScene()
  animationId = requestAnimationFrame(animate)
}

/* ============== 生命周期 ============== */
watch(
  () => ({ ...params }),
  () => {
    calculate()
  },
  { deep: true }
)

onMounted(() => {
  // 初始化粒子
  if (canvasRef.value) {
    initParticles(canvasRef.value.width, canvasRef.value.height)
  }
  calculate()
  renderAllFormulas()
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

.inline-formula {
  color: var(--space-primary);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}

/* 滑块美化 */
.control-group input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--space-primary), var(--space-purple));
  outline: none;
  cursor: pointer;
  padding: 0;
  border: none;
}

.control-group input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--space-primary);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
}

.control-group input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.control-group input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--space-primary);
  cursor: pointer;
}

.range-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.stall-tag {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.05rem 0.45rem;
  background: var(--space-accent);
  color: #fff;
  font-size: 0.7rem;
  border-radius: 4px;
  font-weight: 700;
  font-style: normal;
}

.stall-value {
  color: var(--space-accent) !important;
}

.stall-banner {
  font-size: 0.95rem;
  line-height: 1.6;
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

.formula-block.small {
  padding: 0.6rem;
  font-size: 0.95rem;
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

.tool-container td:nth-child(n + 2) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

/* 两种视角卡片 */
.perspective-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.perspective-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
}

.perspective-card h4 {
  margin: 0 0 0.5rem;
  color: var(--space-primary);
  font-size: 1rem;
}

.perspective-card p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .perspective-grid {
    grid-template-columns: 1fr;
  }
}
</style>
