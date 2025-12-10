export interface Weapon {
  id: string
  name: string
  type: 'melee' | 'ranged'
  damage: number
  range: number // meters
  attackSpeed: number // attacks per second
  staminaCost?: number // For melee
  ammo?: number // Current ammo (ranged)
  maxAmmo?: number // Clip size (ranged)
  totalAmmo?: number // Reserve ammo (ranged)
  reloadTime?: number // Seconds (ranged)
  critChance?: number // 0-1 (optional, default 0.1)
  critMultiplier?: number // Multiplier (optional, default 2.0)
}

export const WEAPONS: Record<string, Weapon> = {
  sword: {
    id: 'sword',
    name: 'Iron Sword',
    type: 'melee',
    damage: 25,
    range: 2,
    attackSpeed: 1.5,
    staminaCost: 10,
    critChance: 0.15,
    critMultiplier: 2.0,
  },
  pistol: {
    id: 'pistol',
    name: '9mm Pistol',
    type: 'ranged',
    damage: 15,
    range: 50,
    attackSpeed: 3,
    ammo: 12,
    maxAmmo: 12,
    totalAmmo: 60,
    reloadTime: 1.5,
    critChance: 0.1,
    critMultiplier: 2.5,
  },
}
