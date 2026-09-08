import { useEffect, useMemo, useState } from 'react'
import { ScatterplotLayer, ArcLayer, TextLayer } from '@deck.gl/layers'
import ProjectLayout from './ProjectLayout.jsx'
import MapView from '../components/MapView.jsx'
import ForceGraph3D from '../components/ForceGraph3D.jsx'
import AssociationGraph from '../components/AssociationGraph.jsx'
import PortalsTimeline from '../components/PortalsTimeline.jsx'
import Legend from '../components/Legend.jsx'
import { byId } from '../data.js'
import { incidents, places, association, phoneNetwork } from '../data/eholdup.js'
import { timeline, TYPE_COLORS } from '../data/timeline.js'

const project = byId('eholdup')
const tabs = [
  { id: 'map', title: 'Robbery map' }, { id: 'network', title: 'People chart' }, { id: 'phones', title: 'Phone network' },
  { id: 'timeline', title: 'Timeline' }, { id: 'report', title: 'Report' },
]
const GROUP_COLORS = { hub: '#c1443a', common: '#c77a1f', contact: '#8fb9c2' }
const KIND_LABELS = { person: 'Person', car: 'Vehicle', building: 'Organization', house: 'Place', phone: 'Device', bike: 'Organization' }

function MapTab() {
  const layers = useMemo(() => {
    const residence = places[0]
    return [
      new ArcLayer({ id: 'arcs', data: incidents.filter((d) => d.kind === 'Robbery'), getSourcePosition: () => residence.position, getTargetPosition: (d) => d.position, getSourceColor: [107, 107, 102, 120], getTargetColor: [193, 68, 58, 200], getWidth: 2, getHeight: 0.6 }),
      new ScatterplotLayer({ id: 'places', data: places, getPosition: (d) => d.position, getFillColor: (d) => (d.kind === 'residence' ? [199, 122, 31] : [74, 90, 168]), getRadius: 90, radiusMinPixels: 7, pickable: true, stroked: true, getLineColor: [255, 255, 255], lineWidthMinPixels: 2 }),
      new ScatterplotLayer({ id: 'incidents', data: incidents, getPosition: (d) => d.position, getFillColor: (d) => (d.kind === 'Robbery' ? [193, 68, 58] : [122, 60, 160]), getRadius: 110, radiusMinPixels: 8, pickable: true, stroked: true, getLineColor: [255, 255, 255], lineWidthMinPixels: 2 }),
      new TextLayer({ id: 'labels', data: incidents.map((d, i) => ({ ...d, n: i + 1 })), getPosition: (d) => d.position, getText: (d) => (d.kind === 'Robbery' ? 'R' + d.n : 'SC'), getSize: 13, getColor: [37, 37, 37], getPixelOffset: [0, -18], fontFamily: 'Inter, sans-serif', fontWeight: 600, background: true, getBackgroundColor: [255, 255, 255, 210], backgroundPadding: [4, 2] }),
    ]
  }, [])
  return (
    <>
      <MapView initialViewState={{ longitude: -122.885, latitude: 49.16, zoom: 11.6, pitch: 55, bearing: -15 }} layers={layers}
        getTooltip={({ object }) => object && { text: object.address ? `${object.kind} · ${object.date} ${object.time}\n${object.address}` : `${object.name}\n${object.note}` }} />
      <aside className="side-card">
        <h3>Scott Road corridor series</h3>
        <p className="muted">Five of six robberies within ~4.5 km of the suspect residence along one corridor; one address hit twice. The outlier is 15 km south and after dark. Arcs show distance from the residence.</p>
        <table className="mini"><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Address</th><th>Zone</th></tr></thead>
          <tbody>{incidents.map((d, i) => <tr key={d.file}><td>{d.kind === 'Robbery' ? 'R' + (i + 1) : 'SC'}</td><td>{d.date}</td><td>{d.time}</td><td>{d.address}</td><td>{d.zone}</td></tr>)}</tbody></table>
        <Legend items={[
          { label: 'Red dots R1–R6', color: '#c1443a', text: 'the six robberies, numbered in date order' },
          { label: 'Purple dot SC', color: '#7a3ca0', text: 'the suspicious circumstance — the only after-dark event' },
          { label: 'Amber dot', color: '#c77a1f', text: 'the suspect residence (firearm pick-up)' },
          { label: 'Blue dots', color: '#4a5aa8', text: 'places from the file: the reconnaissance stop and the suspected fence' },
          { label: 'Arcs', color: '#8a8a85', shape: 'arc', text: 'straight-line distance from the residence to each robbery; the curve is just for visibility' },
        ]} />
        <p className="tiny">Fictional scenario. Points are approximate geocodes of the scenario addresses. Map: OpenFreeMap · OpenStreetMap contributors.</p>
      </aside>
    </>
  )
}

function NetworkTab() {
  const [node, setNode] = useState(null)
  const events = node ? timeline.filter((t) => t.who.includes(node.id)) : []
  return (
    <>
      <AssociationGraph data={association} onSelect={setNode} />
      <aside className="side-card people-card">
        {!node ? (
          <>
            <h3>People chart</h3>
            <p className="muted">Everyone and everything in the E-HOLDUP association chart as 3D figures — people, vehicles, phones, businesses, a residence, a motorcycle gang — linked the way the file links them. Drag to orbit, scroll to zoom, hover a line for the relationship. <b>Click a figure</b> to fly to it and read what the file says.</p>
            <div className="legend">
              <span><i style={{ background: '#c1443a' }} /> People</span><span><i style={{ background: '#1e8578' }} /> Vehicles</span>
              <span><i style={{ background: '#c77a1f' }} /> Devices</span><span><i style={{ background: '#4a5aa8' }} /> Organizations</span><span><i style={{ background: '#6b6b66' }} /> Places</span>
            </div>
            <Legend title="What the lines mean" items={[
              { label: 'Plain line', color: '#7c7c76', shape: 'line', text: 'an association (associate of, personal vehicle, shared device)' },
              { label: 'Arrow with moving red dots', color: '#c1443a', shape: 'line', text: 'a directional link — recruited, drove getaway, obtained firearm — the dots run from who did it to whom' },
              { label: 'Figure size', color: '#c1443a', text: 'bigger = more central to the file' },
            ]} />
            <p className="tiny">Fictional scenario · built in i2 Analyst's Notebook, rebuilt with vasturiano/3d-force-graph.</p>
          </>
        ) : (
          <>
            <button className="linkish" onClick={() => setNode(null)}>← All figures</button>
            <span className="page-index">{KIND_LABELS[node.kind]}</span>
            <h3>{node.name}</h3>
            <p className="role-line">{node.role}</p>
            <p>{node.profile}</p>
            {events.length > 0 && (
              <>
                <h4>In the timeline</h4>
                <ul className="mini-timeline">
                  {events.map((e) => <li key={e.id}><i style={{ background: TYPE_COLORS[e.type] }} /><span className="mono">{e.date}{e.time ? ' ' + e.time : ''}</span> {e.title}</li>)}
                </ul>
              </>
            )}
          </>
        )}
      </aside>
    </>
  )
}

function PhonesTab() {
  const [node, setNode] = useState(null)
  return (
    <>
      <ForceGraph3D data={phoneNetwork} colors={GROUP_COLORS} onHover={setNode} distance={190} />
      <aside className="side-card">
        <h3>Call-record network</h3>
        <p className="muted">Two handsets, {phoneNetwork.nodes.length - 2} contacts. The VARGAS handset is the central node — highest volume, most unique contacts — consistent with a recruiter/coordinator role. Amber numbers are common to both handsets, or registered to HAWG's company.</p>
        <div className="legend"><span><i style={{ background: GROUP_COLORS.hub }} /> Handsets analyzed</span><span><i style={{ background: GROUP_COLORS.common }} /> Common / linked</span><span><i style={{ background: GROUP_COLORS.contact }} /> Unique contacts</span></div>
        <div className="hover-box">{node ? <strong>{node.name}</strong> : <span className="muted">Hover a node.</span>}</div>
        <p className="tiny">Fictional scenario numbers, as they appear in the training file.</p>
      </aside>
    </>
  )
}

function TimelineTab() {
  const items = timeline.map((t, i) => ({ ...t, img: `/portals/${t.id}.jpg`, color: TYPE_COLORS[t.type], bg: ['#e4cdac', '#d1d1ca', '#cfd9c2', '#e2d4d8', '#c9d8e3'][i % 5], short: t.title.split(' — ')[0].replace('Surveillance', 'Surv.').replace('Intelligence report', 'Intel') }))
  const [focus, setFocus] = useState(timeline[0].id)
  const [entered, setEntered] = useState(false)
  const idx = timeline.findIndex((t) => t.id === focus)
  const active = timeline[idx]
  const step = (d) => { setEntered(false); setFocus(timeline[Math.max(0, Math.min(timeline.length - 1, idx + d))].id) }
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'Escape') setEntered(false); if (e.key === 'Enter') setEntered(true) }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [idx])
  return (
    <>
      <PortalsTimeline items={items} focus={focus} entered={entered} onEnter={(id) => { setFocus(id); setEntered(true) }} />
      <aside className="side-card portal-card">
        <span className="page-index" style={{ color: TYPE_COLORS[active.type] }}>{active.type} · {idx + 1} / {timeline.length}</span>
        <h3>{active.title}</h3>
        <p className="mono muted">{active.date}{active.time ? ' · ' + active.time : ''}{active.file ? ' · File ' + active.file : ''}</p>
        {!entered && <p className="muted">Eighteen portals in date order, left to right. Drag to look around, scroll to move along the row. <b>Double-click a portal</b> (or press Enter) to step inside; inside, the event sits in a glass panel over an illustrated scene.</p>}
        {entered && <p>{active.summary}</p>}
        <div className="portal-btns">
          <button className="glass round" onClick={() => step(-1)} disabled={idx === 0} aria-label="Previous">‹</button>
          <button className="glass pill-btn" onClick={() => setEntered(!entered)}>{entered ? 'Leave portal' : 'Enter portal'}</button>
          <button className="glass round" onClick={() => step(1)} disabled={idx === timeline.length - 1} aria-label="Next">›</button>
        </div>
        <p className="tiny">Built on the react-three-fiber enter-portals example. Backdrops are illustrated placeholders — drop your own renders into public/portals/&lt;event-id&gt;.jpg to replace them.</p>
      </aside>
    </>
  )
}

function ImageTab({ img, title, caption, pdf }) {
  const [big, setBig] = useState(false)
  return (
    <div className="image-stage">
      <figure onClick={() => setBig(true)}>
        <img src={`/projects/${img}`} alt={title} />
        <figcaption>{caption}{pdf && <> · <a href={`/projects/${pdf}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Open the PDF ↗</a></>}</figcaption>
      </figure>
      {big && <div className="lightbox" onClick={() => setBig(false)}><img src={`/projects/${img}`} alt={title} /></div>}
    </div>
  )
}

export default function EholdupPage() {
  return (
    <ProjectLayout project={project} tabs={tabs}>
      {(tab) => {
        if (tab === 'map') return <MapTab />
        if (tab === 'network') return <NetworkTab />
        if (tab === 'phones') return <PhonesTab />
        if (tab === 'timeline') return <TimelineTab />
        return <ImageTab img="eholdup-report.png" title="Intelligence report" caption="11-page intelligence product: summary, suspect profiles, MO, incident analysis, intelligence assessment, gaps, recommendations." pdf="eholdup-report.pdf" />
      }}
    </ProjectLayout>
  )
}
