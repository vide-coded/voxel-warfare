import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, type RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useControls } from '../../hooks/useControls'
import { usePlayerStore } from '../../stores/playerStore'

export function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const keys = useControls()
  const { camera } = useThree()

  const {
    position,
    walkSpeed,
    sprintSpeed,
    jumpForce,
    gravity,
    stamina,
    setPosition,
    setVelocity,
    setGrounded,
    setJumping,
    setSprinting,
    drainStamina,
    regenerateStamina,
  } = usePlayerStore()

  useFrame((_state, delta) => {
    if (!rigidBodyRef.current) return

    const rb = rigidBodyRef.current
    const currentVel = rb.linvel()
    const currentPos = rb.translation()

    // Ground check (raycast down)
    const isOnGround = currentPos.y <= 2.1 && Math.abs(currentVel.y) < 0.1
    setGrounded(isOnGround)

    // Get camera's forward and right vectors (updated every frame)
    const cameraForward = new Vector3()
    const cameraRight = new Vector3()

    // Extract camera's forward direction (where camera is looking)
    camera.getWorldDirection(cameraForward)

    // Project forward vector onto horizontal plane (ignore vertical look)
    cameraForward.y = 0
    cameraForward.normalize()

    // Calculate right vector (perpendicular to forward on horizontal plane)
    // Right = Forward × Up (cross product)
    cameraRight.crossVectors(cameraForward, new Vector3(0, 1, 0)).normalize()

    // Build movement direction in world space based on input
    const movementDirection = new Vector3()

    // Z key = move in camera's forward direction
    if (keys.forward) {
      movementDirection.add(cameraForward)
    }

    // S key = move opposite to camera's forward direction
    if (keys.backward) {
      movementDirection.sub(cameraForward)
    }

    // Q key = move in camera's left direction (negative right)
    if (keys.left) {
      movementDirection.sub(cameraRight)
    }

    // D key = move in camera's right direction
    if (keys.right) {
      movementDirection.add(cameraRight)
    }

    // Normalize diagonal movement to maintain consistent speed
    if (movementDirection.length() > 0) {
      movementDirection.normalize()
    }

    // Sprint logic
    const canSprint = keys.sprint && stamina > 10 && movementDirection.length() > 0
    setSprinting(canSprint)

    // Calculate target speed
    const targetSpeed = canSprint ? sprintSpeed : walkSpeed

    // Stamina system
    if (canSprint) {
      drainStamina(20 * delta) // 20 stamina per second
    } else {
      regenerateStamina(15 * delta) // 15 stamina per second
    }

    // Apply movement with smooth acceleration
    const acceleration = 30 * delta
    const friction = 0.8

    let newVelX = currentVel.x
    let newVelZ = currentVel.z

    if (movementDirection.length() > 0) {
      newVelX += movementDirection.x * targetSpeed * acceleration
      newVelZ += movementDirection.z * targetSpeed * acceleration

      // Clamp to max speed
      const currentSpeed = Math.sqrt(newVelX * newVelX + newVelZ * newVelZ)
      if (currentSpeed > targetSpeed) {
        const scale = targetSpeed / currentSpeed
        newVelX *= scale
        newVelZ *= scale
      }
    } else {
      // Apply friction when no input
      newVelX *= friction
      newVelZ *= friction
    }

    // Jump logic
    let newVelY = currentVel.y
    if (keys.jump && isOnGround) {
      newVelY = jumpForce
      setJumping(true)
    } else {
      // Apply gravity
      newVelY += gravity * delta
      if (isOnGround && newVelY < 0) {
        newVelY = 0
        setJumping(false)
      }
    }

    // Apply velocity
    rb.setLinvel({ x: newVelX, y: newVelY, z: newVelZ }, true)

    // Update store with current position
    setPosition(new Vector3(currentPos.x, currentPos.y, currentPos.z))
    setVelocity(new Vector3(newVelX, newVelY, newVelZ))
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[position.x, position.y, position.z]}
      enabledRotations={[false, false, false]} // Prevent physics rotation
      lockRotations
      colliders={false}
      mass={1}
      type="dynamic"
    >
      {/* Capsule collider for player (radius 0.5, height 1.8) */}
      <CapsuleCollider args={[0.4, 0.5]} position={[0, 0, 0]} />

      {/* Visual representation (invisible in first-person, useful for debugging) */}
      <mesh position={[0, 0, 0]} visible={false}>
        <capsuleGeometry args={[0.5, 1.8, 8, 16]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>
    </RigidBody>
  )
}
