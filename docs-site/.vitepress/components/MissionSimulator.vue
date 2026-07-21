<template>
  <div class="tool-container">
    <h2 class="tool-title">🎯 航天任务模拟器</h2>
    <p class="tool-desc">
      设计一个航天任务：选择任务目标、轨道、火箭和载荷，系统将评估可行性并讲解设计思路。
    </p>

    <!-- 步骤指示器 -->
    <div class="steps">
      <div v-for="(step, i) in steps" :key="i" class="step" :class="{ active: currentStep === i, done: currentStep > i }">
        <div class="step-circle">{{ currentStep > i ? '✓' : i + 1 }}</div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>

    <!-- Step 1: 选择任务类型 -->
    <div v-if="currentStep === 0" class="step-content">
      <h3>第一步：你的航天任务是什么？</h3>
      <div class="option-grid">
        <div
          v-for="m in missionTypes"
          :key="m.key"
          class="option-card"
          :class="{ selected: config.missionType === m.key }"
          @click="selectMission(m.key)"
        >
          <div class="option-icon">{{ m.icon }}</div>
          <div class="option-title">{{ m.title }}</div>
          <div class="option-desc">{{ m.desc }}</div>
        </div>
      </div>
    </div>

    <!-- Step 2: 选择轨道 -->
    <div v-if="currentStep === 1" class="step-content">
      <h3>第二步：选择合适的轨道</h3>
      <p class="hint">提示：不同任务适合不同的轨道，请思考你的任务最需要什么。</p>
      <div class="option-grid">
        <div
          v-for="o in orbits"
          :key="o.key"
          class="option-card"
          :class="{ selected: config.orbit === o.key, recommended: o.recommend === config.missionType }"
          @click="selectOrbit(o.key)"
        >
          <div class="option-icon">{{ o.icon }}</div>
          <div class="option-title">{{ o.title }}</div>
          <div class="option-desc">{{ o.altitude }}</div>
          <div class="option-desc" v-if="o.recommend === config.missionType">⭐ 推荐</div>
        </div>
      </div>
    </div>

    <!-- Step 3: 选择火箭 -->
    <div v-if="currentStep === 2" class="step-content">
      <h3>第三步：选择运载火箭</h3>
      <p class="hint">提示：火箭的运载能力要匹配轨道需求。</p>
      <div class="option-grid">
        <div
          v-for="r in rockets"
          :key="r.key"
          class="option-card"
          :class="{ selected: config.rocket === r.key }"
          @click="selectRocket(r.key)"
        >
          <div class="option-icon">{{ r.icon }}</div>
          <div class="option-title">{{ r.title }}</div>
          <div class="option-desc">LEO: {{ r.leoCapacity }}</div>
          <div class="option-desc">{{ r.note }}</div>
        </div>
      </div>
    </div>

    <!-- Step 4: 选择载荷 -->
    <div v-if="currentStep === 3" class="step-content">
      <h3>第四步：选择科学载荷</h3>
      <p class="hint">载荷是卫星的"灵魂"，决定任务能做什么。</p>
      <div class="option-grid">
        <div
          v-for="p in payloads"
          :key="p.key"
          class="option-card"
          :class="{ selected: config.payload === p.key, recommended: p.recommend === config.missionType }"
          @click="selectPayload(p.key)"
        >
          <div class="option-icon">{{ p.icon }}</div>
          <div class="option-title">{{ p.title }}</div>
          <div class="option-desc">{{ p.desc }}</div>
          <div class="option-desc" v-if="p.recommend === config.missionType">⭐ 推荐</div>
        </div>
      </div>
    </div>

    <!-- Step 5: 评估报告 -->
    <div v-if="currentStep === 4" class="step-content">
      <h3>🎉 任务设计评估报告</h3>
      <div class="report-section">
        <h4>📋 你的任务配置</h4>
        <table class="config-table">
          <tr><td>任务类型</td><td><strong>{{ getMissionTitle() }}</strong></td></tr>
          <tr><td>轨道</td><td><strong>{{ getOrbitTitle() }}</strong></td></tr>
          <tr><td>火箭</td><td><strong>{{ getRocketTitle() }}</strong></td></tr>
          <tr><td>载荷</td><td><strong>{{ getPayloadTitle() }}</strong></td></tr>
        </table>
      </div>

      <div class="report-section">
        <h4>🎯 可行性评分</h4>
        <div class="score-bar-container">
          <div class="score-bar" :style="{ width: evaluation.score + '%' }"></div>
        </div>
        <div class="score-text">{{ evaluation.score }}/100 · {{ evaluation.level }}</div>
      </div>

      <div class="report-section">
        <h4>💡 评估分析</h4>
        <div v-for="(comment, i) in evaluation.comments" :key="i" class="callout" :class="comment.type">
          {{ comment.icon }} {{ comment.text }}
        </div>
      </div>

      <div class="report-section">
        <h4>📚 知识拓展</h4>
        <p>{{ evaluation.knowledge }}</p>
      </div>

      <div class="report-section" v-if="evaluation.similar">
        <h4>🛰️ 类似真实任务</h4>
        <p>{{ evaluation.similar }}</p>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="nav-buttons">
      <button v-if="currentStep > 0" class="btn btn-secondary" @click="prevStep">← 上一步</button>
      <button v-if="currentStep < 4 && canProceed" class="btn" @click="nextStep">下一步 →</button>
      <button v-if="currentStep === 4" class="btn" @click="restart">🔄 重新设计</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const steps = [
  { label: '任务' },
  { label: '轨道' },
  { label: '火箭' },
  { label: '载荷' },
  { label: '评估' }
]

const currentStep = ref(0)

const config = reactive({
  missionType: '',
  orbit: '',
  rocket: '',
  payload: ''
})

const missionTypes = [
  { key: 'comm', icon: '📡', title: '通信广播', desc: '提供电视、电话、互联网通信服务' },
  { key: 'nav', icon: '🧭', title: '导航定位', desc: '为地面、航空、航海提供定位服务' },
  { key: 'remote', icon: '🌍', title: '遥感对地观测', desc: '气象预报、环境监测、灾害评估' },
  { key: 'manned', icon: '🧑‍🚀', title: '载人航天', desc: '航天员太空驻留与科学实验' },
  { key: 'deep', icon: '🚀', title: '深空探测', desc: '月球、火星、小行星等科学探测' },
  { key: 'science', icon: '🔬', title: '空间科学', desc: '微重力实验、天文观测、基础研究' }
]

const orbits = [
  { key: 'leo', icon: '🌍', title: 'LEO 低地球轨道', altitude: '300-2000 km, 90-120 min', recommend: 'manned' },
  { key: 'meo', icon: '🧭', title: 'MEO 中地球轨道', altitude: '2000-35786 km, 几小时', recommend: 'nav' },
  { key: 'geo', icon: '📡', title: 'GEO 地球静止轨道', altitude: '35786 km, 24h同步', recommend: 'comm' },
  { key: 'sso', icon: '⛅', title: 'SSO 太阳同步轨道', altitude: '500-1000 km, 每天同时过境', recommend: 'remote' },
  { key: 'lunar', icon: '🌙', title: '月球轨道', altitude: '约38万公里', recommend: 'deep' }
]

const rockets = [
  { key: 'cz2f', icon: '🚀', title: '长征二号F', leoCapacity: '8.4吨', note: '载人专用' },
  { key: 'cz5', icon: '🚀', title: '长征五号', leoCapacity: '25吨', note: '大型任务、深空探测' },
  { key: 'cz7', icon: '🚀', title: '长征七号', leoCapacity: '14吨', note: '货运飞船' },
  { key: 'cz3b', icon: '🚀', title: '长征三号乙', leoCapacity: '11吨(LEO)/5.5吨(GTO)', note: '高轨道发射' },
  { key: 'cz11', icon: '🚀', title: '长征十一号', leoCapacity: '0.7吨', note: '固体快速发射' }
]

const payloads = [
  { key: 'antenna', icon: '📡', title: '通信转发器/天线', desc: '通信广播', recommend: 'comm' },
  { key: 'navsignal', icon: '🧭', title: '导航信号发射器', desc: '播发定位信号', recommend: 'nav' },
  { key: 'camera', icon: '📷', title: '光学相机', desc: '可见光遥感', recommend: 'remote' },
  { key: 'sar', icon: '📊', title: '合成孔径雷达(SAR)', desc: '全天候微波遥感', recommend: 'remote' },
  { key: 'crew', icon: '🧑‍🚀', title: '航天员舱', desc: '载人飞船', recommend: 'manned' },
  { key: 'rover', icon: '🤖', title: '巡视器/着陆器', desc: '地外天体探测', recommend: 'deep' }
]

const canProceed = computed(() => {
  if (currentStep.value === 0) return !!config.missionType
  if (currentStep.value === 1) return !!config.orbit
  if (currentStep.value === 2) return !!config.rocket
  if (currentStep.value === 3) return !!config.payload
  return false
})

const selectMission = (k) => { config.missionType = k }
const selectOrbit = (k) => { config.orbit = k }
const selectRocket = (k) => { config.rocket = k }
const selectPayload = (k) => { config.payload = k }

const nextStep = () => {
  if (currentStep.value === 3) {
    runEvaluation()
  }
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const restart = () => {
  currentStep.value = 0
  config.missionType = ''
  config.orbit = ''
  config.rocket = ''
  config.payload = ''
}

const getMissionTitle = () => missionTypes.find(m => m.key === config.missionType)?.title || ''
const getOrbitTitle = () => orbits.find(o => o.key === config.orbit)?.title || ''
const getRocketTitle = () => rockets.find(r => r.key === config.rocket)?.title || ''
const getPayloadTitle = () => payloads.find(p => p.key === config.payload)?.title || ''

// 评估逻辑
const evaluation = reactive({
  score: 0,
  level: '',
  comments: [],
  knowledge: '',
  similar: ''
})

const runEvaluation = () => {
  let score = 0
  const comments = []

  // 检查轨道匹配
  const expectedOrbit = orbits.find(o => o.recommend === config.missionType)?.key
  if (config.orbit === expectedOrbit) {
    score += 30
    comments.push({ type: 'callout-success', icon: '✅', text: '轨道选择非常合适！这是该任务类型的最佳轨道。' })
  } else {
    const orbitObj = orbits.find(o => o.key === config.orbit)
    score += 10
    comments.push({
      type: 'callout-warning',
      icon: '⚠️',
      text: `轨道选择不太匹配。${missionTypes.find(m => m.key === config.missionType)?.title}更适合${orbits.find(o => o.key === expectedOrbit)?.title}。`
    })
  }

  // 检查载荷匹配
  const expectedPayload = payloads.find(p => p.recommend === config.missionType)?.key
  if (config.payload === expectedPayload) {
    score += 30
    comments.push({ type: 'callout-success', icon: '✅', text: '载荷选择完美！这正是该任务需要的核心设备。' })
  } else {
    score += 10
    comments.push({
      type: 'callout-warning',
      icon: '⚠️',
      text: `载荷选择不太匹配。该任务通常需要${payloads.find(p => p.key === expectedPayload)?.title}。`
    })
  }

  // 检查火箭匹配
  const rocketScore = evaluateRocket(config.rocket, config.orbit, config.missionType)
  score += rocketScore.score
  comments.push(rocketScore.comment)

  // 综合加分
  if (config.missionType === 'manned' && config.rocket !== 'cz2f') {
    score -= 15
    comments.push({ type: 'callout-warning', icon: '⚠️', text: '载人任务必须使用具备故障检测和逃逸系统的火箭！长征二号F是目前中国唯一载人火箭。' })
  }

  if (config.missionType === 'deep' && config.rocket !== 'cz5' && config.orbit === 'lunar') {
    score -= 10
    comments.push({ type: 'callout-warning', icon: '⚠️', text: '月球探测需要大型火箭提供足够的发射能量。长征五号是执行深空任务的主力。' })
  }

  score = Math.max(0, Math.min(100, score))
  evaluation.score = score

  // 评级
  if (score >= 85) {
    evaluation.level = '优秀 ⭐⭐⭐'
    comments.push({ type: 'callout-success', icon: '🏆', text: '你的任务设计非常专业！这套配置在真实航天工程中也是合理的。' })
  } else if (score >= 60) {
    evaluation.level = '良好 ⭐⭐'
    comments.push({ type: 'callout-success', icon: '👍', text: '基本合理，但仍有优化空间。' })
  } else if (score >= 40) {
    evaluation.level = '一般 ⭐'
    comments.push({ type: 'callout-warning', icon: '💡', text: '建议重新思考任务与轨道、载荷的匹配关系。' })
  } else {
    evaluation.level = '需要改进'
    comments.push({ type: 'callout-warning', icon: '🔁', text: '航天工程讲究科学匹配，建议重新设计。' })
  }

  // 知识拓展
  evaluation.knowledge = generateKnowledge(config)
  evaluation.similar = generateSimilar(config)

  evaluation.comments = comments
}

const evaluateRocket = (rocketKey, orbitKey, missionKey) => {
  const rocket = rockets.find(r => r.key === rocketKey)
  let score = 0
  let comment = {}

  if (orbitKey === 'geo' || orbitKey === 'lunar') {
    if (rocketKey === 'cz5' || rocketKey === 'cz3b') {
      score = 30
      comment = { type: 'callout-success', icon: '✅', text: `${rocket.title}运力充足，可胜任高轨/深空发射任务。` }
    } else if (rocketKey === 'cz11') {
      score = 5
      comment = { type: 'callout-warning', icon: '⚠️', text: `${rocket.title}运力不足，无法将载荷送入该轨道。` }
    } else {
      score = 15
      comment = { type: 'callout-warning', icon: '⚠️', text: `${rocket.title}可以发射，但可能不是最佳选择。` }
    }
  } else if (orbitKey === 'leo' || orbitKey === 'sso') {
    score = 30
    comment = { type: 'callout-success', icon: '✅', text: `${rocket.title}完全可以胜任近地轨道发射。` }
  } else {
    score = 20
    comment = { type: 'callout-success', icon: '✅', text: `火箭基本满足需求。` }
  }

  return { score, comment }
}

const generateKnowledge = (cfg) => {
  const missionObj = missionTypes.find(m => m.key === cfg.missionType)
  const orbitObj = orbits.find(o => o.key === cfg.orbit)
  const knowledge = {
    comm: '通信卫星通常部署在地球静止轨道(GEO)，因为这样可以与地球自转同步，相对地面"静止"，地面天线不需要跟踪。代表卫星：实践十三号(中星十六号)、天通一号。',
    nav: '北斗三号系统由24颗MEO卫星+3颗GEO卫星+3颗IGSO卫星组成。MEO卫星轨道高度约21528km，周期约12小时。北斗独有的短报文功能在无移动信号时也能发送短信。',
    remote: '遥感卫星常用太阳同步轨道(SSO)，每天同一地方时过境，保证光照条件一致，便于对比分析。光学遥感受云层影响，SAR(合成孔径雷达)可全天候工作。代表：高分系列、风云气象卫星。',
    manned: '载人航天器必须在LEO低轨道运行，以避开范艾伦辐射带。空间站通常在400km左右高度。中国载人火箭只有长征二号F，配备逃逸塔等安全系统。',
    deep: '深空探测需要大型火箭提供足够的逃逸速度(≥11.2km/s)。嫦娥探月、天问探火均使用长征五号。月球距离约38万公里，火星最近时约5500万公里。',
    science: '空间科学卫星通常在LEO或特殊轨道。中国实践十号(微重力)、悟空(暗物质)、墨子号(量子通信)、慧眼(X射线)等都是著名科学卫星。'
  }
  return knowledge[cfg.missionType] || ''
}

const generateSimilar = (cfg) => {
  const similar = {
    'comm-geo-cz3b-antenna': '实践十三号(中星十六号)是中国首颗高通量通信卫星，搭载Ka频段载荷，通信总容量达20Gbps。',
    'nav-meo-cz3b-navsignal': '北斗三号MEO卫星，由长征三号乙/远征一号上面级发射，2018-2020年间密集组网。',
    'remote-sso-cz5-camera': '高分系列对地观测卫星，部分使用长征二号丙/四号丙发射到太阳同步轨道。',
    'remote-sso-cz5-sar': '高分三号是C频段多极化SAR卫星，全天候、全天时对地观测。',
    'manned-leo-cz2f-crew': '神舟载人飞船由长征二号F火箭发射，与天宫空间站对接。航天员驻留可达6个月。',
    'deep-lunar-cz5-rover': '嫦娥五号、嫦娥六号均由长征五号发射，分别完成月球正面和背面采样返回。'
  }
  const key = `${cfg.missionType}-${cfg.orbit}-${cfg.rocket}-${cfg.payload}`
  return similar[key] || '查看国家航天局官网了解中国航天任务的最新动态。'
}
</script>

<style scoped>
.tool-desc {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0 2rem;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--vp-c-divider);
  z-index: 0;
}

.step {
  position: relative;
  z-index: 1;
  text-align: center;
  flex: 1;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.step.active .step-circle {
  border-color: var(--space-primary);
  background: var(--space-primary);
  color: white;
}

.step.done .step-circle {
  background: #66bb6a;
  border-color: #66bb6a;
  color: white;
}

.step-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.step.active .step-label {
  color: var(--space-primary);
  font-weight: 600;
}

.step-content {
  min-height: 300px;
}

.step-content h3 {
  margin-top: 0;
}

.hint {
  color: var(--vp-c-text-2);
  background: rgba(79, 195, 247, 0.08);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--space-primary);
  margin-bottom: 1.5rem;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.option-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-card:hover {
  border-color: var(--space-primary);
  transform: translateY(-2px);
}

.option-card.selected {
  border-color: var(--space-primary);
  background: rgba(79, 195, 247, 0.1);
}

.option-card.recommended {
  border-color: var(--space-gold);
  box-shadow: 0 0 0 2px rgba(255, 213, 79, 0.3);
}

.option-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.option-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
}

.option-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.report-section {
  margin-bottom: 1.5rem;
}

.config-table {
  width: 100%;
  border-collapse: collapse;
}

.config-table td {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.config-table td:first-child {
  color: var(--vp-c-text-2);
  width: 40%;
}

.score-bar-container {
  width: 100%;
  height: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.score-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ffd54f, #66bb6a);
  transition: width 0.5s;
}

.score-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
}
</style>
