import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { usePlayerStore } from '../../stores/playerStore'

export function Camera() {
  const { camera, gl } = useThree()
  const controlsRef = useRef<PointerLockControlsImpl | null>(null)
  const { position } = usePlayerStore()

  useEffect(() => {
    const controls = new PointerLockControlsImpl(camera, gl.domElement)
    controlsRef.current = controls

    // Position camera at player eye level initially
    camera.position.set(0, 1.6, 0)

    // Lock pointer on click
    const handleClick = () => {
      controls.lock()
    }

    // Listen for lock/unlock events
    const handleLock = () => {
      console.log('Pointer locked')
    }

    const handleUnlock = () => {
      console.log('Pointer unlocked')
    }

    gl.domElement.addEventListener('click', handleClick)
    controls.addEventListener('lock', handleLock)
    controls.addEventListener('unlock', handleUnlock)

    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      controls.removeEventListener('lock', handleLock)
      controls.removeEventListener('unlock', handleUnlock)
      controls.dispose()
    }
  }, [camera, gl])

  useFrame(() => {
    if (!controlsRef.current) return

    // Get player position from store
    const playerPos = position

    // Calculate camera position (player position + eye height offset)
    const eyeHeight = 1.6
    const targetPosition = new Vector3(
      playerPos.x,
      playerPos.y + eyeHeight - 2, // Subtract 2 because player spawns at y=2
      playerPos.z,
    )

    // Smoothly follow player
    camera.position.lerp(targetPosition, 0.1)
  })

  return null
}
