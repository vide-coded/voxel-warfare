import { Euler, Vector3 } from 'three'
import { create } from 'zustand'
import { WEAPONS, type Weapon } from '../types/weapons'

// Projectile data structure
export interface ProjectileData {
  id: number
  startPosition: Vector3
  direction: Vector3
  speed: number
  damage: number
}

interface PlayerState {
  // Position & Rotation
  position: Vector3
  rotation: Euler
  velocity: Vector3

  // Physical State
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  isGrounded: boolean
  isJumping: boolean
  isSprinting: boolean

  // Weapon State
  currentWeapon: Weapon | null
  weapons: Weapon[]
  attackCooldown: number
  isReloading: boolean

  // Projectiles
  projectiles: ProjectileData[]

  // Stats
  level: number
  experience: number

  // Movement Parameters
  walkSpeed: number
  sprintSpeed: number
  jumpForce: number
  gravity: number

  // Actions
  setPosition: (position: Vector3) => void
  setRotation: (rotation: Euler) => void
  setVelocity: (velocity: Vector3) => void
  setGrounded: (grounded: boolean) => void
  setJumping: (jumping: boolean) => void
  setSprinting: (sprinting: boolean) => void
  drainStamina: (amount: number) => void
  regenerateStamina: (amount: number) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  equipWeapon: (weaponId: string) => void
  attack: () => void
  reload: () => void
  updateAttackCooldown: (delta: number) => void
  spawnProjectile: (projectile: ProjectileData) => void
  removeProjectile: (id: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  // Initial State
  position: new Vector3(0, 2, 0),
  rotation: new Euler(0, 0, 0),
  velocity: new Vector3(0, 0, 0),

  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  isGrounded: false,
  isJumping: false,
  isSprinting: false,

  // Weapon state
  currentWeapon: { ...WEAPONS.sword }, // Start with sword
  weapons: [{ ...WEAPONS.sword }, { ...WEAPONS.pistol }],
  attackCooldown: 0,
  isReloading: false,

  // Projectiles
  projectiles: [],

  level: 1,
  experience: 0,

  // Movement parameters (units per second)
  walkSpeed: 5,
  sprintSpeed: 8,
  jumpForce: 10,
  gravity: -30,

  // Actions
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setVelocity: (velocity) => set({ velocity }),
  setGrounded: (grounded) => set({ isGrounded: grounded }),
  setJumping: (jumping) => set({ isJumping: jumping }),
  setSprinting: (sprinting) => set({ isSprinting: sprinting }),

  drainStamina: (amount) =>
    set((state) => ({
      stamina: Math.max(0, state.stamina - amount),
    })),

  regenerateStamina: (amount) =>
    set((state) => ({
      stamina: Math.min(state.maxStamina, state.stamina + amount),
    })),

  takeDamage: (amount) =>
    set((state) => ({
      health: Math.max(0, state.health - amount),
    })),

  heal: (amount) =>
    set((state) => ({
      health: Math.min(state.maxHealth, state.health + amount),
    })),

  equipWeapon: (weaponId) =>
    set((state) => {
      const weapon = state.weapons.find((w) => w.id === weaponId)
      if (!weapon) {
        console.log('❌ Weapon not found:', weaponId)
        return state
      }
      console.log(`⚔️ Equipped: ${weapon.name}`)
      return { currentWeapon: weapon }
    }),

  attack: () =>
    set((state) => {
      if (!state.currentWeapon) return state

      const cooldown = 1 / state.currentWeapon.attackSpeed

      // For ranged weapons, consume ammo
      if (state.currentWeapon.type === 'ranged') {
        const newAmmo = Math.max(0, (state.currentWeapon.ammo || 0) - 1)
        const updatedWeapon = { ...state.currentWeapon, ammo: newAmmo }
        const updatedWeapons = state.weapons.map((w) =>
          w.id === updatedWeapon.id ? updatedWeapon : w,
        )
        return {
          currentWeapon: updatedWeapon,
          weapons: updatedWeapons,
          attackCooldown: cooldown,
        }
      }

      return { attackCooldown: cooldown }
    }),

  reload: () =>
    set((state) => {
      if (!state.currentWeapon || state.currentWeapon.type !== 'ranged') {
        return state
      }

      const weapon = state.currentWeapon
      const ammoNeeded = (weapon.maxAmmo || 0) - (weapon.ammo || 0)
      const ammoAvailable = weapon.totalAmmo || 0

      if (ammoNeeded <= 0 || ammoAvailable <= 0) {
        console.log('⚠️ No need to reload or no ammo available')
        return state
      }

      const ammoToReload = Math.min(ammoNeeded, ammoAvailable)
      const newAmmo = (weapon.ammo || 0) + ammoToReload
      const newTotalAmmo = ammoAvailable - ammoToReload

      const updatedWeapon = {
        ...weapon,
        ammo: newAmmo,
        totalAmmo: newTotalAmmo,
      }
      const updatedWeapons = state.weapons.map((w) =>
        w.id === updatedWeapon.id ? updatedWeapon : w,
      )

      console.log(`🔄 Reloading... ${newAmmo}/${weapon.maxAmmo}`)

      // Set reloading flag
      setTimeout(
        () => {
          usePlayerStore.setState({ isReloading: false })
          console.log('✅ Reload complete!')
        },
        (weapon.reloadTime || 1) * 1000,
      )

      return {
        currentWeapon: updatedWeapon,
        weapons: updatedWeapons,
        isReloading: true,
      }
    }),

  updateAttackCooldown: (delta) =>
    set((state) => ({
      attackCooldown: Math.max(0, state.attackCooldown - delta),
    })),

  spawnProjectile: (projectile) =>
    set((state) => ({
      projectiles: [...state.projectiles, projectile],
    })),

  removeProjectile: (id) =>
    set((state) => ({
      projectiles: state.projectiles.filter((p) => p.id !== id),
    })),
}))
