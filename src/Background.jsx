import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

export default function Background() {
  return (
    <ShaderGradientCanvas style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} pixelDensity={1} fov={45}>
      <ShaderGradient
        control="props" type="plane" animate="on" shader="defaults" lightType="3d" envPreset="city" grain="off"
        color1="#e9efd9" color2="#b9cf92" color3="#7ea25b"
        brightness={1.1} uStrength={2.2} uDensity={1.4} uSpeed={0.25} uFrequency={3.2} uAmplitude={1.1}
        cDistance={3.4} cPolarAngle={90} cAzimuthAngle={180} reflection={0.12}
      />
    </ShaderGradientCanvas>
  )
}
