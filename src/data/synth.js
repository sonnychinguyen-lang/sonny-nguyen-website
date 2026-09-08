export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const gauss = (x, y, cx, cy, amp, sig) => amp * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * sig * sig))

// Surrey study area (approx), values in "km" space relative to a local origin so sigmas are metric
const ORIGIN = { lon: -122.84, lat: 49.14 }
const toKm = (lon, lat) => [(lon - ORIGIN.lon) * 72.9, (lat - ORIGIN.lat) * 111.2]

export function densityA(lon, lat) {
  const [x, y] = toKm(lon, lat)
  return gauss(x, y, -0.6, 5.6, 1.0, 1.5) + gauss(x, y, 3.0, 5.4, 0.45, 1.2) + gauss(x, y, 3.6, 2.4, 0.35, 1.0)
}
export function densityB(lon, lat) {
  const [x, y] = toKm(lon, lat)
  return gauss(x, y, -0.3, 5.9, 1.25, 1.7) + gauss(x, y, 3.0, 5.4, 0.3, 1.2) + gauss(x, y, 0.4, -1.0, 0.55, 1.3)
}

export function buildGrid() {
  const cells = []
  const dLat = 0.0035, dLon = 0.0052
  for (let lat = 49.03; lat < 49.225; lat += dLat) {
    for (let lon = -122.93; lon < -122.69; lon += dLon) {
      const a = densityA(lon + dLon / 2, lat + dLat / 2)
      const b = densityB(lon + dLon / 2, lat + dLat / 2)
      cells.push({ lon, lat, a, b, change: b - a })
    }
  }
  return cells
}

const lerp = (c1, c2, t) => c1.map((v, i) => Math.round(v + (c2[i] - v) * t))
const TEAL = [30, 133, 120], AMBER = [232, 163, 61], RED = [193, 68, 58], NEUTRAL = [150, 150, 145]
export const densityColor = (v, max) => lerp(TEAL, AMBER, Math.min(1, v / max))
export const changeColor = (v, max) => (v >= 0 ? lerp(NEUTRAL, RED, Math.min(1, v / max)) : lerp(NEUTRAL, TEAL, Math.min(1, -v / max)))

// Green Timbers: park rectangle + 800 m-style buffer, 87 synthetic offences matching the count table
export const GT_PARK = [[-122.834, 49.1755], [-122.813, 49.1755], [-122.813, 49.183], [-122.834, 49.183]]
export const GT_CENTER = [-122.8235, 49.1793]
export function circlePolygon([lon, lat], radiusM, n = 64) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2
    pts.push([lon + (Math.cos(t) * radiusM) / 72900, lat + (Math.sin(t) * radiusM) / 111200])
  }
  return pts
}
export const GT_TYPES = [
  { type: 'Assault – common or trespass', count: 70, color: [224, 66, 66] },
  { type: 'Assault – with weapon or CBH', count: 15, color: [122, 60, 160] },
  { type: 'Assault – aggravated', count: 1, color: [40, 90, 200] },
  { type: 'Assault – other peace officer', count: 1, color: [90, 170, 60] },
]
export function greenTimbersPoints() {
  const r = rng(20200731)
  const R = 1650
  const inPark = (lon, lat) => lon > GT_PARK[0][0] && lon < GT_PARK[1][0] && lat > GT_PARK[0][1] && lat < GT_PARK[2][1]
  const out = []
  GT_TYPES.forEach((t) => {
    let placed = 0
    while (placed < t.count) {
      const ang = r() * Math.PI * 2, rad = Math.sqrt(r()) * R
      const lon = GT_CENTER[0] + (Math.cos(ang) * rad) / 72900
      const lat = GT_CENTER[1] + (Math.sin(ang) * rad) / 111200
      if (inPark(lon, lat)) continue
      out.push({ position: [lon, lat], type: t.type, color: t.color })
      placed++
    }
  })
  return out
}
