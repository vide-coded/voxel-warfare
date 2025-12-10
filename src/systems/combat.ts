import { type Camera, Vector3 } from 'three'
import { useEnemyStore } from '../stores/enemyStore'
import type { Weapon } from '../types/weapons'
import { checkEnemyHit } from './ai'

export function performMeleeAttack(
  weapon: Weapon,
  camera: Camera,
): { hit: boolean; damage?: number; isCrit?: boolean } {
  // Get ray from camera
  const rayOrigin = camera.position.clone()
  const rayDirection = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize()

  // Check for enemy hits
  const hit = checkEnemyHit(rayOrigin, rayDirection, weapon.range)

  if (hit) {
    // Calculate damage (with crit chance)
    let damage = weapon.damage
    const isCrit = Math.random() < (weapon.critChance || 0.1)
    if (isCrit) {
      damage *= weapon.critMultiplier || 2.0
    }

    // Damage the enemy
    useEnemyStore.getState().damageEnemy(hit.enemyId, damage, isCrit)

    console.log(
      `💥 Hit enemy for ${damage} damage ${isCrit ? '(CRIT!)' : ''} at ${hit.distance.toFixed(2)}m`,
    )

    return { hit: true, damage, isCrit }
  }

  console.log('💨 Swing missed!')
  return { hit: false }
}
