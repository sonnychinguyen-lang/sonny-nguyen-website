// The pmndrs "image gallery" example (reflections, annotations), with the same layout and behaviour.
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text } from '@react-three/drei'
import { easing } from 'maath'

const GOLDENRATIO = 1.61803398875
function stableRandom(key) { let h = 2166136261; for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619); return ((h >>> 0) % 10000) / 10000 }

// Same nine slots as the example, plus four more on the wings for a 13-photo set
export const SLOTS = [
  { position: [0, 0, 1.5], rotation: [0, 0, 0] },
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0] }, { position: [0.8, 0, -0.6], rotation: [0, 0, 0] },
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0] }, { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0] }, { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0] },
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0] }, { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0] }, { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0] },
  { position: [-2.4, 0, 4], rotation: [0, Math.PI / 2.5, 0] }, { position: [2.4, 0, 4], rotation: [0, -Math.PI / 2.5, 0] },
  { position: [-1.6, 0, -1.7], rotation: [0, Math.PI / 6, 0] }, { position: [1.6, 0, -1.7], rotation: [0, -Math.PI / 6, 0] },
]

export default function PhotoGallery({ photos, selected, onSelect }) {
  const images = photos.map((p, i) => ({ ...p, ...SLOTS[i % SLOTS.length] }))
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }} style={{ position: 'absolute', inset: 0 }}>
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <ambientLight intensity={1.1} />
      <spotLight position={[0, 10, 4]} intensity={30} angle={0.9} penumbra={0.7} />
      <group position={[0, -0.5, 0]}>
        <Frames images={images} selected={selected} onSelect={onSelect} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial blur={[300, 100]} resolution={1024} mixBlur={1} mixStrength={80} roughness={1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#050505" metalness={0.5} />
        </mesh>
      </group>
    </Canvas>
  )
}

function Frames({ images, selected, onSelect, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef(null)
  const clicked = useRef(undefined)
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(selected ?? '')
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else { p.set(0, 0, 5.5); q.identity() }
  })
  useFrame((state, dt) => { easing.damp3(state.camera.position, p, 0.4, dt); easing.dampQ(state.camera.quaternion, q, 0.4, dt) })
  return (
    <group ref={ref} onClick={(e) => { e.stopPropagation(); onSelect(clicked.current === e.object ? null : e.object.name) }} onPointerMissed={() => onSelect(null)}>
      {images.map((props) => <Frame key={props.id} {...props} isActive={selected === props.id} />)}
    </group>
  )
}

function Frame({ id, url, caption, position, rotation, isActive, c = new THREE.Color() }) {
  const image = useRef(null)
  const frame = useRef(null)
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => stableRandom(url))
  useCursor(hovered)
  useFrame((state, dt) => {
    if (!image.current) return
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  })
  return (
    <group position={position} rotation={rotation}>
      <mesh name={id} onPointerOver={(e) => { e.stopPropagation(); hover(true) }} onPointerOut={() => hover(false)} scale={[1, GOLDENRATIO, 0.05]} position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text font="/fonts/Inter-Bold.woff" maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025} color="#e8e6dd">
        {caption}
      </Text>
    </group>
  )
}
