"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text } from '@react-three/drei'
import { Suspense } from 'react'

function FloatingBrain() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  )
}

function FloatingText() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        position={[0, -3, 0]}
        color="white"
        fontSize={0.8}
        maxWidth={10}
        textAlign="center"
        font="https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff"
      >
        MindVault
      </Text>
    </Float>
  )
}

function Particles() {
  return (
    <Stars
      radius={300}
      depth={60}
      count={1000}
      factor={7}
      saturation={0.5}
      fade
      speed={0.5}
    />
  )
}

export default function Scene3D() {
  return (
    // pointer-events-none so canvas doesn't trap clicks/hover; keep behind content with -z-10
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />

          <Particles />
          <FloatingBrain />
          <FloatingText />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
