import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type RapierRigidBody, RigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import { Group, type Mesh, Vector3 } from 'three'
import { useEnemyStore } from '../../stores/enemyStore'
import { EnemyAI } from '../../systems/ai'
import type { EnemyData } from '../../types/enemy'
import { AIState, EnemyType } from '../../types/enemy'

interface EnemyProps {
  enemy: EnemyData
}

export function Enemy({ enemy: initialEnemy }: EnemyProps) {
  const groupRef = useRef<Group>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const bodyRef = useRef<Mesh>(null)
  const headRef = useRef<Mesh>(null)

  const aiRef = useRef(new EnemyAI(initialEnemy))

  const updateEnemy = useEnemyStore((state) => state.updateEnemy)

  // Subscribe to this specific enemy's health and state (will trigger re-render when they change)
  const enemyHealth = useEnemyStore(
    (state) => state.enemies.get(initialEnemy.id)?.stats.health ?? initialEnemy.stats.health,
  )
  const enemyMaxHealth = useEnemyStore(
    (state) => state.enemies.get(initialEnemy.id)?.stats.maxHealth ?? initialEnemy.stats.maxHealth,
  )
  const enemyState = useEnemyStore(
    (state) => state.enemies.get(initialEnemy.id)?.state ?? initialEnemy.state,
  )

  // Get the full enemy data from store
  const enemy = useEnemyStore((state) => state.enemies.get(initialEnemy.id) || initialEnemy)

  // Update AI reference when enemy changes significantly (respawn, etc.)
  useEffect(() => {
    if (enemyState === AIState.DEAD && aiRef.current) {
      // Reset AI on death
      aiRef.current = new EnemyAI(enemy)
    }
  }, [enemyState, enemy])

  // AI update loop
  useFrame((_, delta) => {
    if (!rigidBodyRef.current || enemy.state === AIState.DEAD) return

    // Update AI
    const updatedEnemy = aiRef.current.update(delta)

    // Sync position with physics (keep Y at ground level)
    const newPos = new Vector3(updatedEnemy.position.x, 1, updatedEnemy.position.z)

    // Update rigid body position and rotation
    rigidBodyRef.current.setTranslation(newPos, true)
    rigidBodyRef.current.setRotation(
      {
        w: Math.cos(updatedEnemy.rotation / 2),
        x: 0,
        y: Math.sin(updatedEnemy.rotation / 2),
        z: 0,
      },
      true,
    )

    // Sync to store (with corrected Y position)
    updateEnemy(updatedEnemy.id, {
      ...updatedEnemy,
      position: newPos,
    })
  })

  // Visual appearance based on enemy type
  const getColors = () => {
    switch (enemy.type) {
      case EnemyType.ZOMBIE:
        return { body: '#2d5a3d', head: '#4a7c5e' } // Green zombie
      case EnemyType.BANDIT:
        return { body: '#8b4513', head: '#d2691e' } // Brown bandit
      default:
        return { body: '#666666', head: '#888888' }
    }
  }

  const colors = getColors()
  const healthPercent = (enemyHealth / enemyMaxHealth) * 100

  // Don't render dead enemies (until respawn)
  if (enemyState === AIState.DEAD) {
    return null
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      colliders="cuboid"
      position={[enemy.position.x, 1, enemy.position.z]}
      rotation={[0, enemy.rotation, 0]}
      userData={{ type: 'enemy', id: enemy.id }}
      lockRotations
      lockTranslations={false}
    >
      {/* Voxel-style enemy body */}
      <group ref={groupRef}>
        {/* Body */}
        <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.8, 1.5, 0.6]} />
          <meshStandardMaterial color={colors.body} />
        </mesh>

        {/* Head */}
        <mesh ref={headRef} position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color={colors.head} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.5, 0.75, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color={colors.body} />
        </mesh>
        <mesh position={[0.5, 0.75, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color={colors.body} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.25, -0.25, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color={colors.body} />
        </mesh>
        <mesh position={[0.25, -0.25, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color={colors.body} />
        </mesh>
      </group>

      {/* Health bar (HTML overlay) */}
      <Html position={[0, 2.8, 0]} center distanceFactor={10}>
        <div className="pointer-events-none" style={{ width: '60px' }}>
          {/* Enemy name */}
          <div className="text-xs text-white text-center mb-1 drop-shadow-lg font-semibold">
            {enemy.type.toUpperCase()}
          </div>

          {/* Health bar background */}
          <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/30">
            {/* Health bar fill */}
            <div
              className="h-full transition-all duration-200"
              style={{
                width: `${healthPercent}%`,
                backgroundColor:
                  healthPercent > 50 ? '#22c55e' : healthPercent > 25 ? '#eab308' : '#ef4444',
              }}
            />
          </div>

          {/* State indicator */}
          {enemy.state === AIState.ALERT && (
            <div className="text-center text-xl animate-bounce">⚠️</div>
          )}
          {enemy.state === AIState.CHASE && (
            <div className="text-center text-xl animate-pulse">👁️</div>
          )}
          {enemy.state === AIState.ATTACK && (
            <div className="text-center text-xl animate-ping">⚔️</div>
          )}
          {enemy.state === AIState.FLEE && <div className="text-center text-xl">💨</div>}
        </div>
      </Html>
    </RigidBody>
  )
}
