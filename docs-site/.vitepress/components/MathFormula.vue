<template>
  <span class="math-formula" :class="{ block: display }" v-html="html"></span>
</template>

<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  tex: {
    type: String,
    required: true
  },
  display: {
    type: Boolean,
    default: false
  }
})

// 在计算属性中渲染（SSR 和客户端都会执行）
const html = computed(() => {
  try {
    return katex.renderToString(props.tex, {
      displayMode: props.display,
      throwOnError: false,
      strict: false,
      trust: true,
      output: 'htmlAndMathml'
    })
  } catch (e) {
    return props.tex
  }
})
</script>

<style scoped>
.math-formula.block {
  display: block;
  text-align: center;
  margin: 0.75rem 0;
  overflow-x: auto;
}
</style>
