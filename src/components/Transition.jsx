import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`
const frag = `
precision highp float;
varying vec2 vUv;
uniform float uT; uniform float uTime; uniform float uAspect;
float n2(vec2 p){ return sin(p.x)*sin(p.y); }
void main(){
  vec2 uv = vUv;
  float wob = 0.10*sin(uv.y*5.0 + uTime*2.4) + 0.05*sin(uv.y*13.0 - uTime*3.1) + 0.03*sin(uv.x*9.0 + uTime*1.7);
  float sweep = uv.x + wob;
  float t = uT;
  float f1 = 1.35 - min(t, 0.5) * 3.5;          // entering front, right -> left
  float f2 = 1.35 - max(t - 0.5, 0.0) * 3.5;    // clearing front, right -> left
  float cover = smoothstep(f1, f1 + 0.28, sweep) * (1.0 - smoothstep(f2, f2 + 0.28, sweep));
  // matcha liquid gradient
  vec3 c1 = vec3(0.914, 0.937, 0.851); vec3 c2 = vec3(0.725, 0.812, 0.573); vec3 c3 = vec3(0.494, 0.635, 0.357);
  float g = 0.5 + 0.5*sin(uv.x*3.0 + uv.y*2.0 + uTime*0.9 + n2(uv*6.0 + uTime*0.5));
  vec3 col = mix(mix(c1, c2, g), c3, 0.35*(0.5+0.5*sin(uv.y*4.0 - uTime*1.3)));
  // glassy edge highlight on the moving fronts
  float edge = smoothstep(f1 + 0.20, f1 + 0.30, sweep) * (1.0 - smoothstep(f1 + 0.30, f1 + 0.40, sweep));
  float edge2 = smoothstep(f2 + 0.20, f2 + 0.30, sweep) * (1.0 - smoothstep(f2 + 0.30, f2 + 0.40, sweep));
  col += (edge + edge2) * 0.55;
  gl_FragColor = vec4(col, cover * 0.94);
}`

function Wipe({ startedAt }) {
  const mat = useRef(null)
  useFrame((state) => {
    if (!mat.current) return
    const t = Math.min(1, (performance.now() - startedAt) / 900)
    mat.current.uniforms.uT.value = t
    mat.current.uniforms.uTime.value = state.clock.elapsedTime
  })
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} transparent depthTest={false} uniforms={{ uT: { value: 0 }, uTime: { value: 0 }, uAspect: { value: 1 } }} />
    </mesh>
  )
}

export default function Transition({ active }) {
  const started = useRef(0)
  if (active && !started.current) started.current = performance.now()
  if (!active) started.current = 0
  if (!active) return null
  return (
    <div className="wipe">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: false }} orthographic camera={{ position: [0, 0, 1], zoom: 1 }} style={{ position: 'absolute', inset: 0 }}>
        <Wipe startedAt={started.current} />
      </Canvas>
    </div>
  )
}
