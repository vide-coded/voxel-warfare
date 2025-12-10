import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useControls } from '../../hooks/useControls'
import { usePlayerStore } from '../../stores/playerStore'
import { performMeleeAttack } from '../../systems/combat'

export function WeaponController() {
  const keys = useControls()
  const { camera } = useThree()

  // Track previous key states to detect key press (not hold)
  const prevWeaponSlot1 = useRef(false)
  const prevWeaponSlot2 = useRef(false)
  const prevReload = useRef(false)

  const {
    currentWeapon,
    attackCooldown,
    isReloading,
    stamina,
    attack,
    reload,
    equipWeapon,
    updateAttackCooldown,
    drainStamina,
    spawnProjectile,
  } = usePlayerStore()

  // Debug: Log when component mounts
  useRef(() => {
    console.log('🎮 WeaponController mounted')
    console.log('Initial weapon:', currentWeapon?.name)
    return true
  }).current

  // Single useFrame for all logic
  useFrame((_, delta) => {
    // Update attack cooldown
    if (attackCooldown > 0) {
      updateAttackCooldown(delta)
    }

    // Weapon switching (only on key press, not hold)
    if (keys.weaponSlot1 && !prevWeaponSlot1.current) {
      equipWeapon('sword')
    }
    prevWeaponSlot1.current = keys.weaponSlot1

    if (keys.weaponSlot2 && !prevWeaponSlot2.current) {
      equipWeapon('pistol')
    }
    prevWeaponSlot2.current = keys.weaponSlot2

    // Reload (only on key press, not hold)
    if (keys.reload && !prevReload.current && currentWeapon?.type === 'ranged' && !isReloading) {
      reload()
    }
    prevReload.current = keys.reload

    // Attack logic
    if (!keys.attack || !currentWeapon || attackCooldown > 0 || isReloading) {
      return
    }

    if (currentWeapon.type === 'melee') {
      // Check stamina
      if (stamina < (currentWeapon.staminaCost || 0)) {
        console.log('⚠️ Not enough stamina!')
        return
      }

      // Perform melee attack
      performMeleeAttack(currentWeapon, camera)

      // Always consume stamina on swing
      drainStamina(currentWeapon.staminaCost || 0)
      attack() // Triggers cooldown
    }

    if (currentWeapon.type === 'ranged') {
      // Check ammo
      if ((currentWeapon.ammo || 0) <= 0) {
        console.log('🔫 Out of ammo! Press R to reload')
        return
      }

      // Fire projectile
      const startPos = camera.position.clone()
      // Offset slightly forward to prevent self-collision
      const direction = new Vector3()
      camera.getWorldDirection(direction)
      startPos.add(direction.clone().multiplyScalar(0.5))

      const newProjectile = {
        id: Date.now() + Math.random(),
        startPosition: startPos,
        direction: direction,
        speed: 50,
        damage: currentWeapon.damage,
      }

      spawnProjectile(newProjectile)
      attack() // Triggers cooldown & consumes ammo
      console.log('🔫 Fired! Ammo remaining:', (currentWeapon.ammo || 0) - 1)
    }
  })

  // No rendering needed - projectiles are rendered by ProjectileManager
  return null
}
