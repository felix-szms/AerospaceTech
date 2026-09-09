<template>
  <div class="link-check">
    <p class="check-tip">逐个点击右侧按钮验证，能打开即 ✅。打不开时查看该行的备选方案。</p>
    <div v-for="(group, lesson) in groupedTools" :key="lesson" class="check-group">
      <h4 class="group-title">第 {{ lesson }} 课 · {{ lessonTitles[lesson] || '' }}</h4>
      <div v-for="(tool, i) in group" :key="i" class="check-row">
        <span class="tool-type">{{ typeIcon(tool.type) }}</span>
        <span class="tool-name">{{ tool.name }}</span>
        <span v-if="tool.backup" class="tool-backup" :title="tool.backup">💡有备选</span>
        <a :href="tool.url" target="_blank" rel="noopener noreferrer" class="check-btn">
          检查链接 ↗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { lessonTools } from '../data/toolResources'

const lessonTitles = {
  1: '飞天梦启航', 2: '大气层与飞行环境', 3: '飞行原理', 5: '手掷滑翔机',
  6: '无人机系统', 8: '飞行任务综合赛', 9: '航天动力学', 10: '火箭推进原理',
  11: '水火箭设计', 12: '模型火箭仿真', 13: '立方星与载荷', 14: 'CanSat 数据采集', 15: '北斗与遥感'
}

const groupedTools = computed(() => {
  const sorted = {}
  Object.keys(lessonTools).map(Number).sort((a, b) => a - b).forEach(k => {
    sorted[k] = lessonTools[k]
  })
  return sorted
})

const typeIcon = (t) => {
  return t === 'web' ? '🟢' : t === 'desktop' ? '💿' : '🐍'
}
</script>

<style scoped>
.link-check {
  margin: 1.5rem 0;
}

.check-tip {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.check-group {
  margin-bottom: 1.25rem;
}

.group-title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 0.6rem;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 0.4rem;
  background: var(--vp-c-bg-soft);
  flex-wrap: wrap;
}

.tool-type {
  flex-shrink: 0;
}

.tool-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  min-width: 200px;
}

.tool-backup {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.check-btn {
  padding: 0.3rem 0.9rem;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.82rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}
.check-btn:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
}
</style>
