# 🐛 Enemy Health Bar Not Updating - Bug Report

**Date**: November 23, 2025  
**Status**: 🔴 CRITICAL - Health bars frozen, breaking combat feedback  
**Affected System**: Enemy UI Health Bars

---

## 🎯 Problem Summary

Enemy health bars do not visually update when enemies take damage from either melee (sword) or ranged (pistol) attacks, despite damage being successfully applied to enemy stats in the Zustand store.

---

## 🔍 Symptoms

1. **Combat works mechanically**: Console logs confirm damage is being dealt
   - Example: `💥 bandit took 48 damage (CRIT!) - 32/80 HP`
   - Enemy health values in store are updating correctly
   
2. **UI doesn't reflect changes**: Health bars remain full (100%) visually
   - Green health bar stays at maximum width
   - No visual feedback when enemy is damaged
   - Health bar only updates when enemy dies (disappears)

3. **Both weapon types affected**:
   - Sword (melee): Damage applied, logs confirm hits, no visual update
   - Pistol (ranged): Damage applied, logs confirm hits, no visual update

---

## 📊 Evidence from Console Logs

```
🔍 Checking melee hit - rayOrigin: Vector3 {x: ..., y: ..., z: ...} maxDistance: 2
🔍 Enemies to check: 10
  🎯 Enemy enemy-bandit-5: distance=0.94m, projection=0.91m
    📏 Distance to ray: 0.25m (hitbox: 1m)
    ✅ HIT!
💥 bandit took 48 damage (CRIT!) - 32/80 HP  ← Store updated correctly
💥 Hit enemy for 50 damage (CRIT!) at 0.91m  ← Combat system working
```

**Key observation**: Damage is being calculated and stored, but the React component rendering the health bar doesn't re-render.

---

## 🏗️ Architecture Analysis

### Current Implementation

**File: `src/stores/enemyStore.ts`**
```typescript
damageEnemy: (id, damage, isCritical = false) => {
  // ... damage calculation ...
  
  set((state) => {
    const newEnemies = new Map(state.enemies)  // ← Creates new Map
    const updatedEnemy = state.enemies.get(id)
    
    newEnemies.set(id, {
      ...updatedEnemy,
      stats: { ...updatedEnemy.stats, health: newHealth },  // ← New object
      // ...
    })

    return { enemies: newEnemies }  // ← Returns new Map reference
  })
}
```

**File: `src/components/game/Enemy.tsx`**
```typescript
// Current subscriptions (attempted fix)
const enemyHealth = useEnemyStore((state) => 
  state.enemies.get(initialEnemy.id)?.stats.health ?? initialEnemy.stats.health
)
const enemyMaxHealth = useEnemyStore((state) => 
  state.enemies.get(initialEnemy.id)?.stats.maxHealth ?? initialEnemy.stats.maxHealth
)
const enemyState = useEnemyStore((state) => 
  state.enemies.get(initialEnemy.id)?.state ?? initialEnemy.state
)

// Health bar calculation
const healthPercent = (enemyHealth / enemyMaxHealth) * 100

// HTML rendering
<div
  className="h-full transition-all duration-200"
  style={{
    width: `${healthPercent}%`,  // ← Should change when enemyHealth changes
    backgroundColor: healthPercent > 50 ? '#22c55e' : ...
  }}
/>
```

---

## 🔬 Root Cause Hypothesis

### Theory 1: Zustand Selector Not Triggering Re-renders ⭐ MOST LIKELY

**Problem**: Zustand uses shallow equality checking by default. When we do:
```typescript
state.enemies.get(id)?.stats.health
```

Zustand compares the **entire selector result** using `Object.is()`. However:
- The `Map.get()` method returns a reference to the object
- Even though we create a new object in the store (`{ ...updatedEnemy, stats: { ... } }`), the selector might be accessing an old cached reference
- React Three Fiber's `useFrame` loop might be interfering with Zustand's subscription mechanism

**Evidence**:
- Console confirms store is updating correctly
- Multiple selector approaches tried without success
- Same issue affects all enemies across the map

### Theory 2: React Three Fiber Render Cycle

**Problem**: The `<Html>` component from `@react-three/drei` might not be syncing with Zustand updates properly within the R3F render loop.

**Evidence**:
- The `useFrame` hook updates AI logic 60 times per second
- Health bar is inside `<Html>` which bridges React DOM and Three.js canvas
- Potential race condition between `useFrame` updates and Zustand subscriptions

### Theory 3: Map Reference Equality

**Problem**: Even though we create `new Map(state.enemies)` in the store update, Zustand's equality check might not detect that the Map's contents changed.

**Evidence**:
- Using `Map.get()` in selectors
- Multiple enemies affected simultaneously
- No errors in console

---

## 🧪 Debugging Steps Taken

1. ✅ **Added debug logging**: Confirmed damage is being applied to store
2. ✅ **Verified combat system**: Both melee and ranged weapons hitting correctly
3. ✅ **Checked store updates**: `damageEnemy` function creates new objects correctly
4. ✅ **Updated component subscriptions**: Changed from single selector to multiple primitive value selectors
5. ❌ **Health bar still not updating**: Visual UI remains frozen

---

## 🛠️ Potential Solutions

### Solution A: Force Re-render with Version Counter ⭐ RECOMMENDED

Add a version/timestamp to each enemy that increments on any change:

```typescript
// In enemyStore.ts
interface EnemyData {
  // ... existing fields
  _version: number  // Add this
}

damageEnemy: (id, damage, isCritical = false) => {
  set((state) => {
    const newEnemies = new Map(state.enemies)
    const updatedEnemy = state.enemies.get(id)
    
    newEnemies.set(id, {
      ...updatedEnemy,
      stats: { ...updatedEnemy.stats, health: newHealth },
      _version: (updatedEnemy._version || 0) + 1,  // Increment
    })
    
    return { enemies: newEnemies }
  })
}

// In Enemy.tsx
const enemyVersion = useEnemyStore((state) => 
  state.enemies.get(initialEnemy.id)?._version ?? 0
)

useEffect(() => {
  // Force component to use latest enemy data
  // This will trigger when version changes
}, [enemyVersion])
```

**Pros**: Guaranteed to trigger re-renders  
**Cons**: Adds extra field to track

### Solution B: Use Separate Health Store

Create a dedicated store for just health values (flat structure, not Map):

```typescript
// healthStore.ts
interface HealthStore {
  healths: Record<string, { current: number; max: number }>
  updateHealth: (id: string, health: number) => void
}

export const useHealthStore = create<HealthStore>((set) => ({
  healths: {},
  updateHealth: (id, health) => set((state) => ({
    healths: { ...state.healths, [id]: { ...state.healths[id], current: health } }
  }))
}))

// In Enemy.tsx
const health = useHealthStore((state) => state.healths[initialEnemy.id])
const healthPercent = (health.current / health.max) * 100
```

**Pros**: Simpler equality checking, no Map  
**Cons**: Duplicates health data across stores

### Solution C: Use Zustand's `shallow` Comparator

Import and use shallow equality checking:

```typescript
import { shallow } from 'zustand/shallow'

const enemyStats = useEnemyStore(
  (state) => {
    const enemy = state.enemies.get(initialEnemy.id)
    return enemy ? { health: enemy.stats.health, maxHealth: enemy.stats.maxHealth } : null
  },
  shallow  // Compare object properties, not reference
)

const healthPercent = enemyStats ? (enemyStats.health / enemyStats.maxHealth) * 100 : 100
```

**Pros**: Proper deep comparison  
**Cons**: Might not work with Map.get()

### Solution D: Extract to Array Instead of Map

Change how enemies are stored in Scene.tsx:

```typescript
// Instead of Map in store, use array
const enemyList = useEnemyStore((state) => Array.from(state.enemies.values()))

{enemyList.map((enemy) => (
  <Enemy key={enemy.id} enemy={enemy} />
))}
```

Then in Enemy.tsx, use the prop directly and subscribe to specific values:

```typescript
export function Enemy({ enemy }: EnemyProps) {
  // enemy prop will change when array changes
  const healthPercent = (enemy.stats.health / enemy.stats.maxHealth) * 100
  // ...
}
```

**Pros**: React better at detecting array changes  
**Cons**: Might cause unnecessary re-renders of all enemies

### Solution E: Manual Subscription with `useEffect`

Subscribe manually to store changes:

```typescript
const [enemyData, setEnemyData] = useState(initialEnemy)

useEffect(() => {
  const unsubscribe = useEnemyStore.subscribe((state) => {
    const updated = state.enemies.get(initialEnemy.id)
    if (updated) {
      setEnemyData(updated)
    }
  })
  return unsubscribe
}, [initialEnemy.id])

const healthPercent = (enemyData.stats.health / enemyData.stats.maxHealth) * 100
```

**Pros**: Full control over when to update  
**Cons**: More verbose, uses local state

---

## 🎯 Recommended Action Plan

### Phase 1: Quick Fix (5 minutes)
Try **Solution C (shallow comparator)** first as it's the least invasive.

### Phase 2: If That Fails (15 minutes)
Implement **Solution A (version counter)** which guarantees re-renders.

### Phase 3: If Still Broken (30 minutes)
Consider **Solution D (array instead of Map)** for fundamental restructure.

---

## 📝 Testing Checklist

After implementing fix:
- [ ] Sword attack: Health bar decreases immediately
- [ ] Pistol attack: Health bar decreases immediately  
- [ ] Multiple enemies: Each updates independently
- [ ] Critical hits: Bar updates correctly
- [ ] Enemy death: Bar disappears (enemy removed)
- [ ] Enemy respawn: Bar resets to full
- [ ] Performance: No FPS drop from subscriptions

---

## 🔗 Related Files

- `src/stores/enemyStore.ts` - Enemy state management
- `src/components/game/Enemy.tsx` - Enemy rendering & health bar
- `src/systems/combat.ts` - Melee attack logic
- `src/components/game/Projectile.tsx` - Ranged attack logic
- `src/systems/ai.ts` - Enemy AI updates

---

## 💡 Additional Notes

- The combat system is **functionally working** - only UI feedback is broken
- This is a React re-render issue, not a game logic issue
- Zustand Map subscriptions are notoriously tricky in React Three Fiber
- Consider migrating to array-based enemy storage for better React compatibility

---

**Priority**: 🔴 HIGH - Combat feedback is essential for playability  
**Complexity**: 🟡 MEDIUM - Zustand subscription pattern issue  
**Impact**: Players can't tell if they're dealing damage

**Next Step**: Try Solution C (shallow comparator) immediately.
