import { useEffect, useMemo, useState } from 'react'
import { ColumnLayer } from '@deck.gl/layers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, CartesianGrid } from 'recharts'
import ProjectLayout from './ProjectLayout.jsx'
import MapView from '../components/MapView.jsx'
import { byId } from '../data.js'

const project = byId('dashboard')
const tabs = [{ id: 'overview', title: 'Dashboard' }]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const CENTROIDS = { 'Whalley/City Centre': [-122.848, 49.19], 'Guildford/Fleetwood': [-122.8, 49.168], Newton: [-122.85, 49.128], 'Cloverdale/Port Kells': [-122.72, 49.115], 'South Surrey': [-122.8, 49.05] }
const PALETTE = ['#1e8578', '#c77a1f', '#4a5aa8', '#c1443a', '#7a3ca0']
const money = (n) => '$' + Math.round(n).toLocaleString()

function topBy(rows, idx, lookup, top = 8, valueIdx = null) {
  const m = {}
  rows.forEach((r) => { const k = lookup[r[idx]]; m[k] = (m[k] || 0) + (valueIdx == null ? 1 : r[valueIdx]) })
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, top).map(([k, n]) => ({ k, n }))
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [hood, setHood] = useState('All')
  const [status, setStatus] = useState('All')
  useEffect(() => { fetch('/data/dashboard.json').then((r) => r.json()).then(setData) }, [])
  const L = data?.lookups
  const rows = useMemo(() => {
    if (!data) return []
    return data.rows.filter((r) => (hood === 'All' || L.neighbourhood[r[8]] === hood) && (status === 'All' || L.status[r[10]] === status))
  }, [data, hood, status])

  const kpi = useMemo(() => {
    const n = rows.length || 1
    const dmg = rows.reduce((a, r) => a + r[6], 0)
    const open = rows.filter((r) => L?.status[r[10]] === 'Open').length
    const pri = rows.reduce((a, r) => a + r[11], 0) / n
    return { n: rows.length, dmg, avg: dmg / n, open: open / n, pri }
  }, [rows, L])
  const monthly = useMemo(() => MONTHS.map((m, i) => ({ m, files: rows.filter((r) => r[0] === i + 1).length, damage: rows.filter((r) => r[0] === i + 1).reduce((a, r) => a + r[6], 0) })), [rows])
  const heat = useMemo(() => { const g = Array.from({ length: 7 }, () => Array(24).fill(0)); rows.forEach((r) => g[r[1]][r[2]]++); return g }, [rows])
  const heatMax = Math.max(1, ...heat.flat())
  const byHood = useMemo(() => data ? topBy(rows, 8, L.neighbourhood, 5) : [], [rows, data])
  const byHoodDamage = useMemo(() => data ? topBy(rows, 8, L.neighbourhood, 5, 6) : [], [rows, data])
  const byLoc = useMemo(() => data ? topBy(rows, 4, L.locationType, 8) : [], [rows, data])
  const byItems = useMemo(() => data ? topBy(rows, 5, L.items, 8) : [], [rows, data])
  const byOff = useMemo(() => data ? topBy(rows, 7, L.offence, 6) : [], [rows, data])
  const byPri = useMemo(() => [1, 2, 3, 4, 5].map((p) => ({ p: 'P' + p, n: rows.filter((r) => r[11] === p).length })), [rows])
  const mapLayers = useMemo(() => {
    if (!data) return []
    const all = topBy(data.rows.filter((r) => status === 'All' || L.status[r[10]] === status), 8, L.neighbourhood, 5)
    const cols = all.map((h, i) => ({ pos: CENTROIDS[h.k], value: h.n, name: h.k, active: hood === 'All' || hood === h.k, color: PALETTE[i % PALETTE.length] }))
    return [new ColumnLayer({ id: 'hoods', data: cols, diskResolution: 24, radius: 650, extruded: true, elevationScale: 2.2, pickable: true, getPosition: (d) => d.pos, getElevation: (d) => d.value, getFillColor: (d) => { const c = d.color.match(/\w\w/g).map((x) => parseInt(x, 16)); return [...c, d.active ? 230 : 70] }, updateTriggers: { getFillColor: hood } })]
  }, [data, hood, status])

  if (!data) return <ProjectLayout project={project} tabs={tabs}>{() => <div className="charts"><p className="muted">Loading 7,644 files…</p></div>}</ProjectLayout>
  return (
    <ProjectLayout project={project} tabs={tabs}>
      {() => (
        <div className="split dash">
          <div className="split-left">
            <div className="filters">
              <label>Neighbourhood<select value={hood} onChange={(e) => setHood(e.target.value)}><option>All</option>{L.neighbourhood.map((h) => <option key={h}>{h}</option>)}</select></label>
              <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{L.status.map((s) => <option key={s}>{s}</option>)}</select></label>
            </div>
            <div className="stat-row">
              <div className="stat"><span>Files</span><strong>{kpi.n.toLocaleString()}</strong></div>
              <div className="stat"><span>Total damage</span><strong>{money(kpi.dmg)}</strong></div>
              <div className="stat"><span>Avg damage / file</span><strong>{money(kpi.avg)}</strong></div>
              <div className="stat"><span>Still open</span><strong>{Math.round(kpi.open * 100)}%</strong></div>
              <div className="stat"><span>Avg priority</span><strong>{kpi.pri.toFixed(2)}</strong></div>
            </div>
            <div className="chart-card"><h3>Files and damage by month</h3>
              <ResponsiveContainer width="100%" height={220}><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" /><XAxis dataKey="m" tick={{ fontSize: 11 }} /><YAxis yAxisId="l" tick={{ fontSize: 11 }} /><YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => '$' + Math.round(v / 1000) + 'k'} /><Tooltip formatter={(v, n) => (n === 'damage' ? money(v) : v)} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar yAxisId="l" dataKey="files" fill="#4a5aa8" radius={[3, 3, 0, 0]} /><Bar yAxisId="r" dataKey="damage" fill="#c77a1f" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
            <div className="chart-grid">
              <div className="chart-card"><h3>Files by neighbourhood</h3><ResponsiveContainer width="100%" height={180}><BarChart data={byHood} layout="vertical" margin={{ left: 8, right: 24 }}><XAxis type="number" hide /><YAxis type="category" dataKey="k" width={140} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="n" radius={[0, 4, 4, 0]}>{byHood.map((_, i) => <Cell key={i} fill={PALETTE[i % 5]} />)}</Bar></BarChart></ResponsiveContainer></div>
              <div className="chart-card"><h3>Damage by neighbourhood</h3><ResponsiveContainer width="100%" height={180}><BarChart data={byHoodDamage} layout="vertical" margin={{ left: 8, right: 24 }}><XAxis type="number" hide /><YAxis type="category" dataKey="k" width={140} tick={{ fontSize: 11 }} /><Tooltip formatter={money} /><Bar dataKey="n" fill="#c77a1f" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
              <div className="chart-card"><h3>Top location types</h3><ResponsiveContainer width="100%" height={230}><BarChart data={byLoc} layout="vertical" margin={{ left: 8, right: 24 }}><XAxis type="number" hide /><YAxis type="category" dataKey="k" width={160} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="n" fill="#1e8578" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
              <div className="chart-card"><h3>Top items stolen</h3><ResponsiveContainer width="100%" height={230}><BarChart data={byItems} layout="vertical" margin={{ left: 8, right: 24 }}><XAxis type="number" hide /><YAxis type="category" dataKey="k" width={130} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="n" fill="#4a5aa8" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
              <div className="chart-card"><h3>Offence sub-type</h3><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={byOff} dataKey="n" nameKey="k" innerRadius={45} outerRadius={80} paddingAngle={1}>{byOff.map((_, i) => <Cell key={i} fill={PALETTE[i % 5]} />)}</Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /></PieChart></ResponsiveContainer></div>
              <div className="chart-card"><h3>Priority</h3><ResponsiveContainer width="100%" height={200}><BarChart data={byPri}><XAxis dataKey="p" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="n" fill="#c1443a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
            </div>
            <div className="chart-card"><h3>Reports by weekday and hour</h3>
              <div className="heat">
                <div className="heat-row heat-head"><span /> {Array.from({ length: 24 }, (_, h) => <span key={h}>{h % 3 === 0 ? h : ''}</span>)}</div>
                {heat.map((row, d) => <div className="heat-row" key={d}><span>{DOWS[d]}</span>{row.map((v, h) => <i key={h} title={`${DOWS[d]} ${h}:00 — ${v}`} style={{ background: `rgba(74,90,168,${0.08 + (v / heatMax) * 0.92})` }} />)}</div>)}
              </div>
            </div>
            <p className="tiny">Rebuilt from the assignment workbook's Data sheet (7,644 rows). Training dataset: file numbers and costs are synthetic; neighbourhoods and areas are Surrey's.</p>
          </div>
          <div className="split-right">
            <MapView initialViewState={{ longitude: -122.8, latitude: 49.12, zoom: 10.4, pitch: 55, bearing: -10 }} layers={mapLayers} getTooltip={({ object }) => object && { text: `${object.name}\n${object.value.toLocaleString()} files` }} />
            <div className="map-note"><b>Columns</b> — one per neighbourhood, placed at its approximate centre; height = number of B&amp;E files. Pick a neighbourhood in the filter and the others fade so you can compare. Hover a column for the count.</div>
          </div>
        </div>
      )}
    </ProjectLayout>
  )
}
