<template>
  <div class="resource-card" :class="typeClass">
    <div class="card-header">
      <div class="badge-group">
        <span class="type-badge">{{ typeInfo.icon }} {{ typeInfo.label }}</span>
        <span class="level-badge" :class="levelClass">{{ levelInfo }}</span>
      </div>
      <div class="badge-group">
        <span class="lang-badge" v-if="!isLocal">{{ lang === 'zh' ? '🇨🇳 中文' : '🇺🇸 英文' }}</span>
        <span class="speed-badge" :class="speedClass">{{ speedInfo }}</span>
      </div>
    </div>
    <h4 class="card-title">{{ name }}</h4>
    <p class="card-desc">{{ desc }}</p>
    <p class="card-usage" v-if="usage"><strong>🎓 课堂用法：</strong>{{ usage }}</p>
    <div class="card-actions">
      <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer" class="btn-primary">
        {{ isWeb ? '🚀 打开工具' : '⬇️ 前往下载' }} ↗
      </a>
      <a v-if="guideUrl" :href="guideUrl" class="btn-guide">
        📖 中文使用指南
      </a>
    </div>
    <p v-if="backup" class="card-backup">💡 {{ backup }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  // 类型：web（网页直接用）/ desktop（需安装桌面软件）/ python（Python库）
  type: { type: String, default: 'web' },
  // 难度：beginner / intermediate / advanced
  level: { type: String, default: 'beginner' },
  desc: { type: String, default: '' },
  usage: { type: String, default: '' },
  url: { type: String, default: '' },
  // 中文指南链接（本站内页）
  guideUrl: { type: String, default: '' },
  backup: { type: String, default: '' },
  // 语言：zh / en
  lang: { type: String, default: 'zh' },
  // 速度：local（本站秒开）/ fast（快）/ slow（境外慢载）
  speed: { type: String, default: 'fast' }
})

const TYPE_MAP = {
  web: { icon: '🟢', label: '网页直接用', class: 'type-web' },
  desktop: { icon: '💿', label: '需安装软件', class: 'type-desktop' },
  python: { icon: '🐍', label: 'Python 库', class: 'type-python' }
}

const LEVEL_MAP = {
  beginner: { label: '入门', class: 'level-beginner' },
  intermediate: { label: '进阶', class: 'level-intermediate' },
  advanced: { label: '高阶', class: 'level-advanced' }
}

const SPEED_MAP = {
  local: { label: '⚡ 本站秒开', class: 'speed-local' },
  fast: { label: '🚀 加载快', class: 'speed-fast' },
  slow: { label: '🐢 境外·首次约30秒', class: 'speed-slow' }
}

const typeInfo = computed(() => TYPE_MAP[props.type] || TYPE_MAP.web)
const levelInfo = computed(() => LEVEL_MAP[props.level]?.label || '入门')
const levelClass = computed(() => LEVEL_MAP[props.level]?.class || 'level-beginner')
const typeClass = computed(() => typeInfo.value.class)
const isWeb = computed(() => props.type === 'web')
const isLocal = computed(() => props.speed === 'local')
const speedInfo = computed(() => SPEED_MAP[props.speed]?.label || '')
const speedClass = computed(() => SPEED_MAP[props.speed]?.class || '')
</script>

<style scoped>
.resource-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
  margin: 0.75rem 0;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.resource-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(79, 195, 247, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge-group {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: wrap;
}

.lang-badge {
  font-size: 0.75rem;
  padding: 0.12rem 0.55rem;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.speed-badge {
  font-size: 0.72rem;
  padding: 0.12rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}
.speed-local {
  background: rgba(102, 187, 106, 0.15);
  color: #4caf50;
}
.speed-fast {
  background: rgba(79, 195, 247, 0.12);
  color: #4fc3f7;
}
.speed-slow {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.btn-guide {
  display: inline-block;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.87rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  transition: all 0.2s;
}
.btn-guide:hover {
  background: var(--vp-c-brand-soft);
}

.type-badge {
  font-size: 0.78rem;
  padding: 0.15rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}
.type-web .type-badge {
  background: rgba(102, 187, 106, 0.15);
  color: #4caf50;
  border: 1px solid rgba(102, 187, 106, 0.35);
}
.type-desktop .type-badge {
  background: rgba(79, 195, 247, 0.12);
  color: #4fc3f7;
  border: 1px solid rgba(79, 195, 247, 0.35);
}
.type-python .type-badge {
  background: rgba(179, 136, 255, 0.12);
  color: #b388ff;
  border: 1px solid rgba(179, 136, 255, 0.35);
}

.level-badge {
  font-size: 0.72rem;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}
.level-beginner {
  background: rgba(102, 187, 106, 0.12);
  color: #66bb6a;
}
.level-intermediate {
  background: rgba(255, 213, 79, 0.15);
  color: #f9a825;
}
.level-advanced {
  background: rgba(255, 107, 53, 0.12);
  color: #ff6b35;
}

.card-title {
  margin: 0 0 0.35rem;
  font-size: 1.02rem;
  color: var(--vp-c-text-1);
}

.card-desc {
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.card-usage {
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.card-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.87rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.btn-primary:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
}
.btn-secondary {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}
.btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.card-backup {
  margin: 0.6rem 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}
</style>
