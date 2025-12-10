import { hash } from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from './index'
import { inventory, playerQuests, playerSkills, players } from './schema'

// Seed data definitions
const STARTER_ITEMS = [
  { itemId: 'wooden_sword', quantity: 1, slotIndex: 0, equipped: true },
  { itemId: 'health_potion', quantity: 3, slotIndex: 1, equipped: false },
  { itemId: 'wood', quantity: 10, slotIndex: 2, equipped: false },
  { itemId: 'stone', quantity: 5, slotIndex: 3, equipped: false },
]

const STARTER_QUESTS = [
  {
    questId: 'tutorial_first_enemy',
    title: 'First Blood',
    status: 'active' as const,
    objectives: [
      { id: 'kill_zombie', type: 'kill' as const, target: 'zombie', current: 0, required: 1 },
    ],
  },
  {
    questId: 'gather_resources',
    title: 'Gather Resources',
    status: 'active' as const,
    objectives: [
      { id: 'collect_wood', type: 'collect' as const, target: 'wood', current: 0, required: 10 },
      { id: 'collect_stone', type: 'collect' as const, target: 'stone', current: 0, required: 5 },
    ],
  },
]

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Check if test player already exists
    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.username, 'testplayer'),
    })

    if (existingPlayer) {
      console.log('⚠️  Test player already exists, skipping seed')
      return
    }

    // Create test player
    console.log('Creating test player...')
    const passwordHash = await hash('password123', 10)

    const [testPlayer] = await db
      .insert(players)
      .values({
        username: 'testplayer',
        email: 'test@voxelwarfare.com',
        passwordHash,
        positionX: 0,
        positionY: 50,
        positionZ: 0,
        health: 100,
        maxHealth: 100,
        stamina: 100,
        level: 1,
        experience: 0,
        skillPoints: 0,
      })
      .returning()

    console.log('✅ Created test player:', testPlayer.username)

    // Add starter items to inventory
    console.log('Adding starter items...')
    const inventoryItems = STARTER_ITEMS.map((item) => ({
      playerId: testPlayer.id,
      ...item,
    }))

    await db.insert(inventory).values(inventoryItems)
    console.log(`✅ Added ${inventoryItems.length} starter items`)

    // Add starter quests
    console.log('Adding starter quests...')
    const questsToInsert = STARTER_QUESTS.map((quest) => ({
      playerId: testPlayer.id,
      questId: quest.questId,
      status: quest.status,
      objectives: quest.objectives,
    }))

    await db.insert(playerQuests).values(questsToInsert)
    console.log(`✅ Added ${questsToInsert.length} starter quests`)

    // Add starter skills (unlock a few basic ones)
    console.log('Adding starter skills...')
    const starterSkills = [
      { playerId: testPlayer.id, skillId: 'combat_strength', level: 1 },
      { playerId: testPlayer.id, skillId: 'mobility_speed', level: 1 },
    ]

    await db.insert(playerSkills).values(starterSkills)
    console.log(`✅ Added ${starterSkills.length} starter skills`)

    console.log('🎉 Database seeding complete!')
    console.log('\nTest Account Credentials:')
    console.log('  Username: testplayer')
    console.log('  Email: test@voxelwarfare.com')
    console.log('  Password: password123')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Run seed if called directly
if (import.meta.main) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seed }
