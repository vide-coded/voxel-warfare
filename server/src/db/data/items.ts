// Game item definitions
export interface ItemDefinition {
  id: string
  name: string
  description: string
  type: 'weapon' | 'tool' | 'consumable' | 'material' | 'armor'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  stackable: boolean
  maxStack?: number
  icon?: string
  properties?: Record<string, any>
}

export const ITEMS: Record<string, ItemDefinition> = {
  // Weapons
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    description: 'A basic sword made from wood',
    type: 'weapon',
    rarity: 'common',
    stackable: false,
    properties: {
      damage: 10,
      attackSpeed: 1.5,
      durability: 100,
      range: 2,
    },
  },

  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A sturdy sword forged from iron',
    type: 'weapon',
    rarity: 'uncommon',
    stackable: false,
    properties: {
      damage: 25,
      attackSpeed: 1.3,
      durability: 250,
      range: 2.5,
    },
  },

  pistol: {
    id: 'pistol',
    name: 'Pistol',
    description: 'A basic ranged weapon',
    type: 'weapon',
    rarity: 'common',
    stackable: false,
    properties: {
      damage: 20,
      attackSpeed: 2.0,
      ammo: 12,
      maxAmmo: 12,
      range: 30,
      reloadTime: 2,
    },
  },

  // Tools
  stone_axe: {
    id: 'stone_axe',
    name: 'Stone Axe',
    description: 'Used for chopping trees',
    type: 'tool',
    rarity: 'common',
    stackable: false,
    properties: {
      efficiency: 1.5,
      durability: 100,
    },
  },

  // Consumables
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores 50 HP',
    type: 'consumable',
    rarity: 'common',
    stackable: true,
    maxStack: 10,
    properties: {
      healAmount: 50,
      cooldown: 5,
    },
  },

  stamina_potion: {
    id: 'stamina_potion',
    name: 'Stamina Potion',
    description: 'Restores 50 stamina',
    type: 'consumable',
    rarity: 'common',
    stackable: true,
    maxStack: 10,
    properties: {
      staminaAmount: 50,
      cooldown: 5,
    },
  },

  // Materials
  wood: {
    id: 'wood',
    name: 'Wood',
    description: 'Basic building material',
    type: 'material',
    rarity: 'common',
    stackable: true,
    maxStack: 99,
  },

  stone: {
    id: 'stone',
    name: 'Stone',
    description: 'Common stone for crafting',
    type: 'material',
    rarity: 'common',
    stackable: true,
    maxStack: 99,
  },

  iron: {
    id: 'iron',
    name: 'Iron Ore',
    description: 'Metal ore for crafting',
    type: 'material',
    rarity: 'uncommon',
    stackable: true,
    maxStack: 99,
  },

  leather: {
    id: 'leather',
    name: 'Leather',
    description: 'Animal hide for crafting',
    type: 'material',
    rarity: 'common',
    stackable: true,
    maxStack: 50,
  },
}

export function getItem(itemId: string): ItemDefinition | undefined {
  return ITEMS[itemId]
}

export function getAllItems(): ItemDefinition[] {
  return Object.values(ITEMS)
}
