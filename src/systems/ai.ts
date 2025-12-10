import { Vector3 } from 'three'
import { useEnemyStore } from '../stores/enemyStore'
import { usePlayerStore } from '../stores/playerStore'
import type { EnemyData } from '../types/enemy'
import { AIState } from '../types/enemy'

/**
 * AI System - Manages enemy behavior and state transitions
 */

export class EnemyAI {
  private enemy: EnemyData
  private playerPosition: Vector3 | null = null

  constructor(enemy: EnemyData) {
    this.enemy = enemy
  }

  update(delta: number): EnemyData {
    // Dead enemies don't update
    if (this.enemy.state === AIState.DEAD) {
      return this.enemy
    }

    // Get player position
    this.playerPosition = usePlayerStore.getState().position

    // Update attack cooldown
    if (this.enemy.attackCooldown > 0) {
      this.enemy.attackCooldown -= delta
    }

    // Update alert timer
    if (this.enemy.alertTime > 0) {
      this.enemy.alertTime -= delta
    }

    // Execute current state behavior
    switch (this.enemy.state) {
      case AIState.IDLE:
        this.idle(delta)
        break
      case AIState.PATROL:
        this.patrol(delta)
        break
      case AIState.ALERT:
        this.alert(delta)
        break
      case AIState.CHASE:
        this.chase(delta)
        break
      case AIState.ATTACK:
        this.attack(delta)
        break
      case AIState.FLEE:
        this.flee(delta)
        break
    }

    return this.enemy
  }

  private idle(_delta: number) {
    // Transition to patrol after short delay
    this.transitionToState(AIState.PATROL)
    this.checkForPlayer()
  }

  private patrol(delta: number) {
    // Move to current patrol point
    const targetPoint = this.enemy.patrolPoints[this.enemy.currentPatrolIndex]
    const distance = this.enemy.position.distanceTo(targetPoint)

    if (distance < 1) {
      // Reached patrol point, move to next
      this.enemy.currentPatrolIndex =
        (this.enemy.currentPatrolIndex + 1) % this.enemy.patrolPoints.length
    } else {
      // Move towards patrol point
      this.moveTowards(targetPoint, delta, this.enemy.stats.speed * 0.5) // Half speed during patrol
    }

    // Check if player is nearby
    this.checkForPlayer()
  }

  private alert(_delta: number) {
    // Alert state - enemy noticed player, looking around
    this.enemy.alertTime = 1.0 // 1 second alert

    if (this.playerPosition) {
      const distance = this.enemy.position.distanceTo(this.playerPosition)

      if (distance < this.enemy.stats.detectionRange) {
        // Transition to chase
        this.transitionToState(AIState.CHASE)
      }
    }

    // Alert time expired without finding player
    if (this.enemy.alertTime <= 0) {
      this.transitionToState(AIState.PATROL)
    }
  }

  private chase(delta: number) {
    if (!this.playerPosition) {
      this.transitionToState(AIState.PATROL)
      return
    }

    const distance = this.enemy.position.distanceTo(this.playerPosition)

    // Check if should flee (low health)
    if (this.enemy.stats.health < this.enemy.stats.maxHealth * 0.2) {
      this.transitionToState(AIState.FLEE)
      return
    }

    // In attack range?
    if (distance <= this.enemy.stats.attackRange) {
      this.transitionToState(AIState.ATTACK)
      return
    }

    // Lost player? (too far or out of detection range)
    if (distance > this.enemy.stats.detectionRange * 1.5) {
      this.enemy.target = null
      this.transitionToState(AIState.PATROL)
      return
    }

    // Move towards player
    this.moveTowards(this.playerPosition, delta, this.enemy.stats.speed)
  }

  private attack(_delta: number) {
    if (!this.playerPosition) {
      this.transitionToState(AIState.PATROL)
      return
    }

    const distance = this.enemy.position.distanceTo(this.playerPosition)

    // Out of attack range? (use 1.1x multiplier for small buffer)
    if (distance > this.enemy.stats.attackRange * 1.1) {
      this.transitionToState(AIState.CHASE)
      return
    }

    // Check if should flee
    if (this.enemy.stats.health < this.enemy.stats.maxHealth * 0.2) {
      this.transitionToState(AIState.FLEE)
      return
    }

    // Face player
    const direction = new Vector3().subVectors(this.playerPosition, this.enemy.position).normalize()
    this.enemy.rotation = Math.atan2(direction.x, direction.z)

    // Perform attack if cooldown ready
    if (this.enemy.attackCooldown <= 0) {
      this.performAttack()
      this.enemy.attackCooldown = 1 / this.enemy.stats.attackSpeed
    }
  }

  private flee(delta: number) {
    if (!this.playerPosition) {
      this.transitionToState(AIState.PATROL)
      return
    }

    // Run away from player
    const fleeDirection = new Vector3()
      .subVectors(this.enemy.position, this.playerPosition)
      .normalize()

    const fleeTarget = this.enemy.position.clone().add(fleeDirection.multiplyScalar(10))

    this.moveTowards(fleeTarget, delta, this.enemy.stats.speed * 1.5) // 50% faster when fleeing

    // Safe distance reached or health recovered?
    const distance = this.enemy.position.distanceTo(this.playerPosition)
    if (
      distance > this.enemy.stats.detectionRange * 2 ||
      this.enemy.stats.health > this.enemy.stats.maxHealth * 0.5
    ) {
      this.transitionToState(AIState.PATROL)
    }
  }

  private checkForPlayer() {
    if (!this.playerPosition) return

    const distance = this.enemy.position.distanceTo(this.playerPosition)

    // Player in detection range?
    if (distance < this.enemy.stats.detectionRange) {
      // Check line of sight (simplified - just check distance for now)
      this.enemy.target = 'player'
      this.transitionToState(AIState.ALERT)
    }
  }

  private moveTowards(target: Vector3, delta: number, speed: number) {
    const direction = new Vector3().subVectors(target, this.enemy.position).normalize()

    // Update position
    const movement = direction.multiplyScalar(speed * delta)
    this.enemy.position.add(movement)

    // Update rotation to face movement direction
    if (direction.length() > 0.01) {
      this.enemy.rotation = Math.atan2(direction.x, direction.z)
    }
  }

  private performAttack() {
    // Verify player is still in attack range before dealing damage
    if (!this.playerPosition) return

    const distance = this.enemy.position.distanceTo(this.playerPosition)
    if (distance > this.enemy.stats.attackRange) {
      console.log(
        `⚠️ ${this.enemy.type} attack missed - player out of range (${distance.toFixed(1)}m > ${this.enemy.stats.attackRange}m)`,
      )
      return
    }

    // Deal damage to player
    const { takeDamage } = usePlayerStore.getState()
    takeDamage(this.enemy.stats.damage)

    console.log(
      `⚔️ ${this.enemy.type} attacks player for ${this.enemy.stats.damage} damage! (distance: ${distance.toFixed(1)}m)`,
    )
  }

  private transitionToState(newState: AIState) {
    if (this.enemy.state === newState) return

    console.log(`🔄 ${this.enemy.type} ${this.enemy.state} → ${newState}`)
    this.enemy.state = newState

    // State entry logic
    switch (newState) {
      case AIState.ALERT:
        this.enemy.alertTime = 1.0
        break
      case AIState.CHASE:
        this.enemy.target = 'player'
        break
      case AIState.PATROL:
        this.enemy.target = null
        break
    }
  }
}

/**
 * Check if enemy hit by weapon raycast
 */
export function checkEnemyHit(
  rayOrigin: Vector3,
  rayDirection: Vector3,
  maxDistance: number,
): { enemyId: string; distance: number } | null {
  const enemies = useEnemyStore.getState().enemies

  let closestHit: { enemyId: string; distance: number } | null = null
  let closestDistance = Number.POSITIVE_INFINITY

  console.log(`🔍 Checking melee hit - rayOrigin:`, rayOrigin, 'maxDistance:', maxDistance)
  console.log(`🔍 Enemies to check:`, enemies.size)

  enemies.forEach((enemy, id) => {
    if (enemy.state === AIState.DEAD) return

    // Simple sphere collision check (enemy hitbox radius = 1m)
    const enemyRadius = 1
    const toEnemy = new Vector3().subVectors(enemy.position, rayOrigin)
    const projectionLength = toEnemy.dot(rayDirection)

    // Debug each enemy check
    const distanceToEnemy = rayOrigin.distanceTo(enemy.position)
    console.log(
      `  🎯 Enemy ${id}: distance=${distanceToEnemy.toFixed(2)}m, projection=${projectionLength.toFixed(2)}m`,
    )

    // Enemy behind ray origin
    if (projectionLength < 0) {
      console.log(`    ❌ Behind camera`)
      return
    }

    // Enemy too far
    if (projectionLength > maxDistance) {
      console.log(`    ❌ Too far (>${maxDistance}m)`)
      return
    }

    const closestPoint = rayOrigin
      .clone()
      .add(rayDirection.clone().multiplyScalar(projectionLength))
    const distanceToRay = closestPoint.distanceTo(enemy.position)

    console.log(`    📏 Distance to ray: ${distanceToRay.toFixed(2)}m (hitbox: ${enemyRadius}m)`)

    if (distanceToRay <= enemyRadius && projectionLength < closestDistance) {
      console.log(`    ✅ HIT!`)
      closestDistance = projectionLength
      closestHit = { enemyId: id, distance: projectionLength }
    }
  })

  if (!closestHit) {
    console.log(`❌ No hits detected`)
  }

  return closestHit
}
