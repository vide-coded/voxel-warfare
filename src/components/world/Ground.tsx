import { RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { CanvasTexture, NearestFilter, RepeatWrapping } from 'three'

export function Ground() {
  // Create a simple procedural texture for now
  // In later phases, this will use AI-generated SVG textures
  const createGridTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    if (ctx) {
      // Base grass color
      ctx.fillStyle = '#5cb85c'
      ctx.fillRect(0, 0, 64, 64)

      // Add slight variations for texture
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 64
        const y = Math.random() * 64
        const size = Math.random() * 2 + 1
        const brightness = Math.random() * 20 - 10

        ctx.fillStyle = `rgb(${92 + brightness}, ${184 + brightness}, ${92 + brightness})`
        ctx.fillRect(x, y, size, size)
      }

      // Grid lines for voxel visualization
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= 64; x += 8) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 64)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= 64; y += 8) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(64, y)
        ctx.stroke()
      }
    }

    return canvas
  }, [])

  const texture = useMemo(() => {
    const canvasTexture = new CanvasTexture(createGridTexture)
    canvasTexture.wrapS = RepeatWrapping
    canvasTexture.wrapT = RepeatWrapping
    canvasTexture.repeat.set(100, 100)
    canvasTexture.magFilter = NearestFilter
    canvasTexture.minFilter = NearestFilter
    return canvasTexture
  }, [createGridTexture])

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} />
      </mesh>
    </RigidBody>
  )
}
