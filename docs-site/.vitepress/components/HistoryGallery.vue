<template>
  <div class="history-gallery">
    <div class="gallery-header">
      <h3 class="gallery-title">{{ title }}</h3>
      <p class="gallery-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>

    <!-- 大图轮播区 -->
    <div class="gallery-main">
      <button class="nav-btn nav-prev" @click="prev" aria-label="上一个">‹</button>
      <div class="gallery-slide">
        <div class="slide-image-wrap">
          <img
            :src="current.image"
            :alt="current.title"
            loading="lazy"
            @error="onImgError"
          />
        </div>
        <!-- 注释信息（图片下方，不再悬浮遮挡）-->
        <div class="slide-caption">
          <div class="slide-year">{{ current.year }}</div>
          <h4 class="slide-title">{{ current.title }}</h4>
          <p class="slide-desc">{{ current.desc }}</p>
          <div class="slide-credit" v-if="current.credit">📷 {{ current.credit }}</div>
        </div>
      </div>
      <button class="nav-btn nav-next" @click="next" aria-label="下一个">›</button>
    </div>

    <!-- 缩略图导航 -->
    <div class="gallery-thumbs">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="thumb"
        :class="{ active: i === currentIdx }"
        @click="currentIdx = i"
      >
        <img :src="item.image" :alt="item.title" loading="lazy" @error="onThumbError($event, i)" />
        <span class="thumb-year">{{ item.year }}</span>
      </div>
    </div>

    <!-- 进度指示 -->
    <div class="gallery-progress">
      <span>{{ currentIdx + 1 }} / {{ items.length }}</span>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: ((currentIdx + 1) / items.length * 100) + '%' }"></div>
      </div>
    </div>

    <!-- 自动播放控制 -->
    <div class="gallery-controls">
      <button class="play-btn" @click="toggleAutoplay">
        {{ autoplay ? '⏸ 暂停' : '▶ 自动播放' }}
      </button>
    </div>

    <!-- 时间线视图（可切换） -->
    <details class="gallery-timeline">
      <summary>📜 查看完整时间线（点击展开）</summary>
      <div class="timeline-list">
        <div v-for="(item, i) in items" :key="i" class="timeline-row" @click="currentIdx = i">
          <div class="timeline-year-col">{{ item.year }}</div>
          <div class="timeline-content-col">
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  title: { type: String, default: '发展历程' },
  subtitle: String,
  items: { type: Array, required: true } // [{ year, title, desc, image, credit }]
})

const currentIdx = ref(0)
const autoplay = ref(false)
let timer = null

const current = computed(() => {
  const item = props.items[currentIdx.value]
  return item || { year: '', title: '', desc: '', image: '', credit: '' }
})

const next = () => {
  currentIdx.value = (currentIdx.value + 1) % props.items.length
}
const prev = () => {
  currentIdx.value = (currentIdx.value - 1 + props.items.length) % props.items.length
}

const toggleAutoplay = () => {
  autoplay.value = !autoplay.value
}

const startTimer = () => {
  stopTimer()
  timer = setInterval(next, 5000)
}
const stopTimer = () => {
  if (timer) { clearInterval(timer); timer = null }
}

watch(autoplay, (val) => {
  if (val) startTimer()
  else stopTimer()
})

// 自动播放时，切换后重置计时器
watch(currentIdx, () => {
  if (autoplay.value) startTimer()
})

onMounted(() => {
  // 默认不自动播放，用户点击后启动
})
onUnmounted(() => stopTimer())

// 图片加载失败处理：显示占位
const onImgError = (e) => {
  const wrap = e.target.parentElement
  if (wrap) {
    wrap.classList.add('img-error')
    e.target.style.display = 'none'
  }
}
const onThumbError = (e) => {
  const wrap = e.target.parentElement
  if (wrap) {
    wrap.classList.add('thumb-error')
    e.target.style.display = 'none'
  }
}
</script>

<style scoped>
.history-gallery {
  margin: 2rem 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem;
}

.gallery-header {
  text-align: center;
  margin-bottom: 1.25rem;
}

.gallery-title {
  margin: 0 0 0.35rem;
  font-size: 1.3rem;
  color: var(--vp-c-text-1);
}

.gallery-subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
}

/* 大图区 */
.gallery-main {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 2;
}
.nav-btn:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.gallery-slide {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #0a1929;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.slide-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #0a1929, #1a3a5c);
}
.slide-image-wrap.img-error {
  background: linear-gradient(135deg, #1a3a5c, #2d4a6c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.4);
}
.slide-image-wrap.img-error::after {
  content: '📷 图片加载失败';
}

.slide-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 关键：默认从顶部对齐，避免裁切人物头部 */
  object-position: center top;
  display: block;
}

.slide-caption {
  padding: 1rem 1.25rem 1.25rem;
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.slide-year {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  background: linear-gradient(135deg, #ff6b35, #f57c00);
  color: #fff;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.slide-title {
  margin: 0 0 0.4rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.slide-desc {
  margin: 0 0 0.5rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.slide-credit {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* 缩略图 */
.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.thumb {
  flex-shrink: 0;
  width: 90px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
  background: #0a1929;
}
.thumb:hover {
  transform: translateY(-2px);
}
.thumb.active {
  border-color: #4fc3f7;
  box-shadow: 0 0 0 2px rgba(79,195,247,0.3);
}
.thumb img {
  width: 100%;
  height: 56px;
  object-fit: cover;
  object-position: center top;
  display: block;
}
.thumb.thumb-error {
  background: linear-gradient(135deg, #1a3a5c, #2d4a6c);
}
.thumb.thumb-error img {
  /* 隐藏后用 ::before 显示占位 */
}
.thumb.thumb-error::before {
  content: '📷';
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-size: 1.3rem;
  opacity: 0.5;
}
.thumb-year {
  display: block;
  text-align: center;
  padding: 0.15rem;
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}
.thumb.active .thumb-year {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* 进度 */
.gallery-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4fc3f7, #b388ff);
  transition: width 0.3s;
}

/* 控制按钮 */
.gallery-controls {
  text-align: center;
  margin-top: 0.75rem;
}
.play-btn {
  padding: 0.4rem 1.1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.play-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* 时间线展开 */
.gallery-timeline {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider);
}
.gallery-timeline summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--vp-c-text-1);
  padding: 0.4rem 0;
}
.timeline-list {
  margin-top: 0.75rem;
}
.timeline-row {
  display: flex;
  gap: 1rem;
  padding: 0.6rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.timeline-row:hover {
  background: var(--vp-c-bg-soft);
}
.timeline-year-col {
  flex-shrink: 0;
  width: 70px;
  font-weight: 700;
  color: #ff6b35;
  font-size: 0.9rem;
}
.timeline-content-col strong {
  color: var(--vp-c-text-1);
  font-size: 0.92rem;
}
.timeline-content-col p {
  margin: 0.2rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .nav-btn {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
  }
  .slide-overlay {
    padding: 1rem 1rem 0.75rem;
  }
  .slide-title {
    font-size: 1rem;
  }
}
</style>
