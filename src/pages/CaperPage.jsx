import { useEffect, useMemo, useState } from 'react'
import { ScatterplotLayer } from '@deck.gl/layers'
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ProjectLayout from './ProjectLayout.jsx'
import MapView from '../components/MapView.jsx'
import { byId } from '../data.js'
import { asset } from '../asset.js'
import Legend from '../components/Legend.jsx'

const project = byId('caper')
const tabs = [{ id: 'map', title: 'Explorer' }]
const LAYERS = [
  { id: 'burglary', title: 'Residential burglary', color: [74, 90, 168] },
  { id: 'robbery', title: 'Street robbery', color: [193, 68, 58] },
  { id: 'autotheft', title: 'Auto theft (school zones)', color: [30, 133, 120] },
  { id: 'prostitution', title: 'Prostitution offences', color: [122, 60, 160] },
]
const DOWS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const rgb = (c) => `rgb(${c.join(',')})`

function useCaper() {
  const [data, setData] = useState(null)
  useEffect(() => { fetch(asset('data/caper.json')).then((r) => r.json()).then(setData) }, [])
  return data
}

function MapTab({ data }) {
  const [on, setOn] = useState({ burglary: true, robbery: true, autotheft: true, prostitution: false })
  const [hex, setHex] = useState(false)
  const visible = useMemo(() => data ? LAYERS.filter((l) => on[l.id]).flatMap((l) => data[l.id].map((p) => ({ ...p, layer: l.id, color: l.color }))) : [], [data, on])
  const layers = useMemo(() => {
    if (!data) return []
    if (hex) return [new HexagonLayer({ id: 'hex', data: visible, getPosition: (d) => d.p, radius: 320, extruded: true, elevationScale: 12, coverage: 0.85, colorRange: [[233, 239, 217], [185, 207, 146], [126, 162, 91], [199, 122, 31], [193, 68, 58], [120, 30, 30]], pickable: true })]
    return [new ScatterplotLayer({ id: 'pts', data: visible, getPosition: (d) => d.p, getFillColor: (d) => [...d.color, 210], getRadius: 45, radiusMinPixels: 3.5, radiusMaxPixels: 10, pickable: true, stroked: true, getLineColor: [255, 255, 255, 180], lineWidthMinPixels: 0.6 })]
  }, [data, visible, hex])
  const hours = useMemo(() => Array.from({ length: 24 }, (_, h) => ({ h, n: visible.filter((p) => p.h === h).length })), [visible])
  const dows = useMemo(() => DOWS.map((w) => ({ w: w.slice(0, 3), n: visible.filter((p) => p.w === w).length })), [visible])
  return (
    <>
      <MapView initialViewState={{ longitude: -122.83, latitude: 49.13, zoom: 10.7, pitch: 50, bearing: -15 }} layers={layers}
        getTooltip={({ object }) => object && (object.c ? { text: `${object.c}\n${object.d || ''}${object.h != null ? ' · ' + object.h + ':00' : ''}${object.z ? '\n' + object.z : ''}${object.l ? '\n' + object.l : ''}` } : { text: `${object.points?.length ?? 0} offences` })} />
      <aside className="side-card wide-card">
        <h3>Offence layers</h3>
        <div className="toggles">
          {LAYERS.map((l) => (
            <label key={l.id} className={on[l.id] ? 'on' : ''}>
              <input type="checkbox" checked={!!on[l.id]} onChange={(e) => setOn({ ...on, [l.id]: e.target.checked })} />
              <i style={{ background: rgb(l.color) }} /> {l.title} <span className="muted">{data ? data[l.id].length.toLocaleString() : ''}</span>
            </label>
          ))}
        </div>
        <div className="seg"><button className={!hex ? 'active' : ''} onClick={() => setHex(false)}>Points</button><button className={hex ? 'active' : ''} onClick={() => setHex(true)}>Hex density</button></div>
        <div className="two-mini">
          <div><h4>By hour</h4><ResponsiveContainer width="100%" height={110}><BarChart data={hours}><XAxis dataKey="h" tick={{ fontSize: 9 }} interval={5} /><Tooltip /><Bar dataKey="n" fill="#4a5aa8" /></BarChart></ResponsiveContainer></div>
          <div><h4>By weekday</h4><ResponsiveContainer width="100%" height={110}><BarChart data={dows}><XAxis dataKey="w" tick={{ fontSize: 9 }} /><Tooltip /><Bar dataKey="n" fill="#1e8578" /></BarChart></ResponsiveContainer></div>
        </div>
        <Legend items={hex ? [
          { label: 'Hexagons', color: '#c77a1f', shape: 'col', text: 'every offence within 320 m is pooled into one column; height and colour = how many (pale green few, red many)' },
        ] : [
          { label: 'Dots', color: '#4a5aa8', text: 'one offence each, colour = the layer it belongs to; hover for the crime, date, hour, zone and location type' },
          { label: 'Hour and weekday bars', color: '#1e8578', shape: 'sq', text: 'recomputed live for whichever layers are switched on' },
        ]} />
        <p className="tiny">{visible.length.toLocaleString()} offences shown. Training jurisdiction "Caper Crossroads" — Surrey geography under a placeholder name. Hover a point for the file details.</p>
      </aside>
    </>
  )
}

function count(rows, key, top = 8) {
  const m = {}
  rows.forEach((r) => { const v = r[key]; if (v && v !== '<unknown>') m[v] = (m[v] || 0) + 1 })
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, top).map(([k, n]) => ({ k, n }))
}
function MoTab({ data }) {
  const b = data ? data.burglary : []
  const cards = [['Scene', 'sce'], ['Way in', 'way'], ['Access location', 'acc'], ['Occupancy', 'occ'], ['Tools used', 'too'], ['Target area', 'tar']]
  return (
    <div className="charts inflow">
      <h2 className="section-h">Residential burglary — modus operandi</h2>
      <div className="stat-row">
        <div className="stat"><span>Burglaries</span><strong>{b.length.toLocaleString()}</strong></div>
        <div className="stat"><span>With MO record</span><strong>{b.filter((r) => r.cat).length.toLocaleString()}</strong></div>
        <div className="stat"><span>Occupied at the time</span><strong>{b.filter((r) => r.occ === 'occupied').length.toLocaleString()}</strong></div>
        <div className="stat"><span>Forced entry</span><strong>{b.filter((r) => /forced|kicked|pried/i.test(r.acc || '')).length.toLocaleString()}</strong></div>
      </div>
      <div className="chart-grid">
        {cards.map(([title, key]) => {
          const rows = count(b, key)
          return (
            <div className="chart-card" key={key}>
              <h3>{title}</h3>
              <ResponsiveContainer width="100%" height={40 + rows.length * 26}>
                <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <XAxis type="number" hide /><YAxis type="category" dataKey="k" width={150} tick={{ fontSize: 11 }} /><Tooltip />
                  <Bar dataKey="n" radius={[0, 4, 4, 0]}>{rows.map((_, i) => <Cell key={i} fill={i === 0 ? '#4a5aa8' : '#b9c3e6'} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
      <p className="tiny">Modus operandi fields joined to the burglary points by file number — the same join used for the ArcGIS layer. Unknown values excluded.</p>
    </div>
  )
}

export default function CaperPage() {
  const data = useCaper()
  return (
    <ProjectLayout project={project} tabs={tabs} scroll>
      {() => (
        <>
          <section className="map-section"><MapTab data={data} /></section>
          <MoTab data={data} />
        </>
      )}
    </ProjectLayout>
  )
}
