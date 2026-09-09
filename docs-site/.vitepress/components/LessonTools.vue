<template>
  <div class="lesson-tools" v-if="tools.length">
    <div class="tools-header">
      <h3 id="在线体验工具">💻 在线体验工具</h3>
      <p class="tools-tip">先学原理（📖 讲义）→ 上手工具（本区）→ 动手实践（🔧 实践活动）</p>
    </div>
    <div class="tools-grid">
      <ResourceCard
        v-for="(tool, i) in tools"
        :key="i"
        :name="tool.name"
        :type="tool.type"
        :level="tool.level"
        :desc="tool.desc"
        :usage="tool.usage"
        :url="tool.url"
        :guide-url="tool.guideUrl"
        :backup="tool.backup"
        :lang="tool.lang || 'zh'"
        :speed="tool.speed || 'fast'"
      />
    </div>
  </div>
</template>

<script setup>
import ResourceCard from './ResourceCard.vue'
import { computed } from 'vue'
import { lessonTools } from '../data/toolResources'

const props = defineProps({
  lesson: {
    type: Number,
    required: true
  }
})

const tools = computed(() => lessonTools[props.lesson] || [])
</script>

<style scoped>
.lesson-tools {
  margin: 1.5rem 0 2rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(79, 195, 247, 0.06), rgba(179, 136, 255, 0.04));
  border: 1px solid rgba(79, 195, 247, 0.25);
}

.tools-header h3 {
  margin: 0 0 0.3rem;
  color: var(--vp-c-text-1);
  font-size: 1.15rem;
}

.tools-tip {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
}

@media (min-width: 960px) {
  .tools-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
