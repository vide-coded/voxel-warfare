// Quest definitions
export interface QuestDefinition {
  id: string
  title: string
  description: string
  giver: string // NPC id
  level: number // Required player level
  objectives: Array<{
    id: string
    type: 'kill' | 'collect' | 'interact' | 'reach'
    description: string
    target: string
    required: number
  }>
  rewards: {
    experience: number
    items?: Array<{ itemId: string; quantity: number }>
    gold?: number
  }
  prerequisites?: string[] // Quest IDs that must be completed first
}

export const QUESTS: Record<string, QuestDefinition> = {
  tutorial_first_enemy: {
    id: 'tutorial_first_enemy',
    title: 'First Blood',
    description: 'Defeat your first enemy to prove your combat skills',
    giver: 'village_elder',
    level: 1,
    objectives: [
      {
        id: 'kill_zombie',
        type: 'kill',
        description: 'Defeat a zombie',
        target: 'zombie',
        required: 1,
      },
    ],
    rewards: {
      experience: 100,
      items: [{ itemId: 'health_potion', quantity: 2 }],
      gold: 10,
    },
  },

  gather_resources: {
    id: 'gather_resources',
    title: 'Gather Resources',
    description: 'Collect basic materials needed for crafting',
    giver: 'village_elder',
    level: 1,
    objectives: [
      {
        id: 'collect_wood',
        type: 'collect',
        description: 'Collect wood',
        target: 'wood',
        required: 10,
      },
      {
        id: 'collect_stone',
        type: 'collect',
        description: 'Collect stone',
        target: 'stone',
        required: 5,
      },
    ],
    rewards: {
      experience: 50,
      items: [{ itemId: 'stone_axe', quantity: 1 }],
    },
    prerequisites: ['tutorial_first_enemy'],
  },

  craft_first_weapon: {
    id: 'craft_first_weapon',
    title: 'Your First Weapon',
    description: 'Learn the basics of crafting by creating a weapon',
    giver: 'blacksmith',
    level: 2,
    objectives: [
      {
        id: 'craft_sword',
        type: 'interact',
        description: 'Craft a sword at the workbench',
        target: 'workbench',
        required: 1,
      },
    ],
    rewards: {
      experience: 150,
      items: [{ itemId: 'iron', quantity: 5 }],
      gold: 25,
    },
    prerequisites: ['gather_resources'],
  },

  explore_dungeon: {
    id: 'explore_dungeon',
    title: 'Into the Depths',
    description: 'Enter and complete your first dungeon',
    giver: 'adventurer',
    level: 5,
    objectives: [
      {
        id: 'complete_dungeon',
        type: 'reach',
        description: 'Complete a dungeon',
        target: 'dungeon_exit',
        required: 1,
      },
    ],
    rewards: {
      experience: 500,
      items: [
        { itemId: 'iron_sword', quantity: 1 },
        { itemId: 'health_potion', quantity: 5 },
      ],
      gold: 100,
    },
  },

  bandit_threat: {
    id: 'bandit_threat',
    title: 'Bandit Threat',
    description: 'Clear out the bandit camp threatening the village',
    giver: 'village_elder',
    level: 3,
    objectives: [
      {
        id: 'kill_bandits',
        type: 'kill',
        description: 'Defeat bandits',
        target: 'bandit',
        required: 5,
      },
    ],
    rewards: {
      experience: 300,
      gold: 50,
    },
  },
}

export function getQuest(questId: string): QuestDefinition | undefined {
  return QUESTS[questId]
}

export function getAllQuests(): QuestDefinition[] {
  return Object.values(QUESTS)
}

export function getQuestsForLevel(level: number): QuestDefinition[] {
  return Object.values(QUESTS).filter((quest) => quest.level <= level)
}
