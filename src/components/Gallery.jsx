import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text } from '@react-three/drei'
import { easing } from 'maath'

const GOLDENRATIO = 1.61803398875
const FONT = '/fonts/Inter-Bold.woff'

// The pmndrs image-gallery example, with captions and controlled selection.
export default function Gallery({ frames, selected, onSelect, rest = [0, 0, 7.6] }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }} style={{ position: 'absolute', inset: 0 }}>
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <ambientLight intensity={1.1} />
      <spotLight position={[0, 10, 4]} intensity={30} angle={0.9} penumbra={0.6} />
      <group position={[0, -0.5, 0]}>
        <Frames frames={frames} selected={selected} onSelect={onSelect} rest={rest} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial blur={[300, 100]} resolution={1024} mixBlur={1} mixStrength={80} roughness={1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#050505" metalness={0.5} />
        </mesh>
      </group>
    </Canvas>
  )
}

function Frames({ frames, selected, onSelect, rest, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef(null)
  const clicked = useRef(undefined)
  useEffect(() => {
    clicked.current = selected ? ref.current.getObjectByName(selected) : undefined
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(...rest)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group ref={ref} onClick={(e) => { e.stopPropagation(); onSelect(clicked.current === e.object ? null : e.object.name) }} onPointerMissed={() => onSelect(null)}>
      {frames.map((f) => <Frame key={f.id} {...f} isActive={selected === f.id} />)}
    </group>
  )
}

function Frame({ id, url, caption, position, rotation, isActive }) {
  const image = useRef(null)
  const frame = useRef(null)
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  useCursor(hovered)
  useFrame((state, dt) => {
    if (image.current) {
      image.current.material.zoom = isActive ? 1.02 : 1.18 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 8
      easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    }
    if (frame.current) easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
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
      <Text font={FONT} maxWidth={0.5} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.045} color="#e8e6dd" lineHeight={1.2}>
        {caption}
      </Text>
    </group>
  )
}
