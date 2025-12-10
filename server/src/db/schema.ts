import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

// ==================== PLAYERS TABLE ====================
export const players = pgTable(
  'players',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),

    // Position & rotation
    positionX: real('position_x').default(0),
    positionY: real('position_y').default(50),
    positionZ: real('position_z').default(0),
    rotationX: real('rotation_x').default(0),
    rotationY: real('rotation_y').default(0),
    rotationZ: real('rotation_z').default(0),

    // Stats
    health: integer('health').default(100),
    maxHealth: integer('max_health').default(100),
    stamina: integer('stamina').default(100),
    level: integer('level').default(1),
    experience: integer('experience').default(0),
    skillPoints: integer('skill_points').default(0),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow(),
    lastLogin: timestamp('last_login').defaultNow(),
  },
  (table) => ({
    usernameIdx: index('username_idx').on(table.username),
    emailIdx: index('email_idx').on(table.email),
    levelIdx: index('level_idx').on(table.level),
  }),
)

// ==================== INVENTORY TABLE ====================
export const inventory = pgTable(
  'inventory',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    playerId: uuid('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    itemId: varchar('item_id', { length: 100 }).notNull(),
    quantity: integer('quantity').default(1),
    slotIndex: integer('slot_index'),
    equipped: boolean('equipped').default(false),
    metadata: jsonb('metadata').$type<{
      durability?: number
      ammo?: number
      maxAmmo?: number
      enchantments?: string[]
      customName?: string
    }>(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    playerIdx: index('inventory_player_idx').on(table.playerId),
    itemIdx: index('inventory_item_idx').on(table.itemId),
    equippedIdx: index('inventory_equipped_idx').on(table.equipped),
  }),
)

// ==================== PLAYER SKILLS TABLE ====================
export const playerSkills = pgTable(
  'player_skills',
  {
    playerId: uuid('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    skillId: varchar('skill_id', { length: 100 }).notNull(),
    level: integer('level').default(0),
    unlockedAt: timestamp('unlocked_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.skillId] }),
    playerIdx: index('player_skills_player_idx').on(table.playerId),
  }),
)

// ==================== PLAYER QUESTS TABLE ====================
export const playerQuests = pgTable(
  'player_quests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    playerId: uuid('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    questId: varchar('quest_id', { length: 100 }).notNull(),
    status: varchar('status', { length: 20 }).default('active'), // active, completed, failed
    objectives:
      jsonb('objectives').$type<
        Array<{
          id: string
          type: 'kill' | 'collect' | 'interact' | 'reach'
          target: string
          current: number
          required: number
        }>
      >(),
    startedAt: timestamp('started_at').defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    playerIdx: index('player_quests_player_idx').on(table.playerId),
    statusIdx: index('player_quests_status_idx').on(table.status),
    questIdx: index('player_quests_quest_idx').on(table.questId),
  }),
)

// ==================== WORLD OBJECTS TABLE ====================
export const worldObjects = pgTable(
  'world_objects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    chunkX: integer('chunk_x').notNull(),
    chunkZ: integer('chunk_z').notNull(),
    type: varchar('type', { length: 50 }).notNull(), // building, vehicle, item_drop
    positionX: real('position_x').notNull(),
    positionY: real('position_y').notNull(),
    positionZ: real('position_z').notNull(),
    rotation: jsonb('rotation').$type<{
      x: number
      y: number
      z: number
    }>(),
    data: jsonb('data').$type<Record<string, any>>(), // Object-specific data
    ownerId: uuid('owner_id').references(() => players.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    chunkIdx: index('world_objects_chunk_idx').on(table.chunkX, table.chunkZ),
    ownerIdx: index('world_objects_owner_idx').on(table.ownerId),
    typeIdx: index('world_objects_type_idx').on(table.type),
  }),
)

// ==================== PLAYER ACHIEVEMENTS TABLE ====================
export const playerAchievements = pgTable(
  'player_achievements',
  {
    playerId: uuid('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    achievementId: varchar('achievement_id', { length: 100 }).notNull(),
    unlockedAt: timestamp('unlocked_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.achievementId] }),
    playerIdx: index('player_achievements_player_idx').on(table.playerId),
  }),
)

// ==================== SESSIONS TABLE ====================
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    playerId: uuid('player_id')
      .references(() => players.id, { onDelete: 'cascade' })
      .notNull(),
    token: varchar('token', { length: 500 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    tokenIdx: index('sessions_token_idx').on(table.token),
    playerIdx: index('sessions_player_idx').on(table.playerId),
    expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
  }),
)

// ==================== RELATIONS ====================
export const playersRelations = relations(players, ({ many }) => ({
  inventory: many(inventory),
  skills: many(playerSkills),
  quests: many(playerQuests),
  worldObjects: many(worldObjects),
  achievements: many(playerAchievements),
  sessions: many(sessions),
}))

export const inventoryRelations = relations(inventory, ({ one }) => ({
  player: one(players, {
    fields: [inventory.playerId],
    references: [players.id],
  }),
}))

export const playerSkillsRelations = relations(playerSkills, ({ one }) => ({
  player: one(players, {
    fields: [playerSkills.playerId],
    references: [players.id],
  }),
}))

export const playerQuestsRelations = relations(playerQuests, ({ one }) => ({
  player: one(players, {
    fields: [playerQuests.playerId],
    references: [players.id],
  }),
}))

export const worldObjectsRelations = relations(worldObjects, ({ one }) => ({
  owner: one(players, {
    fields: [worldObjects.ownerId],
    references: [players.id],
  }),
}))

export const playerAchievementsRelations = relations(playerAchievements, ({ one }) => ({
  player: one(players, {
    fields: [playerAchievements.playerId],
    references: [players.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  player: one(players, {
    fields: [sessions.playerId],
    references: [players.id],
  }),
}))

// ==================== TYPE EXPORTS ====================
export type Player = typeof players.$inferSelect
export type NewPlayer = typeof players.$inferInsert
export type InventoryItem = typeof inventory.$inferSelect
export type NewInventoryItem = typeof inventory.$inferInsert
export type PlayerSkill = typeof playerSkills.$inferSelect
export type NewPlayerSkill = typeof playerSkills.$inferInsert
export type PlayerQuest = typeof playerQuests.$inferSelect
export type NewPlayerQuest = typeof playerQuests.$inferInsert
export type WorldObject = typeof worldObjects.$inferSelect
export type NewWorldObject = typeof worldObjects.$inferInsert
export type PlayerAchievement = typeof playerAchievements.$inferSelect
export type NewPlayerAchievement = typeof playerAchievements.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
