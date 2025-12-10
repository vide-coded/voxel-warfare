import { usePlayerStore } from '../../stores/playerStore'
import { Projectile } from './Projectile'

/**
 * ProjectileManager - Renders all active projectiles inside Physics context
 * Must be placed inside <Physics> component to avoid Rapier errors
 */
export function ProjectileManager() {
  const { projectiles, removeProjectile } = usePlayerStore()

  return (
    <>
      {projectiles.map((proj) => (
        <Projectile
          key={proj.id}
          startPosition={proj.startPosition}
          direction={proj.direction}
          speed={proj.speed}
          damage={proj.damage}
          onHit={(target) => {
            console.log('🎯 Hit target:', target)
            // TODO: Apply damage when enemy system exists
          }}
          onExpire={() => {
            removeProjectile(proj.id)
          }}
        />
      ))}
    </>
  )
}
