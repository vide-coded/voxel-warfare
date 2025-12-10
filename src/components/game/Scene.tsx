import { Sky } from '@react-three/drei'
import { useEffect } from 'react'
import { Vector3 } from 'three'
import { useEnemyStore } from '../../stores/enemyStore'
import { EnemyType } from '../../types/enemy'
import { Enemy } from './Enemy'
import { WeaponController } from './WeaponController'

export function Scene() {
  const { enemies, spawnEnemy } = useEnemyStore()

  // Spawn initial enemies
  useEffect(() => {
    // Spawn 3 zombies and 2 bandits in a circle around spawn
    const spawnRadius = 20

    // Zombie 1
    spawnEnemy(EnemyType.ZOMBIE, new Vector3(spawnRadius, 1, 0))

    // Zombie 2
    spawnEnemy(EnemyType.ZOMBIE, new Vector3(0, 1, spawnRadius))

    // Zombie 3
    spawnEnemy(EnemyType.ZOMBIE, new Vector3(-spawnRadius, 1, 0))

    // Bandit 1
    spawnEnemy(EnemyType.BANDIT, new Vector3(spawnRadius * 0.7, 1, spawnRadius * 0.7))

    // Bandit 2
    spawnEnemy(EnemyType.BANDIT, new Vector3(-spawnRadius * 0.7, 1, -spawnRadius * 0.7))

    console.log('🎮 Scene initialized with 5 enemies')
  }, [spawnEnemy])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Environment */}
      <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.6} azimuth={0.25} />

      {/* Enemies */}
      {Array.from(enemies.values()).map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}

      {/* Weapon Controller */}
      <WeaponController />
    </>
  )
}
