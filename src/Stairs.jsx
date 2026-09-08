import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { CycleRaycast, BakeShadows, useCursor, Html, OrbitControls } from '@react-three/drei'
import { flatDocs } from './data.js'

const TINTS = ['#ffffff', '#e6f2f5', '#f4efe6', '#eef1e6', '#f0ece6', '#e8f0ea', '#f2e9ef']

export default function Stairs({ onOpen, popupIdx, onHover, onUnhover, onStatus }) {
  return (
    <Canvas
      shadows
      dpr={1.5}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [-14, 11, 10], fov: 50 }}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    >
      <Stage />
      <OrbitControls enablePan enableDamping dampingFactor={0.08} minDistance={8} maxDistance={34} maxPolarAngle={Math.PI / 2.05} target={[1, 3.5, 0]} />
      {flatDocs.map((doc, i) => (
        <Stair
          key={doc.projectId + doc.id}
          index={i}
          doc={doc}
          showPopup={popupIdx === i}
          onOpen={() => onOpen(i)}
          onHover={() => onHover(i)}
          onUnhover={() => onUnhover(i)}
          name={doc.title}
          rotation={[-Math.PI / 2, 0, i / 4]}
          position={[2 - Math.sin(i / 4) * 5, i * 0.55, 2 - Math.cos(i / 4) * 5]}
        />
      ))}
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={8} maxDistance={40} maxPolarAngle={Math.PI / 2.05} target={[0, 2.5, 0]} />
      <CycleRaycast
        onChanged={(objects, cycle) => {
          onStatus({ objects, cycle })
          return null
        }}
      />
    </Canvas>
  )
}

function Stair({ index, doc, active, showPopup, onOpen, onHover, onUnhover, ...props }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.scale.setScalar(hovered ? 1 + Math.sin(state.clock.elapsedTime * 10) / 50 : 1)
  })
  useCursor(hovered)
  const tint = TINTS[doc.projectIndex]
  return (
    <mesh
      {...props}
      ref={ref}
      receiveShadow
      castShadow
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover()
      }}
      onPointerOut={() => {
        setHovered(false)
        onUnhover()
      }}
    >
      <boxGeometry args={[2, 6, 0.075]} />
      <meshStandardMaterial
        roughness={1}
        transparent
        opacity={0.6}
        color={active ? 'lightblue' : hovered ? 'aquamarine' : tint}
      />
      {showPopup && (
        <Html position={[0, 0, 0.6]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div className="popup">
            <div className="popup-kicker">
              {doc.project.index} · {doc.project.title}
            </div>
            <div className="popup-title">{doc.title}</div>
            <div className="popup-sub">{doc.sub}</div>
            <div className="popup-hint">Click to open</div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Stage() {
  return (
    <>
      <ambientLight intensity={0.5 * Math.PI} />
      <directionalLight
        position={[1, 10, -2]}
        intensity={Math.PI}
        shadow-camera-far={70}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize={[1024, 1024]}
        castShadow
      />
      <directionalLight position={[-10, -10, 2]} intensity={3 * Math.PI} />
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.75, 0]}>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      <BakeShadows />
    </>
  )
}
