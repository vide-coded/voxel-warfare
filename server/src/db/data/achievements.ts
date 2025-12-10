// Achievement definitions
export interface AchievementDefinition {
  id: string
  title: string
  description: string
  category: 'combat' | 'exploration' | 'crafting' | 'quests' | 'skills'
  icon?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirement: {
    type: string
    value: number | string
  }
  reward?: {
    experience?: number
    items?: Array<{ itemId: string; quantity: number }>
  }
}

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  first_blood: {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Defeat your first enemy',
    category: 'combat',
    rarity: 'common',
    requirement: {
      type: 'kills',
      value: 1,
    },
  },

  survivalist: {
    id: 'survivalist',
    title: 'Survivalist',
    description: 'Survive for 10 minutes in the wild',
    category: 'exploration',
    rarity: 'common',
    requirement: {
      type: 'survival_time',
      value: 600, // seconds
    },
  },

  crafter: {
    id: 'crafter',
    title: 'Crafter',
    description: 'Craft 10 different items',
    category: 'crafting',
    rarity: 'common',
    requirement: {
      type: 'crafted_items',
      value: 10,
    },
  },

  explorer: {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visit 5 different biomes',
    category: 'exploration',
    rarity: 'rare',
    requirement: {
      type: 'biomes_visited',
      value: 5,
    },
  },

  dungeon_delver: {
    id: 'dungeon_delver',
    title: 'Dungeon Delver',
    description: 'Complete your first dungeon',
    category: 'exploration',
    rarity: 'rare',
    requirement: {
      type: 'dungeons_completed',
      value: 1,
    },
  },

  sharpshooter: {
    id: 'sharpshooter',
    title: 'Sharpshooter',
    description: 'Land 50 headshots',
    category: 'combat',
    rarity: 'epic',
    requirement: {
      type: 'headshots',
      value: 50,
    },
  },

  speedrunner: {
    id: 'speedrunner',
    title: 'Speedrunner',
    description: 'Complete a quest in under 5 minutes',
    category: 'quests',
    rarity: 'rare',
    requirement: {
      type: 'quest_speed',
      value: 300, // seconds
    },
  },

  rich: {
    id: 'rich',
    title: 'Rich',
    description: 'Accumulate 1000 gold',
    category: 'exploration',
    rarity: 'rare',
    requirement: {
      type: 'gold_earned',
      value: 1000,
    },
  },

  collector: {
    id: 'collector',
    title: 'Collector',
    description: 'Obtain 50 unique items',
    category: 'exploration',
    rarity: 'epic',
    requirement: {
      type: 'unique_items',
      value: 50,
    },
  },

  max_level: {
    id: 'max_level',
    title: 'Max Level',
    description: 'Reach level 20',
    category: 'skills',
    rarity: 'legendary',
    requirement: {
      type: 'level',
      value: 20,
    },
    reward: {
      experience: 1000,
    },
  },

  master_blacksmith: {
    id: 'master_blacksmith',
    title: 'Master Blacksmith',
    description: 'Craft a legendary weapon',
    category: 'crafting',
    rarity: 'legendary',
    requirement: {
      type: 'craft_legendary',
      value: 1,
    },
  },

  pacifist: {
    id: 'pacifist',
    title: 'Pacifist',
    description: 'Complete a quest without killing anyone',
    category: 'quests',
    rarity: 'epic',
    requirement: {
      type: 'pacifist_quest',
      value: 1,
    },
  },

  tank: {
    id: 'tank',
    title: 'Tank',
    description: 'Take 1000 damage without dying',
    category: 'combat',
    rarity: 'rare',
    requirement: {
      type: 'damage_taken',
      value: 1000,
    },
  },

  glass_cannon: {
    id: 'glass_cannon',
    title: 'Glass Cannon',
    description: 'Deal 5000 damage with less than 50% health',
    category: 'combat',
    rarity: 'epic',
    requirement: {
      type: 'low_health_damage',
      value: 5000,
    },
  },

  social_butterfly: {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Talk to 10 different NPCs',
    category: 'quests',
    rarity: 'common',
    requirement: {
      type: 'npcs_talked',
      value: 10,
    },
  },

  treasure_hunter: {
    id: 'treasure_hunter',
    title: 'Treasure Hunter',
    description: 'Open 20 treasure chests',
    category: 'exploration',
    rarity: 'rare',
    requirement: {
      type: 'chests_opened',
      value: 20,
    },
  },

  architect: {
    id: 'architect',
    title: 'Architect',
    description: 'Build 50 structures',
    category: 'crafting',
    rarity: 'rare',
    requirement: {
      type: 'structures_built',
      value: 50,
    },
  },

  road_warrior: {
    id: 'road_warrior',
    title: 'Road Warrior',
    description: 'Drive 10 kilometers in a vehicle',
    category: 'exploration',
    rarity: 'rare',
    requirement: {
      type: 'distance_driven',
      value: 10000, // meters
    },
  },

  boss_slayer: {
    id: 'boss_slayer',
    title: 'Boss Slayer',
    description: 'Defeat a dungeon boss',
    category: 'combat',
    rarity: 'epic',
    requirement: {
      type: 'bosses_defeated',
      value: 1,
    },
  },

  completionist: {
    id: 'completionist',
    title: 'Completionist',
    description: 'Unlock all skills in the skill tree',
    category: 'skills',
    rarity: 'legendary',
    requirement: {
      type: 'all_skills',
      value: 15,
    },
  },
}

export function getAchievement(achievementId: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS[achievementId]
}

export function getAllAchievements(): AchievementDefinition[] {
  return Object.values(ACHIEVEMENTS)
}

export function getAchievementsByCategory(category: string): AchievementDefinition[] {
  return Object.values(ACHIEVEMENTS).filter((achievement) => achievement.category === category)
}
