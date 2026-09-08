import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import R3fForceGraph from 'r3f-forcegraph'
import SpriteText from 'three-spritetext'

function Graph({ data, colors, onHover }) {
  const ref = useRef()
  useFrame(() => ref.current && ref.current.tickFrame())
  const nodeObject = useMemo(
    () => (n) => {
      const g = new THREE.Group()
      const r = n.size || 3
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), new THREE.MeshStandardMaterial({ color: colors[n.group] || '#8a8a85', roughness: 0.5 }))
      g.add(mesh)
      const t = new SpriteText(n.name)
      t.color = '#252525'
      t.textHeight = 2.6
      t.fontFace = 'Inter, system-ui, sans-serif'
      t.position.y = r + 2.8
      g.add(t)
      return g
    },
    [colors],
  )
  return (
    <R3fForceGraph
      ref={ref}
      graphData={data}
      nodeThreeObject={nodeObject}
      linkColor={() => '#7c7c76'}
      linkOpacity={0.55}
      linkWidth={0.35}
      linkDirectionalArrowLength={(l) => (l.directed ? 3.5 : 0)}
      linkDirectionalArrowRelPos={1}
      linkDirectionalArrowColor={() => '#7c7c76'}
      onNodeHover={(n) => onHover && onHover(n || null)}
      cooldownTicks={200}
    />
  )
}

export default function ForceGraph3D({ data, colors, onHover, distance = 190 }) {
  return (
    <Canvas camera={{ position: [0, 0, distance], fov: 50 }} style={{ position: 'absolute', inset: 0 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.6} />
      <Graph data={data} colors={colors} onHover={onHover} />
      <OrbitControls enableDamping dampingFactor={0.08} />
    </Canvas>
  )
}
