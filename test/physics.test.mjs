/**
 * 物理计算单元测试
 * 运行：npm test（等价 node --test --experimental-strip-types test/physics.test.mjs）
 *
 * 参考值来源（可查证）：
 * - ISA 标准大气：ICAO 7488 / USDA 标准大气表
 * - 轨道参数：NASA / 教科书公开值（ISS 420km 周期≈92.8min，GEO=35786km）
 * - 第一宇宙速度 7.91 km/s、第二宇宙速度 11.19 km/s
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isaAtmosphere, pressureToAltitude, circularOrbit,
  rocketPerformance, liftCoefficient, liftForce,
  P_SEA, R_EARTH_KM
} from '../docs-site/.vitepress/utils/physics.ts'

// ============ ISA 标准大气 ============

test('ISA: 海平面基准值', () => {
  const s = isaAtmosphere(0)
  assert.ok(Math.abs(s.T - 288.15) < 0.01, `T=${s.T} 应为 288.15K`)
  assert.ok(Math.abs(s.P - P_SEA) / P_SEA < 1e-9, `P=${s.P} 应为 ${P_SEA}Pa`)
  assert.ok(Math.abs(s.rho - 1.225) < 0.001, `rho=${s.rho} 应≈1.225`)
  assert.ok(Math.abs(s.a - 340.29) < 0.5, `a=${s.a} 应≈340.3`)
  assert.equal(s.layer, '对流层')
})

test('ISA: 对流层递减率 6.5K/km', () => {
  const s = isaAtmosphere(1000)
  assert.ok(Math.abs(s.T - (288.15 - 6.5)) < 0.01, `1000m 温度=${s.T} 应=281.65K`)
})

test('ISA: 11km 对流层顶（与标准表对照）', () => {
  const s = isaAtmosphere(11000)
  assert.ok(Math.abs(s.T - 216.65) < 0.01, `T=${s.T} 应=216.65K`)
  assert.ok(Math.abs(s.P / 100 - 226.32) < 0.5, `P=${s.P / 100}hPa 应≈226.3hPa`)
  assert.ok(Math.abs(s.rho - 0.3639) < 0.002, `rho=${s.rho} 应≈0.3639`)
})

test('ISA: 20km 与 32km 分层连续', () => {
  const s20 = isaAtmosphere(20000)
  assert.ok(Math.abs(s20.T - 216.65) < 0.01)
  const s32 = isaAtmosphere(32000)
  assert.ok(Math.abs(s32.T - (216.65 + 12)) < 0.01, `32km T=${s32.T} 应=228.65K`)
})

test('ISA: 气压随高度单调递减', () => {
  let prev = Infinity
  for (let h = 0; h <= 80000; h += 2000) {
    const P = isaAtmosphere(h).P
    assert.ok(P < prev, `h=${h}m 气压应递减`)
    prev = P
  }
})

test('ISA: 温度分层折线（降-恒-升-升-恒-降-降）', () => {
  const temps = [0, 11000, 20000, 32000, 47000, 51000, 71000].map(h => isaAtmosphere(h).T)
  assert.ok(temps[0] > temps[1] && Math.abs(temps[1] - temps[2]) < 1e-9 &&
    temps[2] < temps[3] && temps[3] < temps[4] && Math.abs(temps[4] - temps[5]) < 1e-9 &&
    temps[5] > temps[6], `温度折线异常: ${temps}`)
})

test('气压反推高度：海平面与楼层实验', () => {
  assert.ok(Math.abs(pressureToAltitude(1013.25)) < 0.01, '海平面应≈0m')
  const h = pressureToAltitude(1000)
  assert.ok(h > 100 && h < 130, `1000hPa 反推=${h}m 应在 100-130m（约30层楼）`)
})

// ============ 轨道力学 ============

test('轨道: 第一宇宙速度 ≈7.9km/s（近地）', () => {
  const o = circularOrbit(0.1) // 100m 高度近似地表
  assert.ok(Math.abs(o.vKmS - 7.91) < 0.02, `v=${o.vKmS}`)
})

test('轨道: ISS 420km 周期≈92.8 分钟', () => {
  const o = circularOrbit(420)
  const min = o.periodS / 60
  assert.ok(min > 92 && min < 94, `ISS 周期=${min.toFixed(1)}min`)
  assert.ok(Math.abs(o.vKmS - 7.66) < 0.02, `ISS 速度=${o.vKmS}km/s 应≈7.66`)
})

test('轨道: GEO 35786km 周期=恒星日 23h56m4s', () => {
  const o = circularOrbit(35786)
  const sidereal = 86164 // s
  assert.ok(Math.abs(o.periodS - sidereal) < 60, `GEO 周期=${o.periodS}s 应≈${sidereal}s`)
})

test('轨道: 北斗 MEO 21528km 周期≈12h53m', () => {
  const o = circularOrbit(21528)
  const hrs = o.periodS / 3600
  assert.ok(hrs > 12.5 && hrs < 13, `MEO 周期=${hrs.toFixed(2)}h`)
})

test('轨道: 开普勒第三定律 T²∝a³（LEO vs GEO）', () => {
  const leo = circularOrbit(400)
  const geo = circularOrbit(35786)
  const ratioT2 = Math.pow(geo.periodS / leo.periodS, 2)
  const ratioA3 = Math.pow(geo.rKm / leo.rKm, 3)
  assert.ok(Math.abs(ratioT2 - ratioA3) / ratioA3 < 1e-9, `T²比=${ratioT2}, a³比=${ratioA3}`)
})

// ============ 火箭性能 ============

test('火箭: Δv 齐奥尔科夫斯基方程', () => {
  // 质量比 e（≈2.718）时 Δv 应=ve
  const r = rocketPerformance({
    totalMass: Math.E, propellantMass: Math.E - 1,
    exhaustVelocity: 1000, thrust: 1e6
  })
  assert.ok(Math.abs(r.deltaV - 1000) < 1e-6, `Δv=${r.deltaV} 应=1000`)
})

test('火箭: A8-3 模型火箭（真实参数：总冲 2.5N·s，推进剂≈1g）', () => {
  const r = rocketPerformance({
    totalMass: 0.053, propellantMass: 0.001,
    exhaustVelocity: 2500, thrust: 8
  })
  assert.ok(r.deltaV > 40 && r.deltaV < 60, `Δv=${r.deltaV}`)
  assert.ok(r.burnTime > 0.25 && r.burnTime < 0.4, `燃烧时间=${r.burnTime}s（A8 规格 2.5N·s/8N=0.31s）`)
  assert.ok(r.maxAltitude > 60 && r.maxAltitude < 140, `射高=${r.maxAltitude}m（A8-3 实际约60-100m）`)
})

test('火箭: 非法输入防御', () => {
  const bad = rocketPerformance({ totalMass: 0.01, propellantMass: 0.02, exhaustVelocity: 100, thrust: 10 })
  assert.equal(bad.maxAltitude, 0, '推进剂大于总质量应返回 0')
})

test('火箭: 质量比平方才使 Δv 翻倍（对数关系）', () => {
  // 质量比 2 vs 4：Δv 之比恰为 ln4/ln2 = 2
  // 质量比 2：m0=2, mf=1；质量比 4：m0=4, mf=3
  const a = rocketPerformance({ totalMass: 2, propellantMass: 1, exhaustVelocity: 1000, thrust: 1e6 })
  const b = rocketPerformance({ totalMass: 4, propellantMass: 3, exhaustVelocity: 1000, thrust: 1e6 })
  assert.ok(Math.abs(b.deltaV / a.deltaV - 2) < 1e-9, `Δv比=${b.deltaV / a.deltaV}（教学要点：想Δv翻倍，质量比要平方）`)
})

// ============ 升力模型 ============

test('升力: CL 线性段斜率 0.1/度', () => {
  assert.ok(Math.abs(liftCoefficient(0) - 0.3) < 1e-9)
  assert.ok(Math.abs(liftCoefficient(10) - 1.3) < 1e-9)
})

test('升力: 失速后 CL 衰减', () => {
  const cl15 = liftCoefficient(15)
  const cl18 = liftCoefficient(18)
  assert.ok(cl18 < cl15, `18° CL=${cl18} 应 < 15° CL=${cl15}`)
  assert.ok(cl18 >= 0.2, '衰减下限 0.2')
})

test('升力: v 翻倍 → L 变 4 倍（平方关系）', () => {
  const a = liftForce({ v: 10, S: 2, rho: 1.225, alphaDeg: 5 })
  const b = liftForce({ v: 20, S: 2, rho: 1.225, alphaDeg: 5 })
  assert.ok(Math.abs(b.lift / a.lift - 4) < 1e-9, `比值=${b.lift / a.lift}`)
})

test('升力: 失速判定', () => {
  assert.equal(liftForce({ v: 10, S: 2, rho: 1.225, alphaDeg: 18 }).stalled, true)
  assert.equal(liftForce({ v: 10, S: 2, rho: 1.225, alphaDeg: 5 }).stalled, false)
})

test('升力: 数值合理性（Cessna172 巡航量级）', () => {
  // S≈16.2m², v≈60m/s, α≈0°（巡航小迎角）→ L 应≈10kN 级（W≈10.7kN）
  const r = liftForce({ v: 60, S: 16.2, rho: 1.225, alphaDeg: 0 })
  assert.ok(r.lift > 8000 && r.lift < 14000, `L=${r.lift}N 应在 8-14kN`)
})
