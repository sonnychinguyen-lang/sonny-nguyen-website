import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine, LineChart, Line } from 'recharts'
import { ColumnLayer } from '@deck.gl/layers'
import ProjectLayout from './ProjectLayout.jsx'
import MapView from '../components/MapView.jsx'
import { byId } from '../data.js'
import { neighbourhood, householdTypes, income, maintainerAge, compstat, dowNotes } from '../data/mosspark.js'

const project = byId('moss-park')
const tabs = [{ id: 'overview', title: 'Review' }]
function useMci() { const [d, setD] = useState(null); useEffect(() => { fetch('/data/mosspark.json').then((r) => r.json()).then(setD) }, []); return d }
const PALETTE = ['#1e8578', '#c77a1f', '#4a5aa8', '#c1443a', '#6b6b66', '#8fb9c2', '#a3c26a', '#7a3ca0', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f']
const TYPE_COLORS = { 'B&E': '#4a5aa8', Robbery: '#c77a1f', Assault: '#c1443a', 'Auto theft': '#1e8578' }

const fmt = (n) => n.toLocaleString()

function Demographics() {
  return (
    <div className="charts inflow">
      <h2 className="section-h">Who lives here</h2>
      <div className="stat-row">
        <div className="stat"><span>Households</span><strong>{fmt(neighbourhood.households)}</strong></div>
        <div className="stat"><span>Population</span><strong>{fmt(neighbourhood.population)}</strong></div>
        <div className="stat"><span>1-person households</span><strong>{fmt(householdTypes[0].count)}</strong></div>
        <div className="stat"><span>Maintainers 25–34</span><strong>{fmt(maintainerAge[1].count)}</strong></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Household income</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={income} dataKey="count" nameKey="band" innerRadius={70} outerRadius={110} paddingAngle={1}>
                {income.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Age of primary household maintainer</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={maintainerAge} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="count" fill="#1e8578" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Household types</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={householdTypes} layout="vertical" margin={{ left: 40, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={fmt} /><YAxis type="category" dataKey="type" width={130} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="count" fill="#c77a1f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function CompStat({ mci }) {
  const series = useMemo(() => mci ? mci.years.map((y) => ({ year: String(y), ...Object.fromEntries(Object.keys(mci.yearly).map((k) => [k, mci.yearly[k][y]])) })) : [], [mci])
  const layers = useMemo(() => {
    const [lon, lat] = neighbourhood.center
    const data = compstat.flatMap((c, i) => [
      { pos: [lon - 0.0045 + i * 0.003, lat + 0.0008], value: c.avg, label: `${c.type} · 5-yr avg`, color: [150, 150, 145] },
      { pos: [lon - 0.0045 + i * 0.003 + 0.0012, lat + 0.0008], value: c.current, label: `${c.type} · 2024`, color: c.z > 2 ? [193, 68, 58] : [30, 133, 120] },
    ])
    return [new ColumnLayer({ id: 'compstat-cols', data, diskResolution: 24, radius: 38, extruded: true, elevationScale: 1.4, pickable: true, getPosition: (d) => d.pos, getElevation: (d) => d.value, getFillColor: (d) => [...d.color, 230] })]
  }, [])
  return (
    <div className="split inflow">
      <div className="split-left">
        <h2 className="section-h">Five-year thresholds</h2>
        <div className="chart-card">
          <h3>Major crime indicators, 2014–2024 (reported year)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={series} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              {['Assault', 'B&E', 'Robbery', 'Auto theft'].map((k) => <Line key={k} type="monotone" dataKey={k} stroke={TYPE_COLORS[k]} strokeWidth={2} dot={{ r: 2.5 }} />)}
            </LineChart>
          </ResponsiveContainer>
          <p className="tiny">Counted from the raw Toronto Police MCI rows for neighbourhood 158 (Moss Park). The threshold table below is the coursework calculation.</p>
        </div>
        <div className="chart-card">
          <h3>CompStat threshold calculations</h3>
          <table className="mini wide">
            <thead><tr><th>Type</th><th>Avg</th><th>St dev</th><th>Normal range</th><th>2024</th><th>% change</th><th>Z score</th></tr></thead>
            <tbody>
              {compstat.map((c) => (
                <tr key={c.type}>
                  <td><i className="sw" style={{ background: TYPE_COLORS[c.type] }} /> {c.type}</td><td>{c.avg.toFixed(2)}</td><td>{c.sd.toFixed(2)}</td><td>{c.range}</td><td>{c.current}</td>
                  <td className={c.change > 0 ? 'up' : 'down'}>{c.change > 0 ? '+' : ''}{c.change}%</td>
                  <td className={Math.abs(c.z) >= 2 ? 'flag' : ''}>{c.z.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tiny">Normal range = mean ± 1 SD of 2019–2023. Auto theft in 2024 sits 2.56 standard deviations above its five-year mean — the only type outside its normal range, and the flag a CompStat review would escalate.</p>
        </div>
      </div>
      <div className="split-right">
        <MapView initialViewState={{ longitude: neighbourhood.center[0], latitude: neighbourhood.center[1], zoom: 14.2, pitch: 60, bearing: -30 }} layers={layers} getTooltip={({ object }) => object && { text: `${object.label}: ${object.value}` }} />
        <div className="map-note"><b>Columns</b> over Moss Park, Toronto — one pair per crime type (left to right: B&amp;E, Robbery, Assault, Auto theft). Grey = the five-year average, teal = 2024. A <b>red</b> 2024 column means that year fell outside the normal range — the CompStat flag. Hover for the number.</div>
      </div>
    </div>
  )
}

function DayOfWeek({ mci }) {
  const [cat, setCat] = useState('Assault')
  const dow = mci ? mci.dows.map((d, i) => ({ day: d, total: mci.dow[cat][i] })) : []
  const hours = mci ? mci.hour[cat].map((n, h) => ({ h, n })) : []
  const avg = dow.length ? dow.reduce((a, d) => a + d.total, 0) / dow.length : 0
  const peak = dow.reduce((m, d) => (d.total > (m?.total ?? -1) ? d : m), null)
  return (
    <div className="charts inflow">
      <h2 className="section-h">When it happens</h2>
      <div className="seg small">{['Assault', 'B&E', 'Robbery', 'Auto theft'].map((k) => <button key={k} className={cat === k ? 'active' : ''} onClick={() => setCat(k)}>{k}</button>)}</div>
      <div className="chart-grid two">
        <div className="chart-card">
          <h3>{cat} by day of week, 2014–2024</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dow} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><ReferenceLine y={Math.round(avg)} stroke="#6b6b66" strokeDasharray="4 4" label={{ value: 'avg', fontSize: 11, fill: '#6b6b66' }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>{dow.map((d) => <Cell key={d.day} fill={peak && d.day === peak.day ? '#c1443a' : '#4a5aa8'} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="tiny">Counted from the raw MCI rows by reported day of week.</p>
        </div>
        <div className="chart-card">
          <h3>{cat} by hour of day</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hours} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e4dd" />
              <XAxis dataKey="h" tick={{ fontSize: 11 }} interval={2} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Bar dataKey="n" fill="#1e8578" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card notes">
          <h3>Context used in the review</h3>
          <ul>{dowNotes.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="muted">The weekend peak lines up with nightlife hours in a neighbourhood with a high share of one-person households and 25–34 year-old maintainers — the demographic where assault victimization and offending both peak.</p>
        </div>
      </div>
    </div>
  )
}

export default function MossParkPage() {
  const mci = useMci()
  return (
    <ProjectLayout project={project} tabs={tabs} scroll>
      {() => (<><Demographics /><CompStat mci={mci} /><DayOfWeek mci={mci} /></>)}
    </ProjectLayout>
  )
}
