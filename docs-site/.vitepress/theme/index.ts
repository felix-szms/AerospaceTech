import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import '../styles/custom.css'

// 全局注册交互组件
import OrbitCalculator from '../components/OrbitCalculator.vue'
import RocketSimulator from '../components/RocketSimulator.vue'
import SpaceTimeline from '../components/SpaceTimeline.vue'
import MissionSimulator from '../components/MissionSimulator.vue'
import ScienceDiagram from '../components/ScienceDiagram.vue'
import AerodynamicsLab from '../components/AerodynamicsLab.vue'
import MathFormula from '../components/MathFormula.vue'
import HistoryGallery from '../components/HistoryGallery.vue'
import AviationHistory from '../components/AviationHistory.vue'
import SpaceHistory from '../components/SpaceHistory.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件，可在 Markdown 中直接使用
    app.component('OrbitCalculator', OrbitCalculator)
    app.component('RocketSimulator', RocketSimulator)
    app.component('SpaceTimeline', SpaceTimeline)
    app.component('MissionSimulator', MissionSimulator)
    app.component('ScienceDiagram', ScienceDiagram)
    app.component('AerodynamicsLab', AerodynamicsLab)
    app.component('MathFormula', MathFormula)
    app.component('HistoryGallery', HistoryGallery)
    app.component('AviationHistory', AviationHistory)
    app.component('SpaceHistory', SpaceHistory)
  }
} satisfies Theme
