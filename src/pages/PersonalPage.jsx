import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import ProjectLayout from './ProjectLayout.jsx'
import Gallery from '../components/Gallery.jsx'
import { byId } from '../data.js'
import { photos, layout } from '../data/photos.js'

const project = byId('personal')
const tabs = [{ id: 'photos', title: 'Photography' }, { id: 'macro', title: 'Macro counter' }]

function Photography() {
  const [selected, setSelected] = useState(null)
  const frames = photos.map((p, i) => ({ ...p, ...layout[i] }))
  const active = photos.find((p) => p.id === selected)
  return (
    <>
      <Gallery frames={frames} selected={selected} onSelect={setSelected} />
      <aside className="side-card gallery-card">
        {active ? (
          <><h3>{active.caption}</h3><p className="tiny">Click the frame again, or the floor, to step back.</p></>
        ) : (
          <><h3>Photography</h3><p className="muted">Thirteen frames on a reflective floor — Vancouver's seawall, English Bay, and one evening in Fuzhou. Click a frame to walk up to it.</p><p className="tiny">Built on the react-three-fiber image gallery example.</p></>
        )}
      </aside>
    </>
  )
}

function seeded(n) { let a = n >>> 0; return () => { a += 0x6d2b79f5; let t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
function Macro() {
  const [days, setDays] = useState(7)
  const target = 2100
  const data = useMemo(() => { const r = seeded(days * 7 + 3); return Array.from({ length: days }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (days - 1 - i)); return { day: d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }), kcal: Math.round(target + (r() - 0.5) * 460), protein: Math.round(145 + (r() - 0.5) * 44) } }) }, [days])
  const avg = Math.round(data.reduce((a, d) => a + d.kcal, 0) / data.length)
  const avgP = Math.round(data.reduce((a, d) => a + d.protein, 0) / data.length)
  const on = data.filter((d) => Math.abs(d.kcal - target) <= 150).length
  return (
    <div className="charts">
      <div className="seg small"><button className={days === 7 ? 'active' : ''} onClick={() => setDays(7)}>7 days</button><button className={days === 30 ? 'active' : ''} onClick={() => setDays(30)}>30 days</button></div>
      <div className="stat-row">
        <div className="stat"><span>Avg calories</span><strong>{avg.toLocaleString()}</strong></div>
        <div className="stat"><span>Avg protein</span><strong>{avgP} g</strong></div>
        <div className="stat"><span>Days on target</span><strong>{on} / {days}</strong></div>
      </div>
      <div className="chart-card"><h3>Daily calories vs. target</h3>
        <ResponsiveContainer width="100%" height={280}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" /><XAxis dataKey="day" tick={{ fontSize: 11 }} interval={days > 7 ? 4 : 0} /><YAxis tick={{ fontSize: 11 }} domain={[1600, 2600]} /><Tooltip /><ReferenceLine y={target} stroke="#6b6b66" strokeDasharray="4 4" label={{ value: 'target', fontSize: 11, fill: '#6b6b66' }} /><Line type="monotone" dataKey="kcal" stroke="#c77a1f" strokeWidth={2} dot={{ r: 2.5 }} /></LineChart></ResponsiveContainer>
      </div>
      <p className="tiny">Sample data. This is the shell for the macro tracker — send the spreadsheet (or a CSV export) and the real log, targets and macro split drop in here.</p>
    </div>
  )
}

export default function PersonalPage() {
  return <ProjectLayout project={project} tabs={tabs}>{(tab) => (tab === 'macro' ? <Macro /> : <Photography />)}</ProjectLayout>
}
