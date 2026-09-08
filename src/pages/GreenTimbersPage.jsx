import { useEffect, useMemo, useState } from 'react'
import { ScatterplotLayer, PolygonLayer } from '@deck.gl/layers'
import ProjectLayout from './ProjectLayout.jsx'
import MapView from '../components/MapView.jsx'
import { byId } from '../data.js'
import { circlePolygon } from '../data/synth.js'
import Legend from '../components/Legend.jsx'
import HowToRead from '../components/HowToRead.jsx'

const project = byId('green-timbers')
const tabs = [{ id: 'map', title: '800 m buffer map' }]
const COLORS = { 'ASSAULT-COMMON OR TRESPASS': [224, 66, 66], 'ASSAULT-W/WEAPON OR CBH': [122, 60, 160], 'ASSAULT-AGGRAVATED': [40, 90, 200], 'ASSAULT-OTHER PEACE OFFICER': [90, 170, 60] }
const NICE = { 'ASSAULT-COMMON OR TRESPASS': 'Assault – common or trespass', 'ASSAULT-W/WEAPON OR CBH': 'Assault – with weapon or CBH', 'ASSAULT-AGGRAVATED': 'Assault – aggravated', 'ASSAULT-OTHER PEACE OFFICER': 'Assault – other peace officer' }

export default function GreenTimbersPage() {
  const [data, setData] = useState(null)
  useEffect(() => { fetch('/data/greentimbers.json').then((r) => r.json()).then(setData) }, [])
  const center = [-122.8255, 49.1748]
  const layers = useMemo(() => data ? [
    new PolygonLayer({ id: 'buffer', data: [{ polygon: circlePolygon(center, 1800) }], getPolygon: (d) => d.polygon, filled: true, getFillColor: [30, 133, 120, 16], stroked: true, getLineColor: [70, 70, 66, 200], lineWidthMinPixels: 2 }),
    new PolygonLayer({ id: 'park', data: [{ polygon: data.park }], getPolygon: (d) => d.polygon, filled: true, getFillColor: [120, 190, 110, 110], stroked: true, getLineColor: [60, 120, 60], lineWidthMinPixels: 1.5 }),
    new ScatterplotLayer({ id: 'assaults', data: data.points, getPosition: (d) => d.p, getFillColor: (d) => COLORS[d.t] || [120, 120, 120], getRadius: 28, radiusMinPixels: 5, pickable: true, stroked: true, getLineColor: [255, 255, 255], lineWidthMinPixels: 1 }),
  ] : [], [data])
  const total = data ? data.points.length : 0
  return (
    <ProjectLayout project={project} tabs={tabs}>
      {() => (
        <>
          <MapView initialViewState={{ longitude: center[0], latitude: center[1], zoom: 13.3, pitch: 45, bearing: 0 }} layers={layers} getTooltip={({ object }) => object && object.t && { text: `${NICE[object.t] || object.t}\n${object.d}${object.h != null ? ' · ' + object.h + ':00' : ''}` }} />
          <aside className="side-card">
            <h3>Assaults within 800 m of the park</h3>
            <p className="muted">March to July 2020. Each point is one reported offence from the coursework file, coloured by category; the green block is Green Timbers Urban Forest Park and the ring is the buffer.</p>
            {data && (
              <table className="mini"><thead><tr><th></th><th>Assault type</th><th>Count</th></tr></thead>
                <tbody>
                  {Object.entries(data.counts).map(([t, c]) => <tr key={t}><td><i className="sw" style={{ background: `rgb(${(COLORS[t] || [120, 120, 120]).join(',')})` }} /></td><td>{NICE[t] || t}</td><td>{c}</td></tr>)}
                  <tr><td></td><td><strong>Total</strong></td><td><strong>{total}</strong></td></tr>
                </tbody></table>
            )}
            <HowToRead items={[
              [{ color: '#e04242' }, 'Dot', 'One reported assault at its recorded location, March–July 2020. Colour is the assault category (table above). Hover for date and hour.'],
              [{ color: '#78be6e', shape: 'area' }, 'Green block', 'Green Timbers Urban Forest Park (approximated as a rectangle).'],
              [{ color: '#464642', shape: 'ring' }, 'Ring', 'The 800 m buffer around the park — only offences inside it are shown, matching the ArcGIS selection.'],
            ]} />
            <Legend items={[
              { label: 'Dots', color: '#e04242', text: 'one reported assault each, colour = category (table above); hover for date and hour' },
              { label: 'Green block', color: '#78be6e', shape: 'sq', text: 'Green Timbers Urban Forest Park' },
              { label: 'Ring', color: '#46463f', shape: 'ring', text: 'the 800 m buffer around the park — only offences inside it are shown' },
            ]} />
            <p className="tiny">Real point locations from the offence file. The park footprint is approximated as a rectangle, so the count differs slightly from the ArcGIS version (87).</p>
          </aside>
        </>
      )}
    </ProjectLayout>
  )
}
