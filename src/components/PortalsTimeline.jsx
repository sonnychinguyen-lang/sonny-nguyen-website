import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Text, Preload, useTexture, RoundedBox } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)
import { asset } from '../asset.js'
const FONT = asset('fonts/Inter-Bold.woff')

// The pmndrs enter-portals example: one portal per timeline event.
// Double-click (or the Enter button) walks into a portal; inside is an illustrated backdrop with the event text in a glass box.
export default function PortalsTimeline({ items, focus, entered, onEnter }) {
  const spacing = 1.3
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 20] }} style={{ position: 'absolute', inset: 0 }} eventPrefix="client">
      <color attach="background" args={['#eef2e4']} />
      {items.map((it, i) => (
        <Frame key={it.id} item={it} index={i + 1} active={entered && focus === it.id} onEnter={() => onEnter(it.id)} position={[(i - (items.length - 1) / 2) * spacing, 0, 0]} rotation={[0, 0, 0]} />
      ))}
      <Rig focus={focus} entered={entered} />
      <Preload all />
    </Canvas>
  )
}

function Frame({ item, index, active, onEnter, ...props }) {
  const portal = useRef(null)
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => portal.current && easing.damp(portal.current, 'blend', active ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text font={FONT} fontSize={0.085} anchorY="top" anchorX="left" lineHeight={1.05} maxWidth={0.78} position={[-0.375, 0.72, 0.01]} color="#252525" material-toneMapped={false}>
        {item.short}
      </Text>
      <Text font={FONT} fontSize={0.07} anchorX="right" position={[0.4, -0.66, 0.01]} color="#252525" material-toneMapped={false}>
        /{String(index).padStart(2, '0')}
      </Text>
      <Text font={FONT} fontSize={0.038} anchorX="left" position={[-0.375, -0.68, 0.01]} color="#6b6b66" material-toneMapped={false}>
        {item.date}{item.time ? ' · ' + item.time : ''}
      </Text>
      <mesh name={item.id} onDoubleClick={(e) => { e.stopPropagation(); onEnter() }} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[1, 1.61803398875, 0.1]} />
        <MeshPortalMaterial ref={portal} events={active} side={THREE.DoubleSide} blur={0} resolution={512}>
          <color attach="background" args={[item.bg]} />
          <Inside item={item} />
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Inside({ item }) {
  const tex = useTexture(item.img)
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} />
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[6.4, 6.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <group position={[0, -0.1, -1.25]}>
        <RoundedBox args={[1.55, 1.05, 0.06]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.72} roughness={0.25} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0, -0.005]}><planeGeometry args={[1.62, 1.12]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.28} /></mesh>
        <Text font={FONT} fontSize={0.05} anchorX="left" anchorY="top" position={[-0.7, 0.46, 0.04]} color={item.color} material-toneMapped={false}>
          {item.type.toUpperCase()}
        </Text>
        <Text font={FONT} fontSize={0.08} maxWidth={1.4} anchorX="left" anchorY="top" position={[-0.7, 0.38, 0.04]} color="#12161f" lineHeight={1.05} material-toneMapped={false}>
          {item.title}
        </Text>
        <Text font={FONT} fontSize={0.043} maxWidth={1.4} anchorX="left" anchorY="top" position={[-0.7, 0.12, 0.04]} color="#2a2a26" lineHeight={1.3} material-toneMapped={false}>
          {item.summary}
        </Text>
      </group>
    </>
  )
}

function Rig({ focus, entered, position = new THREE.Vector3(0, 0, 4), target = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  useEffect(() => {
    const obj = focus ? scene.getObjectByName(focus) : undefined
    if (obj && entered) {
      obj.parent.localToWorld(position.set(0, 0.5, 0.25))
      obj.parent.localToWorld(target.set(0, 0, -2))
    } else if (obj) {
      obj.parent.localToWorld(position.set(0, 0, 2.6))
      obj.parent.localToWorld(target.set(0, 0, 0))
    } else {
      position.set(0, 0, 4); target.set(0, 0, 0)
    }
    controls && controls.setLookAt(...position.toArray(), ...target.toArray(), true)
  }, [focus, entered, controls])
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
