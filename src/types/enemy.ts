import type { Vector3 } from 'three'

export enum EnemyType {
  ZOMBIE = 'zombie',
  BANDIT = 'bandit',
}

export enum AIState {
  IDLE = 'idle',
  PATROL = 'patrol',
  ALERT = 'alert',
  CHASE = 'chase',
  ATTACK = 'attack',
  FLEE = 'flee',
  DEAD = 'dead',
}

export interface EnemyStats {
  health: number
  maxHealth: number
  speed: number
  damage: number
  attackRange: number
  detectionRange: number
  attackSpeed: number // attacks per second
  defense: number
}

export interface EnemyData {
  id: string
  type: EnemyType
  position: Vector3
  rotation: number
  stats: EnemyStats
  state: AIState
  target: string | null // player id
  patrolPoints: Vector3[]
  currentPatrolIndex: number
  attackCooldown: number
  alertTime: number
  lastDamageTime: number
  respawnTime: number
}

export const ENEMY_CONFIGS: Record<EnemyType, Omit<EnemyStats, 'health'>> = {
  [EnemyType.ZOMBIE]: {
    maxHealth: 100,
    speed: 3,
    damage: 15,
    attackRange: 2, // Melee range - must get close
    detectionRange: 15,
    attackSpeed: 0.8, // 0.8 attacks per second (1.25s cooldown)
    defense: 5,
  },
  [EnemyType.BANDIT]: {
    maxHealth: 80,
    speed: 4,
    damage: 8, // Lower damage since they're ranged
    attackRange: 5, // Medium range - can shoot from distance but not too far
    detectionRange: 18,
    attackSpeed: 1.0, // 1.0 attacks per second (1s cooldown)
    defense: 3,
  },
}

export interface DamageEvent {
  enemyId: string
  damage: number
  isCritical: boolean
  position: Vector3
}
