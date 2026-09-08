import { useCallback, useEffect, useRef, useState } from 'react'
import Map, { useControl, NavigationControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import 'maplibre-gl/dist/maplibre-gl.css'

export const STYLE = 'https://tiles.openfreemap.org/styles/liberty'
const TERRAIN = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
// Dark raster basemap (default): colored points and columns read clearly on it. Vector style is used only when 3D buildings are requested.
const carto = (flavor) => ({
  version: 8,
  sources: { carto: { type: 'raster', tiles: ['a', 'b', 'c'].map((h) => `https://${h}.basemaps.cartocdn.com/${flavor}/{z}/{x}/{y}@2x.png`), tileSize: 256, attribution: '© OpenStreetMap contributors © CARTO' } },
  layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
})
export const DARK = carto('dark_all')
const FALLBACK = carto('light_all')

function DeckGLOverlay(props) {
  // Non-interleaved: deck.gl draws on its own canvas above the map. Works on every GPU/driver.
  const overlay = useControl(() => new MapboxOverlay({ interleaved: false }))
  overlay.setProps(props)
  return null
}

export function setBuildings(map, on) {
  try {
    if (!map || !map.getStyle()) return
    const extrusions = map.getStyle().layers.filter((l) => l.type === 'fill-extrusion')
    if (!extrusions.length && on && map.getSource('openmaptiles')) {
      map.addLayer({ id: 'buildings-3d', source: 'openmaptiles', 'source-layer': 'building', type: 'fill-extrusion', minzoom: 13,
        paint: { 'fill-extrusion-color': '#d9d6cf', 'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 8], 'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0], 'fill-extrusion-opacity': 0.85 } })
      return
    }
    extrusions.forEach((l) => map.setLayoutProperty(l.id, 'visibility', on ? 'visible' : 'none'))
  } catch (e) { /* style not ready — ignore */ }
}

export function setTerrain(map, on) {
  try {
    if (!map || !map.getStyle()) return
    if (on) {
      if (!map.getSource('terrain-dem')) map.addSource('terrain-dem', { type: 'raster-dem', tiles: [TERRAIN], encoding: 'terrarium', tileSize: 256, maxzoom: 15 })
      map.setTerrain({ source: 'terrain-dem', exaggeration: 1.3 })
    } else map.setTerrain(null)
  } catch (e) { /* ignore */ }
}

export default function MapView({ initialViewState, layers = [], getTooltip, onLoad, children, buildings = false, terrain = false }) {
  const [style, setStyle] = useState(buildings ? STYLE : DARK)
  const loaded = useRef(false)
  const fellBack = useRef(false)
  const fallBack = useCallback(() => { if (!fellBack.current) { fellBack.current = true; setStyle(FALLBACK) } }, [])
  useEffect(() => { const t = setTimeout(() => { if (!loaded.current) fallBack() }, 9000); return () => clearTimeout(t) }, [])
  useEffect(() => { setStyle(buildings ? STYLE : DARK) }, [buildings])
  const handleLoad = useCallback((e) => {
    loaded.current = true
    const map = e.target
    if (terrain) setTerrain(map, true)
    if (buildings) setBuildings(map, true)
    onLoad && onLoad(map)
  }, [buildings])
  const handleError = useCallback((e) => {
    const msg = String(e?.error?.message || e?.error || '')
    if (!loaded.current && /style|fetch|AJAX|network|Failed/i.test(msg)) fallBack()
  }, [])
  return (
    <Map initialViewState={initialViewState} mapStyle={style} style={{ position: 'absolute', inset: 0 }} maxPitch={85} onLoad={handleLoad} onError={handleError} attributionControl={{ compact: true }}>
      <NavigationControl position="top-right" visualizePitch />
      <DeckGLOverlay layers={layers} getTooltip={getTooltip} />
      {children}
    </Map>
  )
}
