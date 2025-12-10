import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { db } from './index'
import {
  inventory,
  playerAchievements,
  playerQuests,
  playerSkills,
  players,
  worldObjects,
} from './schema'

// ==================== PLAYER QUERIES ====================

export async function getPlayerById(playerId: string) {
  return await db.query.players.findFirst({
    where: eq(players.id, playerId),
  })
}

export async function getPlayerByUsername(username: string) {
  return await db.query.players.findFirst({
    where: eq(players.username, username),
  })
}

export async function getPlayerByEmail(email: string) {
  return await db.query.players.findFirst({
    where: eq(players.email, email),
  })
}

export async function getPlayerWithInventory(playerId: string) {
  return await db.query.players.findFirst({
    where: eq(players.id, playerId),
    with: {
      inventory: true,
    },
  })
}

export async function getPlayerFull(playerId: string) {
  return await db.query.players.findFirst({
    where: eq(players.id, playerId),
    with: {
      inventory: true,
      skills: true,
      quests: true,
      achievements: true,
    },
  })
}

export async function updatePlayerPosition(
  playerId: string,
  position: { x: number; y: number; z: number },
  rotation?: { x: number; y: number; z: number },
) {
  const updates: Record<string, number> = {
    positionX: position.x,
    positionY: position.y,
    positionZ: position.z,
  }

  if (rotation) {
    updates.rotationX = rotation.x
    updates.rotationY = rotation.y
    updates.rotationZ = rotation.z
  }

  return await db.update(players).set(updates).where(eq(players.id, playerId)).returning()
}

export async function updatePlayerStats(
  playerId: string,
  stats: Partial<{
    health: number
    stamina: number
    level: number
    experience: number
    skillPoints: number
  }>,
) {
  return await db.update(players).set(stats).where(eq(players.id, playerId)).returning()
}

export async function getTopPlayersByLevel(limit = 10) {
  return await db.query.players.findMany({
    orderBy: [desc(players.level), desc(players.experience)],
    limit,
    columns: {
      id: true,
      username: true,
      level: true,
      experience: true,
    },
  })
}

// ==================== INVENTORY QUERIES ====================

export async function getPlayerInventory(playerId: string) {
  return await db.query.inventory.findMany({
    where: eq(inventory.playerId, playerId),
  })
}

export async function addItemToInventory(
  playerId: string,
  itemId: string,
  quantity = 1,
  slotIndex?: number,
  metadata?: Record<string, unknown>,
) {
  return await db
    .insert(inventory)
    .values({
      playerId,
      itemId,
      quantity,
      slotIndex,
      metadata,
    })
    .returning()
}

export async function removeItemFromInventory(inventoryId: string) {
  return await db.delete(inventory).where(eq(inventory.id, inventoryId)).returning()
}

export async function updateInventoryItemQuantity(inventoryId: string, quantity: number) {
  return await db
    .update(inventory)
    .set({ quantity })
    .where(eq(inventory.id, inventoryId))
    .returning()
}

export async function getEquippedItems(playerId: string) {
  return await db.query.inventory.findMany({
    where: and(eq(inventory.playerId, playerId), eq(inventory.equipped, true)),
  })
}

// ==================== QUEST QUERIES ====================

export async function getPlayerQuests(playerId: string, status?: string) {
  return await db.query.playerQuests.findMany({
    where: status
      ? and(eq(playerQuests.playerId, playerId), eq(playerQuests.status, status))
      : eq(playerQuests.playerId, playerId),
  })
}

export async function addQuestToPlayer(
  playerId: string,
  questId: string,
  objectives: Array<{
    id: string
    type: 'kill' | 'collect' | 'interact' | 'reach'
    target: string
    current: number
    required: number
  }>,
) {
  return await db
    .insert(playerQuests)
    .values({
      playerId,
      questId,
      status: 'active',
      objectives,
    })
    .returning()
}

export async function updateQuestProgress(
  questId: string,
  objectives: Array<Record<string, unknown>>,
) {
  return await db
    .update(playerQuests)
    .set({ objectives })
    .where(eq(playerQuests.id, questId))
    .returning()
}

export async function completeQuest(questId: string) {
  return await db
    .update(playerQuests)
    .set({
      status: 'completed',
      completedAt: new Date(),
    })
    .where(eq(playerQuests.id, questId))
    .returning()
}

// ==================== SKILL QUERIES ====================

export async function getPlayerSkills(playerId: string) {
  return await db.query.playerSkills.findMany({
    where: eq(playerSkills.playerId, playerId),
  })
}

export async function unlockSkill(playerId: string, skillId: string, level = 1) {
  return await db
    .insert(playerSkills)
    .values({
      playerId,
      skillId,
      level,
    })
    .returning()
}

export async function upgradeSkill(playerId: string, skillId: string) {
  const skill = await db.query.playerSkills.findFirst({
    where: and(eq(playerSkills.playerId, playerId), eq(playerSkills.skillId, skillId)),
  })

  if (!skill) {
    throw new Error('Skill not found')
  }

  return await db
    .update(playerSkills)
    .set({ level: skill.level + 1 })
    .where(and(eq(playerSkills.playerId, playerId), eq(playerSkills.skillId, skillId)))
    .returning()
}

// ==================== ACHIEVEMENT QUERIES ====================

export async function getPlayerAchievements(playerId: string) {
  return await db.query.playerAchievements.findMany({
    where: eq(playerAchievements.playerId, playerId),
  })
}

export async function unlockAchievement(playerId: string, achievementId: string) {
  return await db
    .insert(playerAchievements)
    .values({
      playerId,
      achievementId,
    })
    .returning()
}

export async function hasAchievement(playerId: string, achievementId: string): Promise<boolean> {
  const achievement = await db.query.playerAchievements.findFirst({
    where: and(
      eq(playerAchievements.playerId, playerId),
      eq(playerAchievements.achievementId, achievementId),
    ),
  })

  return !!achievement
}

// ==================== WORLD OBJECT QUERIES ====================

export async function getWorldObjectsInChunk(chunkX: number, chunkZ: number) {
  return await db.query.worldObjects.findMany({
    where: and(eq(worldObjects.chunkX, chunkX), eq(worldObjects.chunkZ, chunkZ)),
  })
}

export async function getWorldObjectsNearby(chunkX: number, chunkZ: number, radius = 1) {
  return await db.query.worldObjects.findMany({
    where: and(
      gte(worldObjects.chunkX, chunkX - radius),
      lte(worldObjects.chunkX, chunkX + radius),
      gte(worldObjects.chunkZ, chunkZ - radius),
      lte(worldObjects.chunkZ, chunkZ + radius),
    ),
  })
}

export async function createWorldObject(
  chunkX: number,
  chunkZ: number,
  type: string,
  position: { x: number; y: number; z: number },
  rotation?: { x: number; y: number; z: number },
  data?: Record<string, unknown>,
  ownerId?: string,
) {
  return await db
    .insert(worldObjects)
    .values({
      chunkX,
      chunkZ,
      type,
      positionX: position.x,
      positionY: position.y,
      positionZ: position.z,
      rotation,
      data,
      ownerId,
    })
    .returning()
}

export async function deleteWorldObject(objectId: string) {
  return await db.delete(worldObjects).where(eq(worldObjects.id, objectId)).returning()
}
