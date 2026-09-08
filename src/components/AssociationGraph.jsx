import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'

const COLORS = { person: '#c1443a', car: '#1e8578', phone: '#c77a1f', building: '#4a5aa8', house: '#6b6b66', bike: '#4a5aa8' }
const mat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0.05 })
const dark = () => new THREE.MeshStandardMaterial({ color: '#2b2b28', roughness: 0.8 })

function person(color, s) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.5 * s, 3 * s, 4, 12), mat(color)); body.position.y = 2.6 * s
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.25 * s, 16, 16), mat('#e9d7c3')); head.position.y = 5.7 * s
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * s, 0.5 * s, 2.2 * s, 10), dark()); legL.position.set(-0.7 * s, 0.9 * s, 0)
  const legR = legL.clone(); legR.position.x = 0.7 * s
  g.add(body, head, legL, legR); return g
}
function car(color, s) {
  const g = new THREE.Group()
  const base = new THREE.Mesh(new THREE.BoxGeometry(7 * s, 2 * s, 3.2 * s), mat(color)); base.position.y = 1.6 * s
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(3.6 * s, 1.6 * s, 2.8 * s), mat('#d9e3e6')); cabin.position.set(-0.4 * s, 3.3 * s, 0)
  g.add(base, cabin)
  ;[[-2.3, 1.8], [2.3, 1.8], [-2.3, -1.8], [2.3, -1.8]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.8 * s, 0.8 * s, 0.6 * s, 14), dark()); w.rotation.x = Math.PI / 2; w.position.set(x * s, 0.8 * s, z * s); g.add(w)
  })
  return g
}
function building(color, s) {
  const g = new THREE.Group()
  const b = new THREE.Mesh(new THREE.BoxGeometry(4 * s, 7 * s, 4 * s), mat(color)); b.position.y = 3.5 * s
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.4 * s, 1.2 * s, 2.4 * s), mat(color)); top.position.y = 7.6 * s
  const win = new THREE.Mesh(new THREE.BoxGeometry(4.1 * s, 0.5 * s, 4.1 * s), mat('#e6eef2'))
  for (let i = 0; i < 4; i++) { const w = win.clone(); w.position.y = (1.3 + i * 1.6) * s; g.add(w) }
  g.add(b, top); return g
}
function house(color, s) {
  const g = new THREE.Group()
  const b = new THREE.Mesh(new THREE.BoxGeometry(5 * s, 3.4 * s, 4.4 * s), mat('#e9e4d8')); b.position.y = 1.7 * s
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.9 * s, 2.6 * s, 4), mat(color)); roof.position.y = 4.7 * s; roof.rotation.y = Math.PI / 4
  const door = new THREE.Mesh(new THREE.BoxGeometry(1 * s, 1.8 * s, 0.2 * s), dark()); door.position.set(0, 0.9 * s, 2.3 * s)
  g.add(b, roof, door); return g
}
function phone(color, s) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2 * s, 4.4 * s, 0.4 * s), dark()); body.position.y = 2.4 * s
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.8 * s, 3.6 * s, 0.1 * s), mat(color)); screen.position.set(0, 2.5 * s, 0.22 * s)
  g.add(body, screen); return g
}
function bike(color, s) {
  const g = new THREE.Group()
  const w1 = new THREE.Mesh(new THREE.TorusGeometry(1.3 * s, 0.35 * s, 10, 24), dark()); w1.position.set(-2 * s, 1.3 * s, 0)
  const w2 = w1.clone(); w2.position.x = 2 * s
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4 * s, 1 * s, 0.8 * s), mat(color)); frame.position.y = 2.2 * s
  const tank = new THREE.Mesh(new THREE.SphereGeometry(0.9 * s, 12, 12), mat(color)); tank.position.set(0.3 * s, 3 * s, 0)
  g.add(w1, w2, frame, tank); return g
}
const BUILDERS = { person, car, building, house, phone, bike }

export default function AssociationGraph({ data, onSelect, selectedId }) {
  const ref = useRef(null)
  const graphRef = useRef(null)
  useEffect(() => {
    const el = ref.current
    const g = ForceGraph3D()(el)
      .backgroundColor('rgba(0,0,0,0)')
      .width(el.clientWidth).height(el.clientHeight)
      .graphData(data)
      .nodeThreeObject((n) => {
        const s = 0.8 + (n.size || 3) * 0.16
        const obj = (BUILDERS[n.kind] || person)(COLORS[n.kind] || '#888', s)
        const label = new SpriteText(n.name); label.color = '#252525'; label.textHeight = 2.6; label.backgroundColor = 'rgba(255,255,255,0.7)'; label.padding = 1.2; label.borderRadius = 2
        label.position.y = (n.kind === 'building' ? 10 : n.kind === 'person' ? 8.5 : 6) * s
        obj.add(label)
        return obj
      })
      .nodeThreeObjectExtend(false)
      .nodeLabel((n) => `<div class="fg-tip"><b>${n.name}</b><br/>${n.role}</div>`)
      .linkColor(() => '#7c7c76').linkOpacity(0.6).linkWidth(0.7)
      .linkDirectionalArrowLength((l) => (l.directed ? 5 : 0)).linkDirectionalArrowRelPos(1).linkDirectionalArrowColor(() => '#7c7c76')
      .linkDirectionalParticles((l) => (l.directed ? 2 : 0)).linkDirectionalParticleWidth(1.4).linkDirectionalParticleColor(() => '#c1443a')
      .linkLabel((l) => `<div class="fg-tip">${l.label || ''}</div>`)
      .onNodeClick((node) => {
        const dist = 90
        const r = 1 + dist / Math.hypot(node.x, node.y, node.z)
        g.cameraPosition({ x: node.x * r, y: node.y * r + 18, z: node.z * r }, node, 1200)
        onSelect && onSelect(node)
      })
      .onBackgroundClick(() => onSelect && onSelect(null))
    g.d3Force('charge').strength(-150)
    g.d3Force('link').distance((l) => (l.directed ? 34 : 42))
    g.scene().add(new THREE.AmbientLight(0xffffff, 1.2))
    const dl = new THREE.DirectionalLight(0xffffff, 1.4); dl.position.set(60, 120, 80); g.scene().add(dl)
    g.cameraPosition({ x: 0, y: 40, z: 200 })
    graphRef.current = g
    const ro = new ResizeObserver(() => g.width(el.clientWidth).height(el.clientHeight))
    ro.observe(el)
    return () => { ro.disconnect(); g._destructor && g._destructor() }
  }, [])
  return <div ref={ref} className="fg-root" />
}
