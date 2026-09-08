// After the pmndrs "enter portals" example: MeshPortalMaterial frames, CameraControls rig, click to enter.
import * as THREE from 'three'
import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Text, Image, Environment } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

class Quiet extends Component { constructor(p) { super(p); this.state = { err: false } } static getDerivedStateFromError() { return { err: true } } render() { return this.state.err ? null : this.props.children } }

export default function TimelinePortals({ items, active, onEnter }) {
  const n = items.length
  const R = 7.5
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }} style={{ position: 'absolute', inset: 0 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#eef2e4']} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[4, 8, 6]} intensity={1.4} />
      <Quiet><Suspense fallback={null}><Environment preset="city" /></Suspense></Quiet>
      {items.map((it, i) => {
        const t = -Math.PI * 0.46 + (i / (n - 1)) * Math.PI * 0.92
        return (
          <Frame key={it.id} item={it} active={active === it.id} onEnter={onEnter}
            position={[Math.sin(t) * R, 0, -Math.cos(t) * R + 5.4]} rotation={[0, -t, 0]} />
        )
      })}
      <Rig active={active} />
    </Canvas>
  )
}

function Frame({ item, active, onEnter, width = 1, height = 1.61803398875, ...props }) {
  const portal = useRef(null)
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => portal.current && easing.damp(portal.current, 'blend', active ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text font="/fonts/Inter-Bold.woff" fontSize={0.085} anchorY="top" anchorX="left" lineHeight={1} maxWidth={0.9} position={[-0.42, 0.9, 0.01]} color="#12161f" material-toneMapped={false}>
        {item.short}
      </Text>
      <Text font="/fonts/Inter-Bold.woff" fontSize={0.06} anchorX="right" position={[0.42, -0.9, 0.01]} color={item.color} material-toneMapped={false}>
        {item.date}
      </Text>
      <mesh name={item.id} onClick={(e) => { e.stopPropagation(); onEnter(active ? null : item.id) }} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[width, height, 0.08]} />
        <MeshPortalMaterial ref={portal} events={active} side={THREE.DoubleSide} blur={0} resolution={256}>
          <color attach="background" args={[item.bg]} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 4, 3]} intensity={1.2} />
          <Suspense fallback={null}>
            <Image url={item.img} position={[0, 0, -2.2]} scale={[2.6, 4.2, 1]} />
          </Suspense>
          <GlassBox item={item} />
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function GlassBox({ item }) {
  return (
    <group position={[0, -0.25, -0.9]}>
      <mesh>
        <boxGeometry args={[0.92, 0.62, 0.12]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.85} roughness={0.18} thickness={0.35} ior={1.3} transparent opacity={0.9} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0, 0.061]}>
        <planeGeometry args={[0.92, 0.62]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
      </mesh>
      <Text font="/fonts/Inter-Bold.woff" fontSize={0.05} maxWidth={0.8} anchorX="center" anchorY="top" position={[0, 0.24, 0.07]} color="#12161f" lineHeight={1.15} material-toneMapped={false}>
        {item.title}
      </Text>
      <Text font="/fonts/Inter-Bold.woff" fontSize={0.03} maxWidth={0.8} anchorX="center" anchorY="top" position={[0, 0.04, 0.07]} color="#3a3a35" lineHeight={1.3} material-toneMapped={false}>
        {item.blurb}
      </Text>
      <Text font="/fonts/Inter-Bold.woff" fontSize={0.028} anchorX="center" anchorY="bottom" position={[0, -0.27, 0.07]} color={item.color} material-toneMapped={false}>
        {item.label}
      </Text>
    </group>
  )
}

function Rig({ active, position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  useEffect(() => {
    const obj = active ? scene.getObjectByName(active) : undefined
    if (obj) {
      obj.parent.localToWorld(position.set(0, 0.5, 0.25))
      obj.parent.localToWorld(focus.set(0, 0, -2))
    } else {
      position.set(0, 0.6, 6.5); focus.set(0, 0, -2)
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  }, [active, controls])
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
