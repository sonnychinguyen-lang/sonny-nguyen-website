import { useMemo, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Cell } from 'recharts'
import ProjectLayout from './ProjectLayout.jsx'
import { byId } from '../data.js'
import { students, GROUPS, MONTHS, LEVELS, mean, levelOf, weeksIn, testPct, statusOf } from '../data/classroom.js'

const project = byId('classroom')
const tabs = [{ id: 'overview', title: 'Dashboard' }]
const INK = '#252525', SOFT = '#6b6b66', GRID = '#e2e5d8', TEAL = '#1e8578'
const weekLabel = (w) => `${MONTHS[Math.floor(w / 4)]} wk ${(w % 4) + 1}`
const f1 = (v) => (v == null ? '–' : v.toFixed(1))
const tip = { contentStyle: { borderRadius: 10, border: '1px solid rgba(37,37,37,0.12)', fontSize: 12, boxShadow: '0 6px 20px rgba(37,37,37,0.08)' }, labelStyle: { fontWeight: 600, color: INK } }

function Spark({ values }) {
  const pts = values.map((v, i) => (v == null ? null : [4 + (i * 88) / 15, 22 - ((v - 1) / 3) * 18])).filter(Boolean)
  if (!pts.length) return null
  const last = pts[pts.length - 1]
  return (
    <svg viewBox="0 0 96 26" width="96" height="26" aria-hidden="true">
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={TEAL} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={TEAL} stroke="#fbfcf8" strokeWidth="1.5" />
    </svg>
  )
}

export default function ClassroomPage() {
  const [group, setGroup] = useState('All')
  const [month, setMonth] = useState(-1)
  const [sort, setSort] = useState('group')

  const pool = useMemo(() => students.filter((s) => group === 'All' || s.group === group), [group])
  const rows = useMemo(() => pool.map((s) => { const avg = mean(weeksIn(s, month)); const pct = testPct(s, month); return { ...s, avg, pct, status: statusOf(avg, pct) } }), [pool, month])

  const kpi = useMemo(() => {
    const avgs = rows.map((r) => r.avg).filter((v) => v != null)
    return { n: rows.length, avg: mean(avgs), pct: mean(rows.map((r) => r.pct)), meeting: avgs.length ? avgs.filter((v) => v >= 2.5).length / avgs.length : 0, support: rows.filter((r) => r.status.key === 'support').length }
  }, [rows])

  const trend = useMemo(() => Array.from({ length: 16 }, (_, w) => ({ w: weekLabel(w), avg: +(mean(pool.map((s) => s.weeks[w])) ?? 0).toFixed(2) })), [pool])

  const byGroup = useMemo(() => GROUPS.map((g) => {
    const rs = students.filter((s) => s.group === g.id).map((s) => ({ avg: mean(weeksIn(s, month)), pct: testPct(s, month) }))
    const row = { g: g.id.replace('Group ', 'G'), full: g.id, test: Math.round(mean(rs.map((r) => r.pct))), active: group === 'All' || group === g.id }
    LEVELS.forEach((l) => { row[l.label] = rs.filter((r) => levelOf(r.avg) === l.n).length })
    return row
  }), [month, group])

  const heatRows = useMemo(() => (group === 'All'
    ? GROUPS.map((g) => ({ key: g.id, label: g.id, cells: Array.from({ length: 16 }, (_, w) => mean(students.filter((s) => s.group === g.id).map((s) => s.weeks[w]))) }))
    : pool.map((s) => ({ key: s.id, label: s.name, cells: s.weeks }))), [group, pool])

  const sorted = useMemo(() => {
    const r = [...rows]
    if (sort === 'avg') r.sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))
    else if (sort === 'test') r.sort((a, b) => b.pct - a.pct)
    else if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name))
    return r
  }, [rows, sort])

  const period = month < 0 ? 'Fall term' : MONTHS[month]
  return (
    <ProjectLayout project={project} tabs={tabs} scroll>
      {() => (
        <div className="cls">
          <div className="cls-note"><b>Sample data.</b> These students are made up. The layout is the tracker I built for an after-school English program: six ability groups, a weekly 1–4 performance mark and a monthly test.</div>

          <div className="cls-filters">
            <div className="seg small cls-seg" role="group" aria-label="Period">
              <button className={month < 0 ? 'active' : ''} onClick={() => setMonth(-1)}>Term</button>
              {MONTHS.map((m, i) => <button key={m} className={month === i ? 'active' : ''} onClick={() => setMonth(i)}>{m}</button>)}
            </div>
            <div className="cls-chips" role="group" aria-label="Group">
              {['All', ...GROUPS.map((g) => g.id)].map((g) => <button key={g} className={'cls-chip' + (group === g ? ' active' : '')} onClick={() => setGroup(g)}>{g}</button>)}
            </div>
          </div>

          <div className="cls-kpis">
            <div className="cls-kpi lead"><span>Average performance · {period}</span><strong>{f1(kpi.avg)}<small> / 4</small></strong><div className="cls-meter" aria-hidden="true"><i style={{ width: `${(((kpi.avg ?? 1) - 1) / 3) * 100}%` }} /></div></div>
            <div className="cls-kpi"><span>Students</span><strong>{kpi.n}</strong><em>{group === 'All' ? `${GROUPS.length} groups` : GROUPS.find((g) => g.id === group).book}</em></div>
            <div className="cls-kpi"><span>Average test</span><strong>{Math.round(kpi.pct)}%</strong><em>monthly test out of 10</em></div>
            <div className="cls-kpi"><span>Meeting or above</span><strong>{Math.round(kpi.meeting * 100)}%</strong><em>average of 2.5 or higher</em></div>
            <div className="cls-kpi"><span>Need support</span><strong>{kpi.support}</strong><em>average below 2.3</em></div>
          </div>

          <div className="cls-grid">
            <div className="chart-card cls-wide"><h3>Average weekly performance{group === 'All' ? '' : ` · ${group}`}</h3>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={trend} margin={{ top: 8, right: 16, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  {month >= 0 && <ReferenceArea x1={weekLabel(month * 4)} x2={weekLabel(month * 4 + 3)} fill={TEAL} fillOpacity={0.08} />}
                  <XAxis dataKey="w" tick={{ fontSize: 11, fill: SOFT }} interval={3} tickFormatter={(v) => v.split(' ')[0]} axisLine={{ stroke: GRID }} tickLine={false} />
                  <YAxis domain={[1, 4]} ticks={[1, 2, 3, 4]} tick={{ fontSize: 11, fill: SOFT }} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} formatter={(v) => [v.toFixed(2), 'Average mark']} />
                  <Line type="monotone" dataKey="avg" stroke={TEAL} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: '#fbfcf8', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card"><h3>Performance levels by group · {period}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={byGroup} layout="vertical" margin={{ top: 0, right: 12, left: -24, bottom: 0 }} barCategoryGap={7}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="g" tick={{ fontSize: 11, fill: SOFT }} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} cursor={{ fill: 'rgba(37,37,37,0.04)' }} labelFormatter={(_, p) => p?.[0]?.payload.full} formatter={(v, n) => [`${v} students`, n]} />
                  {LEVELS.map((l) => <Bar key={l.n} dataKey={l.label} stackId="a" fill={l.color} stroke="#fbfcf8" strokeWidth={2}>{byGroup.map((d) => <Cell key={d.g} fillOpacity={d.active ? 1 : 0.3} />)}</Bar>)}
                </BarChart>
              </ResponsiveContainer>
              <div className="cls-legend">{LEVELS.map((l) => <span key={l.n}><i style={{ background: l.color }} />{l.n} {l.label}</span>)}</div>
            </div>

            <div className="chart-card"><h3>Average test score by group · {period}</h3>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={byGroup} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="g" tick={{ fontSize: 11, fill: SOFT }} axisLine={{ stroke: GRID }} tickLine={false} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => v + '%'} tick={{ fontSize: 11, fill: SOFT }} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} cursor={{ fill: 'rgba(37,37,37,0.04)' }} labelFormatter={(_, p) => p?.[0]?.payload.full} formatter={(v) => [v + '%', 'Average test']} />
                  <Bar dataKey="test" fill={TEAL} radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 11, fill: INK, formatter: (v) => v + '%' }}>{byGroup.map((d) => <Cell key={d.g} fillOpacity={d.active ? 1 : 0.3} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card cls-wide"><h3>Week by week · {group === 'All' ? 'group averages' : group}</h3>
              <div className="cls-heat-scroll"><div className="cls-heat">
                <div className="cls-heat-row head"><span />{MONTHS.map((m) => <b key={m}>{m}</b>)}</div>
                {heatRows.map((r) => (
                  <div className="cls-heat-row" key={r.key}><span>{r.label}</span>
                    {r.cells.map((v, w) => { const l = levelOf(v); return <i key={w} className={w % 4 === 0 ? 'm' : ''} title={`${r.label} · ${weekLabel(w)} · ${v == null ? 'away' : f1(v)}`} style={l ? { background: LEVELS[l - 1].color } : undefined} /> })}
                  </div>
                ))}
              </div></div>
              <div className="cls-legend">{LEVELS.map((l) => <span key={l.n}><i style={{ background: l.color }} />{l.n} {l.label}</span>)}<span><i className="away" />Away</span></div>
            </div>
          </div>

          <div className="chart-card cls-table-card">
            <div className="cls-table-head"><h3>Students · {period}</h3>
              <label>Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="group">Group</option><option value="name">Name</option><option value="avg">Average mark</option><option value="test">Test score</option></select></label>
            </div>
            <div className="cls-table-scroll"><table className="cls-table">
              <thead><tr><th>Student</th><th>Grade</th><th>Group</th><th>Term trend</th><th className="r">Average</th><th className="r">Test</th><th>Status</th></tr></thead>
              <tbody>{sorted.map((s) => (
                <tr key={s.id}><td className="n">{s.name}</td><td>{s.grade}</td><td>{s.group}</td><td><Spark values={s.weeks} /></td><td className="r num">{f1(s.avg)}</td><td className="r num">{Math.round(s.pct)}%</td><td><span className={'cls-pill ' + s.status.key}><i aria-hidden="true">{s.status.mark}</i>{s.status.label}</span></td></tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>
      )}
    </ProjectLayout>
  )
}
