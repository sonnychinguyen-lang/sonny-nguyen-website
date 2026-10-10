// Sample data for the student dashboard. Every student here is made up: the
// names, marks and test scores are generated below from a fixed seed. The
// structure (six ability groups, weekly 1-4 performance marks, a monthly test
// out of 10) mirrors the tracker I run for an after-school English program.
export const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec']
export const LEVELS = [
  { n: 1, label: 'Beginning', color: '#cfe4dc' },
  { n: 2, label: 'Developing', color: '#8fc4b5' },
  { n: 3, label: 'Meeting', color: '#3f9685' },
  { n: 4, label: 'Exceeding', color: '#17594f' },
]
export const GROUPS = [
  { id: 'Group K', book: 'Early literacy', size: 14, grades: ['K'] },
  { id: 'Group 1', book: 'Phonics A / B', size: 11, grades: ['K', '1', '1', '2'] },
  { id: 'Group 2', book: 'Book 1 / Book 2', size: 8, grades: ['1', '2', '2', '3'] },
  { id: 'Group 3', book: 'Book 3', size: 9, grades: ['2', '3', '3', '4'] },
  { id: 'Group 4', book: 'Book 4', size: 9, grades: ['4', '4', '5'] },
  { id: 'Group 5', book: 'Book 5 / project course', size: 9, grades: ['3', '5', '6', '6', '7'] },
]
const FIRST = ['Amara', 'Bodhi', 'Callum', 'Daphne', 'Elio', 'Fiona', 'Gideon', 'Hazel', 'Idris', 'Juno', 'Kai', 'Leila', 'Mateo', 'Nadia', 'Orion', 'Priya', 'Quinn', 'Rafael', 'Soren', 'Talia', 'Uma', 'Viktor', 'Wren', 'Xavier', 'Yara', 'Zane', 'Anika', 'Beckett', 'Celeste', 'Dario', 'Esme', 'Felix', 'Greta', 'Hugo', 'Ines', 'Jasper', 'Kira', 'Lars', 'Maya', 'Nico', 'Odette', 'Pablo', 'Rhea', 'Silas', 'Tessa', 'Ulric', 'Vera', 'Wes', 'Ximena', 'Yusuf', 'Zara', 'Arlo', 'Bianca', 'Cyrus', 'Delia', 'Emil', 'Flora', 'Gus', 'Hattie', 'Ivo']
const LAST = 'BCDFGHJKLMNPRSTVWY'

function seeded(n) { let a = n >>> 0; return () => { a += 0x6d2b79f5; let t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const half = (v) => Math.round(v * 2) / 2

function build() {
  const r = seeded(20260914)
  const out = []
  let k = 0
  const lift = [-0.35, 0.15, 0.45, -0.15, -0.45, 0.35]
  GROUPS.forEach((g, gi) => {
    const wobble = Array.from({ length: 16 }, () => (r() - 0.5) * 0.7)
    for (let i = 0; i < g.size; i++, k++) {
      const base = clamp(1.8 + r() * 1.7 + lift[gi], 1.2, 3.8)
      const growth = (r() - 0.2) * 1.1
      const weeks = Array.from({ length: 16 }, (_, w) => (r() < 0.07 ? null : half(clamp(base + (growth * w) / 15 + wobble[w] + (r() - 0.5) * 0.9, 1, 4))))
      const tests = MONTHS.map((_, m) => half(clamp(4.2 + (base + (growth * (m * 4 + 3)) / 15) * 1.35 + (r() - 0.5) * 1.6, 3, 10)))
      out.push({ id: 's' + k, name: `${FIRST[k % FIRST.length]} ${LAST[Math.floor(r() * LAST.length)]}.`, grade: g.grades[Math.floor(r() * g.grades.length)], group: g.id, weeks, tests })
    }
  })
  return out
}
export const students = build()

export const mean = (xs) => { const v = xs.filter((x) => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null }
export const levelOf = (v) => (v == null ? null : clamp(Math.round(v), 1, 4))
// month: -1 for the whole term, otherwise 0-3
export const weeksIn = (s, month) => (month < 0 ? s.weeks : s.weeks.slice(month * 4, month * 4 + 4))
export const testPct = (s, month) => (month < 0 ? mean(s.tests) : s.tests[month]) * 10
export function statusOf(avg, pct) {
  if (avg == null) return { key: 'none', label: 'No marks yet', mark: '–' }
  if (avg < 2.3) return { key: 'support', label: 'Needs support', mark: '▲' }
  if (avg >= 3.5 && pct >= 85) return { key: 'up', label: 'Ready to move up', mark: '↑' }
  return { key: 'track', label: 'On track', mark: '●' }
}
