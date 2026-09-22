/**
 * 物理计算核心模块 —— 教学工具的纯函数库
 *
 * 从各 Vue 组件抽取，保证单一来源；单元测试见 test/physics.test.mjs
 * （node --test --experimental-strip-types test/physics.test.mjs）
 *
 * 注意：本文件不使用 TypeScript 类型注解，便于 Node 直接运行测试。
 */

// ============ 物理常数 ============
export const G = 6.674e-11 // 万有引力常数 N·m²/kg²
export const M_EARTH = 5.972e24 // 地球质量 kg
export const GM = G * M_EARTH // 地球引力参数 m³/s²
export const R_EARTH_KM = 6371 // 地球平均半径 km
export const G0 = 9.80665 // 标准重力加速度 m/s²
export const P_SEA = 101325 // 海平面标准气压 Pa
export const R_AIR = 287.05287 // 干空气气体常数 J/(kg·K)

// ============ ISA 国际标准大气 ============

// 各层参数：[底边界高度 m, 底界温度 K, 温度递减率 K/m]
const ISA_LAYERS = [
  { h0: 0, T0: 288.15, L: -0.0065 },
  { h0: 11000, T0: 216.65, L: 0.0 },
  { h0: 20000, T0: 216.65, L: 0.001 },
  { h0: 32000, T0: 228.65, L: 0.0028 },
  { h0: 47000, T0: 270.65, L: 0.0 },
  { h0: 51000, T0: 270.65, L: -0.0028 },
  { h0: 71000, T0: 214.65, L: -0.002 }
]
const ISA_LAYER_NAMES = ['对流层', '平流层（下）', '平流层（上）', '中间层（下）', '中间层（恒温）', '中间层（上）', '热层（起始）']

function isaLayerPressure(P, layer, dh) {
  if (Math.abs(layer.L) < 1e-9) {
    return P * Math.exp((-G0 * dh) / (R_AIR * layer.T0))
  }
  return P * Math.pow(1 + (layer.L * dh) / layer.T0, -G0 / (layer.L * R_AIR))
}

/**
 * ISA 标准大气参数
 * @param {number} hM 海拔高度，米（0–80000）
 * @returns {{ T:number, P:number, rho:number, a:number, layer:string, layerIndex:number }}
 *          T 温度 K；P 气压 Pa；rho 密度 kg/m³；a 声速 m/s
 */
export function isaAtmosphere(hM) {
  const h = Math.max(0, Math.min(80000, hM))
  let idx = 0
  for (let i = ISA_LAYERS.length - 1; i >= 0; i--) {
    if (h >= ISA_LAYERS[i].h0) { idx = i; break }
  }
  const layer = ISA_LAYERS[idx]
  const T = layer.T0 + layer.L * (h - layer.h0)

  let P = P_SEA
  for (let i = 0; i < idx; i++) {
    P = isaLayerPressure(P, ISA_LAYERS[i], ISA_LAYERS[i + 1].h0 - ISA_LAYERS[i].h0)
  }
  P = isaLayerPressure(P, layer, h - layer.h0)

  return {
    T,
    P,
    rho: P / (R_AIR * T),
    a: Math.sqrt(1.4 * R_AIR * T),
    layer: ISA_LAYER_NAMES[idx],
    layerIndex: idx
  }
}

/**
 * 气压反推高度（BMP280 实验用简化公式，对流层内）
 * @param {number} pHPa 实测气压 hPa
 */
export function pressureToAltitude(pHPa) {
  const ratio = pHPa / 1013.25
  if (ratio <= 0) return 0
  return 44330 * (1 - Math.pow(ratio, 1 / 5.255))
}

// ============ 轨道力学 ============

/**
 * 圆轨道参数
 * @param {number} hKm 轨道高度 km
 * @returns {{ rKm:number, vKmS:number, periodS:number }}
 */
export function circularOrbit(hKm) {
  const rKm = R_EARTH_KM + hKm
  const rM = rKm * 1000
  const vM = Math.sqrt(GM / rM)
  const periodS = 2 * Math.PI * Math.sqrt(Math.pow(rM, 3) / GM)
  return { rKm, vKmS: vM / 1000, periodS }
}

// ============ 火箭性能（齐奥尔科夫斯基） ============

/**
 * 单级火箭垂直飞行的简化性能估算
 * @param {{ totalMass:number, propellantMass:number, exhaustVelocity:number, thrust:number }} p
 *        质量 kg，排气速度 m/s，推力 N
 * @returns {{ deltaV:number, burnTime:number, burnoutVelocity:number, burnoutAltitude:number, maxAltitude:number }}
 */
export function rocketPerformance(p) {
  const { totalMass, propellantMass, exhaustVelocity, thrust } = p
  if (totalMass <= propellantMass || totalMass <= 0 || propellantMass < 0 || exhaustVelocity <= 0 || thrust <= 0) {
    return { deltaV: 0, burnTime: 0, burnoutVelocity: 0, burnoutAltitude: 0, maxAltitude: 0 }
  }
  const deltaV = exhaustVelocity * Math.log(totalMass / (totalMass - propellantMass))
  const burnTime = (propellantMass * exhaustVelocity) / thrust
  const burnoutVelocity = Math.max(0, deltaV - G0 * burnTime)
  const burnoutAltitude = (burnoutVelocity / 2) * burnTime
  const coastAltitude = (burnoutVelocity * burnoutVelocity) / (2 * G0)
  return {
    deltaV,
    burnTime,
    burnoutVelocity,
    burnoutAltitude,
    maxAltitude: burnoutAltitude + coastAltitude
  }
}

// ============ 升力（翼型简化模型） ============

export const CL0 = 0.3 // α=0 升力系数
export const CL_ALPHA = 0.1 // 升力线斜率 /度
export const STALL_ALPHA = 15 // 正失速迎角 度
export const STALL_ALPHA_MIN = -5 // 负失速迎角 度

/**
 * 升力系数（线性段 + 失速衰减）
 * @param {number} alphaDeg 迎角，度
 */
export function liftCoefficient(alphaDeg) {
  if (alphaDeg > STALL_ALPHA) {
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

/**
 * 升力 L = ½ρv²·S·CL
 * @param {{ v:number, S:number, rho:number, alphaDeg:number }} p
 * @returns {{ lift:number, dynamicPressure:number, CL:number, stalled:boolean }}
 */
export function liftForce(p) {
  const CL = liftCoefficient(p.alphaDeg)
  const q = 0.5 * p.rho * p.v * p.v
  return {
    lift: Math.max(0, q * p.S * CL),
    dynamicPressure: q,
    CL,
    stalled: p.alphaDeg > STALL_ALPHA || p.alphaDeg < STALL_ALPHA_MIN
  }
}
