import { useFrame } from '@react-three/fiber'
import { type RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useRef, useState } from 'react'
import { Vector3 } from 'three'
import { useEnemyStore } from '../../stores/enemyStore'
import { AIState } from '../../types/enemy'

interface ProjectileProps {
  startPosition: Vector3
  direction: Vector3
  speed: number
  damage: number
  onHit?: (target: unknown) => void
  onExpire: () => void
}

export function Projectile({ startPosition, direction, speed, damage, onExpire }: ProjectileProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const [lifetime, setLifetime] = useState(5) // 5 second max lifetime
  const hasExpired = useRef(false)
  const checkedEnemies = useRef(new Set<string>())

  useFrame((_, delta) => {
    if (hasExpired.current) return

    // Update lifetime
    setLifetime((prev) => {
      const newLifetime = Math.max(0, prev - delta)
      if (newLifetime <= 0 && !hasExpired.current) {
        hasExpired.current = true
        onExpire()
      }
      return newLifetime
    })

    if (!rigidBodyRef.current) return

    // Apply constant velocity in direction
    const velocity = direction.clone().multiplyScalar(speed)
    rigidBodyRef.current.setLinvel(velocity, true)

    // Check for enemy hits using a wider detection range
    const currentPos = rigidBodyRef.current.translation()
    const position = new Vector3(currentPos.x, currentPos.y, currentPos.z)

    // Check enemies within a reasonable range
    const enemies = useEnemyStore.getState().enemies
    enemies.forEach((enemy, enemyId) => {
      if (enemy.state === AIState.DEAD || checkedEnemies.current.has(enemyId)) return

      // Simple distance check for hit detection (hitbox radius of 1.5m)
      const distance = position.distanceTo(enemy.position)
      if (distance < 1.5) {
        // Mark this enemy as checked to avoid multiple hits
        checkedEnemies.current.add(enemyId)

        // Damage enemy
        useEnemyStore.getState().damageEnemy(enemyId, damage)
        console.log(`🎯 Projectile hit ${enemy.type} for ${damage} damage!`)

        // Expire projectile
        if (!hasExpired.current) {
          hasExpired.current = true
          onExpire()
        }
      }
    })
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[startPosition.x, startPosition.y, startPosition.z]}
      type="dynamic"
      gravityScale={0.2} // Slight bullet drop
      colliders="ball"
      userData={{ type: 'projectile', damage }}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={2} />
      </mesh>
    </RigidBody>
  )
}
