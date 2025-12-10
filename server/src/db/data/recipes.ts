// Crafting recipe definitions
export interface RecipeDefinition {
  id: string
  name: string
  result: {
    itemId: string
    quantity: number
  }
  ingredients: Array<{
    itemId: string
    quantity: number
  }>
  craftingStation?: 'workbench' | 'forge' | 'alchemy_table'
  unlockRequirement?: {
    type: 'level' | 'skill' | 'quest'
    value: string | number
  }
}

export const RECIPES: Record<string, RecipeDefinition> = {
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    result: { itemId: 'wooden_sword', quantity: 1 },
    ingredients: [{ itemId: 'wood', quantity: 5 }],
    craftingStation: 'workbench',
  },

  stone_axe: {
    id: 'stone_axe',
    name: 'Stone Axe',
    result: { itemId: 'stone_axe', quantity: 1 },
    ingredients: [
      { itemId: 'wood', quantity: 3 },
      { itemId: 'stone', quantity: 2 },
    ],
    craftingStation: 'workbench',
  },

  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    result: { itemId: 'iron_sword', quantity: 1 },
    ingredients: [
      { itemId: 'iron', quantity: 5 },
      { itemId: 'wood', quantity: 2 },
    ],
    craftingStation: 'forge',
    unlockRequirement: {
      type: 'level',
      value: 3,
    },
  },

  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    result: { itemId: 'health_potion', quantity: 1 },
    ingredients: [
      { itemId: 'wood', quantity: 1 }, // Placeholder - would be herbs in full game
    ],
    craftingStation: 'alchemy_table',
  },

  stamina_potion: {
    id: 'stamina_potion',
    name: 'Stamina Potion',
    result: { itemId: 'stamina_potion', quantity: 1 },
    ingredients: [
      { itemId: 'wood', quantity: 1 }, // Placeholder - would be herbs in full game
    ],
    craftingStation: 'alchemy_table',
  },
}

export function getRecipe(recipeId: string): RecipeDefinition | undefined {
  return RECIPES[recipeId]
}

export function getAllRecipes(): RecipeDefinition[] {
  return Object.values(RECIPES)
}

export function getRecipesForStation(station: string): RecipeDefinition[] {
  return Object.values(RECIPES).filter((recipe) => recipe.craftingStation === station)
}
