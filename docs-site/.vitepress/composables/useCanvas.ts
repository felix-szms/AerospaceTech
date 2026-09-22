/**
 * Canvas 通用 composable：响应式尺寸 + 视口可见性
 *
 * 供 OrbitCalculator / RocketSimulator / AerodynamicsLab / AtmosphereCalculator 复用：
 * - useResponsiveCanvas：canvas CSS 宽度 100%（容器自适应，maxWidth 钉住原始设计宽度，
 *   桌面端视觉与旧版一致、窄屏自动缩小），内部像素按 devicePixelRatio 放大并
 *   setTransform(dpr)，绘图函数统一按 CSS 像素坐标绘制（避免高分屏模糊）。
 *   ResizeObserver 监听尺寸变化，重设 width/height 后回调 onResize 供组件重绘。
 * - useVisibility：IntersectionObserver 监听元素是否在视口内，
 *   供动画循环做"滚出视口暂停、回到视口恢复"的门控。
 */
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export interface CanvasCssSize {
  /** CSS 像素宽度（= canvas.clientWidth） */
  width: number
  /** CSS 像素高度（= 宽度 / aspectRatio） */
  height: number
}

/**
 * 让 canvas 随容器自适应。
 *
 * @param canvasRef   canvas 元素 ref
 * @param aspectRatio 宽/高比值（如 1 表示正方形，2 表示 2:1）
 * @param onResize    尺寸重设后的回调（拿到 CSS 尺寸），组件在其中重绘
 * @param maxWidth    CSS 最大宽度（一般传原始设计宽度），防止容器比设计稿宽时画面放大
 * @returns size      当前 CSS 尺寸（ref），绘图函数可从中读取布局尺寸
 */
export function useResponsiveCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  aspectRatio: number,
  onResize?: (size: CanvasCssSize) => void,
  maxWidth = Infinity
): { size: Ref<CanvasCssSize> } {
  const size = ref<CanvasCssSize>({ width: 0, height: 0 })
  let observer: ResizeObserver | null = null
  let fallbackBound = false

  const syncSize = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    const cssW = canvas.clientWidth
    if (!cssW) return // 容器隐藏（clientWidth 为 0）时跳过
    const cssH = Math.round(cssW / aspectRatio)
    const dpr = window.devicePixelRatio || 1
    const pxW = Math.round(cssW * dpr)
    const pxH = Math.round(cssH * dpr)
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW
      canvas.height = pxH
      // 重新设置 width/height 会重置整个 canvas 上下文，必须重新按 dpr 缩放
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size.value = { width: cssW, height: cssH }
    onResize?.(size.value)
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    // CSS：宽度撑满容器（不超过设计宽度），高度按比例自适应
    canvas.style.width = '100%'
    canvas.style.maxWidth = `${maxWidth}px`
    canvas.style.height = 'auto'
    canvas.style.aspectRatio = `${aspectRatio}`
    // 首次同步（挂载后布局已就绪，clientWidth 可用）
    syncSize()
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => syncSize())
      observer.observe(canvas)
    } else {
      // 兜底：老环境用 window resize
      window.addEventListener('resize', syncSize)
      fallbackBound = true
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (fallbackBound) window.removeEventListener('resize', syncSize)
  })

  return { size }
}

/**
 * 监听元素在视口中的可见性。
 *
 * 初始为 true（避免无 IntersectionObserver 环境下动画永不启动）；
 * 元素完全滚出视口时变 false，回到视口变 true。
 * 组件用 watch(visible) 或在 rAF 循环内判断来暂停/恢复动画。
 *
 * @param targetRef 被监听元素 ref（通常传 canvas 的 ref）
 * @returns visible 是否可见（ref<boolean>）
 */
export function useVisibility(targetRef: Ref<Element | null>): Ref<boolean> {
  const visible = ref(true)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = targetRef.value
    if (!el || typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (entry) visible.value = entry.isIntersecting
      },
      { threshold: 0 } // 任意像素进入视口即视为可见
    )
    observer.observe(el)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return visible
}
