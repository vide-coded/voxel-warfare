import { Vector3 } from 'three'
import { create } from 'zustand'
import type { DamageEvent, EnemyData, EnemyType } from '../types/enemy'
import { AIState, ENEMY_CONFIGS } from '../types/enemy'

interface EnemyStore {
  enemies: Map<string, EnemyData>
  damageEvents: DamageEvent[]

  // Actions
  spawnEnemy: (type: EnemyType, position: Vector3) => string
  removeEnemy: (id: string) => void
  updateEnemy: (id: string, updates: Partial<EnemyData>) => void
  damageEnemy: (id: string, damage: number, isCritical?: boolean) => void
  updateEnemyState: (id: string, state: AIState) => void
  clearDamageEvents: () => void
  respawnEnemy: (id: string) => void
}

let enemyIdCounter = 0

export const useEnemyStore = create<EnemyStore>((set, get) => ({
  enemies: new Map(),
  damageEvents: [],

  spawnEnemy: (type, position) => {
    const id = `enemy-${type}-${++enemyIdCounter}`
    const config = ENEMY_CONFIGS[type]

    // Generate patrol points in a circle around spawn position
    const patrolPoints: Vector3[] = []
    const patrolRadius = 10
    const numPoints = 4

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      const x = position.x + Math.cos(angle) * patrolRadius
      const z = position.z + Math.sin(angle) * patrolRadius
      patrolPoints.push(new Vector3(x, position.y, z))
    }

    const enemy: EnemyData = {
      id,
      type,
      position: position.clone(),
      rotation: 0,
      stats: {
        health: config.maxHealth,
        maxHealth: config.maxHealth,
        speed: config.speed,
        damage: config.damage,
        attackRange: config.attackRange,
        detectionRange: config.detectionRange,
        attackSpeed: config.attackSpeed,
        defense: config.defense,
      },
      state: AIState.PATROL,
      target: null,
      patrolPoints,
      currentPatrolIndex: 0,
      attackCooldown: 0,
      alertTime: 0,
      lastDamageTime: 0,
      respawnTime: 0,
    }

    set((state) => {
      const newEnemies = new Map(state.enemies)
      newEnemies.set(id, enemy)
      return { enemies: newEnemies }
    })

    console.log(`👾 Spawned ${type} at`, position)
    return id
  },

  removeEnemy: (id) => {
    set((state) => {
      const newEnemies = new Map(state.enemies)
      newEnemies.delete(id)
      return { enemies: newEnemies }
    })
  },

  updateEnemy: (id, updates) => {
    set((state) => {
      const enemy = state.enemies.get(id)
      if (!enemy) return state

      const newEnemies = new Map(state.enemies)
      newEnemies.set(id, { ...enemy, ...updates })
      return { enemies: newEnemies }
    })
  },

  damageEnemy: (id, damage, isCritical = false) => {
    const enemy = get().enemies.get(id)
    if (!enemy || enemy.state === AIState.DEAD) return

    // Apply defense reduction
    const defense = enemy.stats.defense
    const damageReduction = defense / (defense + 100)
    const finalDamage = Math.max(1, Math.floor(damage * (1 - damageReduction)))

    const newHealth = Math.max(0, enemy.stats.health - finalDamage)

    // Create damage event for visual feedback
    const damageEvent: DamageEvent = {
      enemyId: id,
      damage: finalDamage,
      isCritical,
      position: enemy.position.clone(),
    }

    set((state) => {
      const newEnemies = new Map(state.enemies)
      const updatedEnemy = state.enemies.get(id)
      if (!updatedEnemy) return state

      newEnemies.set(id, {
        ...updatedEnemy,
        stats: { ...updatedEnemy.stats, health: newHealth },
        lastDamageTime: Date.now(),
        state: newHealth <= 0 ? AIState.DEAD : updatedEnemy.state,
      })

      return {
        enemies: newEnemies,
        damageEvents: [...state.damageEvents, damageEvent],
      }
    })

    console.log(
      `💥 ${enemy.type} took ${finalDamage} damage${isCritical ? ' (CRIT!)' : ''} - ${newHealth}/${enemy.stats.maxHealth} HP`,
    )

    // Handle death
    if (newHealth <= 0) {
      console.log(`💀 ${enemy.type} died!`)
      // Schedule respawn
      setTimeout(() => {
        get().respawnEnemy(id)
      }, 30000) // 30 seconds
    }
  },

  updateEnemyState: (id, state) => {
    get().updateEnemy(id, { state })
  },

  clearDamageEvents: () => {
    set({ damageEvents: [] })
  },

  respawnEnemy: (id) => {
    const enemy = get().enemies.get(id)
    if (!enemy) return

    // Reset to spawn position (first patrol point)
    const spawnPosition = enemy.patrolPoints[0]

    set((state) => {
      const newEnemies = new Map(state.enemies)
      newEnemies.set(id, {
        ...enemy,
        position: spawnPosition.clone(),
        stats: {
          ...enemy.stats,
          health: enemy.stats.maxHealth,
        },
        state: AIState.PATROL,
        target: null,
        currentPatrolIndex: 0,
        attackCooldown: 0,
        alertTime: 0,
      })
      return { enemies: newEnemies }
    })

    console.log(`♻️ ${enemy.type} respawned at`, spawnPosition)
  },
}))
