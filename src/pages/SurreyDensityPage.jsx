import { useEffect, useMemo, useState, useRef } from 'react'
import { GridCellLayer, ScatterplotLayer } from '@deck.gl/layers'
import ProjectLayout from './ProjectLayout.jsx'
import MapView from '../components/MapView.jsx'
import { byId } from '../data.js'
import { asset } from '../asset.js'
import { densityColor, changeColor } from '../data/synth.js'
import HowToRead from '../components/HowToRead.jsx'

const project = byId('surrey-density')
const tabs = [{ id: 'map', title: 'Density' }]
const TITLES = { a: 'Density, January to April 2020', b: 'Density, May to August 2020', change: 'Net change: May–Aug minus Jan–Apr' }

export default function SurreyDensityPage() {
  const [data, setData] = useState(null)
  const [mode, setMode] = useState('columns')
  const [tab, setTab] = useState('a')
  const mapRef = useRef(null)
  useEffect(() => { fetch(asset('data/density.json')).then((r) => r.json()).then(setData) }, [])
  const applyMode = (m) => setMode(m)
  return (
    <ProjectLayout project={project} tabs={tabs}>
      {() => {
        const idx = { a: 2, b: 3, change: 4 }[tab]
        const max = data ? (tab === 'change' ? data.maxC : Math.max(data.maxA, data.maxB)) : 1
        const cells = data ? data.cells.filter((c) => (tab === 'change' ? Math.abs(c[4]) > max * 0.04 : c[idx] > max * 0.03)) : []
        const hot = data ? [...cells].sort((x, y) => (tab === 'change' ? Math.abs(y[4]) - Math.abs(x[4]) : y[idx] - x[idx])).slice(0, 40) : []
        const circles = data ? [new ScatterplotLayer({ id: 'hot-' + tab, data: hot, getPosition: (d) => [d[0] + 0.0026, d[1] + 0.00175], getRadius: (d) => 120 + 320 * (tab === 'change' ? Math.abs(d[4]) : d[idx]) / max, radiusMinPixels: 4, pickable: true, stroked: true, lineWidthMinPixels: 1.5, getLineColor: [255, 255, 255, 220], getFillColor: (d) => (tab === 'change' ? [...changeColor(d[4], max), 150] : [...densityColor(d[idx], max), 150]), updateTriggers: { getFillColor: tab, getRadius: tab } })] : []
        const layers = [...circles, ...(mode === 'columns' && data ? [
          new GridCellLayer({ id: 'density-' + tab, data: cells, cellSize: data.cell, extruded: true, elevationScale: 2.2, pickable: true,
            getPosition: (d) => [d[0], d[1]], getElevation: (d) => (tab === 'change' ? Math.abs(d[4]) : d[idx]),
            getFillColor: (d) => (tab === 'change' ? [...changeColor(d[4], max), 215] : [...densityColor(d[idx], max), 215]),
            updateTriggers: { getElevation: tab, getFillColor: tab } }),
        ] : [])]
        return (
          <>
            <MapView initialViewState={{ longitude: -122.83, latitude: 49.13, zoom: 10.8, pitch: 58, bearing: -20 }} layers={layers} buildings={mode === 'city'}
              onLoad={(map) => { mapRef.current = map }} key={mode}
              getTooltip={({ object }) => object && { text: tab === 'change' ? `Change: ${object[4] >= 0 ? '+' : ''}${object[4].toFixed(1)}` : `Density: ${object[idx].toFixed(1)}` }} />
            <aside className="side-card">
              <h3>{TITLES[tab]}</h3>
              <div className="seg">
                {[['a', 'Jan–Apr'], ['b', 'May–Aug'], ['change', 'Net change']].map(([k, l]) => <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>)}
              </div>
              <div className="seg">
                <button className={mode === 'columns' ? 'active' : ''} onClick={() => applyMode('columns')}>Density columns</button>
                <button className={mode === 'city' ? 'active' : ''} onClick={() => applyMode('city')}>3D buildings</button>
              </div>
              {data && <p className="muted">{tab === 'change' ? 'Red columns rose between periods, teal fell; height is the size of the change.' : `Kernel density from ${(tab === 'a' ? data.nA : data.nB).toLocaleString()} reported offences, 549 m bandwidth on a ${data.cell} m grid. Teal low, amber high.`}</p>}
              {mode === 'city' && <p className="muted">Real Surrey: OpenStreetMap buildings extruded by height. Zoom past level 13 for buildings.</p>}
              <HowToRead items={tab === 'change' ? [
                [{ color: '#c1443a', shape: 'column' }, 'Red column', 'Density rose here between Jan–Apr and May–Aug. Taller = bigger rise.'],
                [{ color: '#1e8578', shape: 'column' }, 'Teal column', 'Density fell here. Taller = bigger drop.'],
                [{ color: '#969691', shape: 'column' }, 'Grey / short', 'Little or no change. Cells with almost no change are hidden.'],
                [{ color: '#c1443a', shape: 'ring' }, 'Circles', 'The 40 cells with the largest change — the places to look at first. Circle size = size of the change.'],
              ] : [
                [{ color: '#c77a1f', shape: 'column' }, 'Column', 'One 350 m grid cell. Height and colour are the kernel density: how many reported offences fall within about 549 m, weighted so nearer ones count more.'],
                [{ color: '#1e8578', shape: 'column' }, 'Teal → amber', 'Low density → high density. Amber columns are the hotspots the ArcGIS map showed in red.'],
                [{ color: '#c77a1f', shape: 'ring' }, 'Circles', 'The 40 densest cells, always visible even when columns are hidden. Bigger circle = denser.'],
                [{ color: '#d9d6cf', shape: 'area' }, 'Grey blocks (3D buildings mode)', 'Real Surrey buildings extruded by height for orientation. Zoom in past level 13 to see them.'],
              ]} />
              <p className="tiny">Computed from the coursework offence file for the training jurisdiction "Caper Crossroads" — the geography is Surrey, the name is a placeholder. 37,159 offences, 2020.</p>
            </aside>
          </>
        )
      }}
    </ProjectLayout>
  )
}
