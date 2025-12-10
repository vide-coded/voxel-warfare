# 🎮 3D Browser Action/Adventure Game - Technical Blueprint

**Project Name**: Voxel Warfare  
**Type**: Browser-based 3D multiplayer action/adventure game  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)  
**Created**: 2025-11-23

---

## 🎯 Vision

A low-poly 3D browser game combining Minecraft's building/crafting mechanics with GTA's action gameplay. Players explore procedurally generated worlds, complete quests from NPCs, engage in both melee and ranged combat, craft items, unlock skills, and explore dungeons—all with AI-generated SVG textures.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  React 19 + Vite + TypeScript                      │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  React Three Fiber (R3F)                     │ │    │
│  │  │  ├─ Three.js (3D rendering)                  │ │    │
│  │  │  ├─ @react-three/drei (controls, helpers)    │ │    │
│  │  │  ├─ @react-three/rapier (physics)            │ │    │
│  │  │  └─ @react-three/postprocessing (effects)    │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  │                                                    │    │
│  │  State Management: Zustand                        │    │
│  │  UI Layer: shadcn/ui + Tailwind CSS               │    │
│  │  Input: ZQSD + Mouse + Keyboard events            │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    WebSocket (Socket.io)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Bun Runtime + Elysia Framework                    │    │
│  │  ├─ REST API (player data, quests, inventory)     │    │
│  │  ├─ WebSocket Server (multiplayer sync)           │    │
│  │  ├─ Game Logic (combat, AI, physics authority)    │    │
│  │  └─ Texture Generation (Stable Diffusion API)     │    │
│  └────────────────────────────────────────────────────┘    │
│                              ↕                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                               │    │
│  │  ├─ Players (stats, position, inventory)          │    │
│  │  ├─ Quests (definitions, progress)                │    │
│  │  ├─ World State (persistent buildings, items)     │    │
│  │  └─ Achievements                                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Technology Stack

### **Frontend**

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 6.x | Build tool & dev server |
| **Three.js** | r170+ | 3D rendering engine |
| **React Three Fiber** | 9.x | React renderer for Three.js |
| **@react-three/drei** | 10.x | R3F helpers (FPS controls, sky, etc) |
| **@react-three/rapier** | 2.x | Physics engine (WASM-based) |
| **@react-three/postprocessing** | 3.x | Visual effects |
| **Zustand** | 5.x | State management |
| **shadcn/ui** | Latest | UI components |
| **Tailwind CSS** | 4.x | Styling |
| **Socket.io Client** | 4.x | Real-time communication |

### **Backend**

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Bun** | 1.x | JavaScript runtime |
| **Elysia** | 1.x | Web framework |
| **Socket.io** | 4.x | WebSocket server |
| **PostgreSQL** | 16.x | Primary database |
| **Drizzle ORM** | Latest | Database ORM |
| **Zod** | 3.x | Schema validation |
| **@elysiajs/jwt** | Latest | Authentication |
| **@elysiajs/cors** | Latest | CORS handling |

### **AI & Assets**

| Technology | Purpose |
|-----------|---------|
| **Stable Diffusion API** | SVG texture generation |
| **Simplex Noise** | Procedural terrain |
| **Matter.js** (fallback) | 2D physics for certain mechanics |

---

## 🎮 Game Systems Architecture

### **1. Player Controller System**

```typescript
// Core player state
interface PlayerState {
  position: Vector3
  rotation: Euler
  velocity: Vector3
  health: number
  maxHealth: number
  stamina: number
  isGrounded: boolean
  isJumping: boolean
  isSprinting: boolean
  currentWeapon: Weapon
  inventory: InventoryItem[]
  skills: SkillTree
  activeQuests: Quest[]
}

// Input mapping
const controls = {
  forward: 'KeyZ',
  backward: 'KeyS',
  left: 'KeyQ',
  right: 'KeyD',
  jump: 'Space',
  sprint: 'ShiftLeft',
  interact: 'KeyE',
  attack: 'Mouse0',
  aim: 'Mouse2',
  reload: 'KeyR',
  switchWeapon: '1-9',
  inventory: 'KeyI',
  crouch: 'KeyC'
}
```

**Features**:
- First-person camera (Three.js PointerLockControls)
- ZQSD movement with momentum
- Mouse look with sensitivity settings
- Jump physics (gravity, double-jump with skill unlock)
- Sprint system (stamina drain)
- Collision detection via Rapier physics

---

### **2. Combat System**

```typescript
interface Weapon {
  id: string
  name: string
  type: 'melee' | 'ranged'
  damage: number
  range: number
  attackSpeed: number
  ammo?: number
  maxAmmo?: number
  model: string
  textures: string[]
}

interface CombatAction {
  type: 'attack' | 'block' | 'dodge'
  timestamp: number
  damage?: number
  target?: Entity
  hitPosition?: Vector3
}
```

**Melee Combat**:
- Raycast-based hit detection
- Swing animations
- Combo system (light → heavy attacks)
- Stamina cost per swing
- Weapons: Sword, Axe, Hammer, Dagger

**Ranged Combat**:
- Projectile physics
- Ammo management
- Recoil system
- Weapons: Pistol, Rifle, Bow, Crossbow
- Bullet drop simulation for realism

**Enemy AI**:
- Patrol state (wander waypoints)
- Alert state (detect player by sight/sound)
- Chase state (pathfinding to player)
- Attack state (range-based behavior)
- Flee state (low health threshold)

---

### **3. NPC & Quest System**

```typescript
interface NPC {
  id: string
  name: string
  position: Vector3
  model: string
  dialogTree: DialogNode[]
  questsAvailable: Quest[]
  disposition: number // -100 (hostile) to 100 (friendly)
}

interface Quest {
  id: string
  title: string
  description: string
  giver: string // NPC id
  objectives: Objective[]
  rewards: Reward[]
  status: 'available' | 'active' | 'completed' | 'failed'
}

interface Objective {
  type: 'kill' | 'collect' | 'interact' | 'reach'
  target: string
  current: number
  required: number
}
```

**Interaction System**:
- Proximity detection (3m radius)
- "Press E to interact" UI prompt
- Dialog overlay with choices
- Quest acceptance/completion flow
- Dynamic quest log UI

---

### **4. Crafting System**

```typescript
interface Recipe {
  id: string
  name: string
  result: Item
  ingredients: { item: string, quantity: number }[]
  craftingStation?: 'workbench' | 'forge' | 'alchemy'
  unlockRequirement?: string // Skill or quest
}

interface Inventory {
  slots: InventorySlot[]
  maxSlots: number
  weight: number
  maxWeight: number
}
```

**Crafting Categories**:
- **Weapons**: Combine materials (wood, metal, gems)
- **Tools**: Pickaxe, Axe, Hammer
- **Consumables**: Health potions, stamina buffs
- **Building**: Walls, floors, doors (Minecraft-style)

**Crafting UI**:
- Grid-based inventory (drag & drop)
- Recipe book (unlocks as you discover)
- Resource tooltips

---

### **5. Skill Tree System**

```typescript
interface SkillTree {
  combat: {
    strength: number // +damage
    defense: number // -damage taken
    criticalHit: number // crit chance
  }
  mobility: {
    speed: number // movement speed
    stamina: number // max stamina
    doubleJump: boolean
  }
  crafting: {
    efficiency: number // crafting speed
    resourceYield: number // +resources from gathering
    advancedRecipes: boolean
  }
  stealth: {
    visibility: number // enemy detection range
    backstabDamage: number // multiplier
    silentMovement: boolean
  }
}

interface SkillNode {
  id: string
  name: string
  description: string
  cost: number // skill points
  prerequisites: string[]
  effect: (player: PlayerState) => void
}
```

**Progression**:
- Earn XP from combat, quests, crafting
- Level up → gain skill points
- Unlock nodes in skill tree
- Visual tree UI with dependencies

---

### **6. Procedural World Generation**

```typescript
interface Chunk {
  x: number
  z: number
  voxels: Voxel[][][]
  entities: Entity[]
  structures: Structure[]
  generated: boolean
}

interface Voxel {
  type: 'air' | 'grass' | 'dirt' | 'stone' | 'water' | 'sand' | 'wood'
  position: Vector3
  texture: string // AI-generated SVG
}
```

**Terrain Generation** (Simplex Noise):
- Heightmap for hills/valleys
- Biomes: Forest, Desert, Tundra, Ocean
- Chunk-based loading (16x16x256 voxels)
- LOD (Level of Detail) for distant chunks

**Structure Spawning**:
- Villages (friendly NPCs)
- Enemy camps
- Procedural dungeons (separate system)
- Resource nodes (trees, ore veins)

---

### **7. Procedural Dungeon System**

```typescript
interface Dungeon {
  id: string
  entrancePosition: Vector3
  rooms: Room[]
  corridors: Corridor[]
  difficulty: number
  boss?: Enemy
  loot: LootTable
}

interface Room {
  position: Vector3
  size: Vector3
  type: 'combat' | 'puzzle' | 'treasure' | 'boss'
  enemies: Enemy[]
  traps: Trap[]
}
```

**Generation Algorithm**:
- BSP (Binary Space Partitioning) for room layout
- Connect rooms with corridors
- Populate with enemies based on difficulty
- Treasure room at end
- Boss encounter (optional)

**Dungeon Mechanics**:
- Instanced (each player gets unique dungeon)
- Escalating difficulty
- Unique loot drops
- Exit portal on completion

---

### **8. Vehicle System**

```typescript
interface Vehicle {
  id: string
  type: 'car' | 'bike' | 'hovercraft'
  position: Vector3
  velocity: Vector3
  rotation: Euler
  maxSpeed: number
  acceleration: number
  handling: number
  durability: number
  seats: number
  passengers: Player[]
}
```

**Vehicle Physics**:
- Wheel-based physics (Rapier)
- Acceleration/braking
- Steering with drift mechanics
- Damage system (visual dents, smoke)
- Fuel system (optional)

**Vehicle Types**:
- **Car**: 4-seater, high durability
- **Bike**: 2-seater, high speed, low durability
- **Hovercraft**: Flies over water, slow

---

### **9. Achievement System**

```typescript
interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (player: PlayerState) => boolean
  reward?: Reward
  unlocked: boolean
  unlockedAt?: Date
}
```

**Achievement Categories**:
- **Combat**: "First Blood", "Headshot Master", "Survivor"
- **Exploration**: "Worldwalker", "Deep Delver", "Peak Climber"
- **Crafting**: "Master Blacksmith", "Alchemist"
- **Quests**: "Quest Completionist", "Hero of the People"
- **Skills**: "Fully Loaded" (max skill tree)

**Achievement UI**:
- Toast notification on unlock
- Achievement panel (grid view)
- Progress tracking

---

## 🗄️ Database Schema

```sql
-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 50,
  position_z FLOAT DEFAULT 0,
  rotation_x FLOAT DEFAULT 0,
  rotation_y FLOAT DEFAULT 0,
  rotation_z FLOAT DEFAULT 0,
  health INTEGER DEFAULT 100,
  max_health INTEGER DEFAULT 100,
  stamina INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  skill_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  item_id VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 1,
  slot_index INTEGER,
  equipped BOOLEAN DEFAULT FALSE,
  metadata JSONB -- For weapon durability, ammo, etc.
);

-- Skills table
CREATE TABLE player_skills (
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  skill_id VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 0,
  PRIMARY KEY (player_id, skill_id)
);

-- Quests table
CREATE TABLE player_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  quest_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  objectives JSONB, -- Track objective progress
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- World state (persistent buildings, vehicles)
CREATE TABLE world_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_x INTEGER NOT NULL,
  chunk_z INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'building', 'vehicle', 'item_drop'
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  position_z FLOAT NOT NULL,
  rotation JSONB,
  data JSONB, -- Object-specific data
  owner_id UUID REFERENCES players(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements table
CREATE TABLE player_achievements (
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (player_id, achievement_id)
);

-- Sessions table (for auth)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_inventory_player ON inventory(player_id);
CREATE INDEX idx_quests_player ON player_quests(player_id);
CREATE INDEX idx_world_chunk ON world_objects(chunk_x, chunk_z);
CREATE INDEX idx_sessions_token ON sessions(token);
```

---

## 🎨 Visual Design

### **Art Style**: Low-Poly Voxel

- **Geometry**: Simple geometric shapes, minimal vertices
- **Colors**: Vibrant, saturated color palette
- **Textures**: AI-generated SVG patterns (wood grain, stone, metal)
- **Lighting**: Baked ambient occlusion + dynamic directional light
- **Post-processing**: Minimal (FXAA, slight vignette)

### **UI Design Principles**

- **Minimalist HUD**:
  - Health/stamina bars (top-left)
  - Ammo counter (bottom-right)
  - Crosshair (center)
  - Quest tracker (right side)
  - Minimap (top-right corner)

- **Menu Overlays**:
  - Inventory: Grid-based, drag-and-drop
  - Skill Tree: Node graph with connections
  - Quest Log: Tabbed interface
  - Crafting: Recipe list + preview

- **No AI-Generated Look**:
  - Avoid centered everything
  - Use purposeful asymmetry
  - Tactical information density
  - Inspired by Tarkov, Rust UI

---

## 🔐 Security & Performance

### **Security**

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Server-authoritative physics (prevent cheating)
- Input validation with Zod schemas
- SQL injection protection (Drizzle ORM)

### **Performance Optimizations**

- **Frontend**:
  - Frustum culling (don't render off-screen objects)
  - Chunk-based world loading (load/unload dynamically)
  - Object pooling (reuse enemy/projectile instances)
  - LOD meshes for distant objects
  - Texture atlasing (reduce draw calls)
  - Web Workers for terrain generation

- **Backend**:
  - Database connection pooling
  - Redis caching for frequently accessed data
  - Spatial hashing for entity queries
  - Delta compression for network packets
  - Event-driven architecture

---

## 🌐 Multiplayer Architecture

### **Network Model**: Client-Server with Client Prediction

```typescript
// Server broadcasts to all clients
interface GameStateUpdate {
  timestamp: number
  players: {
    id: string
    position: Vector3
    rotation: Euler
    health: number
    animation: string
  }[]
  entities: {
    id: string
    type: 'enemy' | 'item' | 'vehicle'
    position: Vector3
    state: any
  }[]
  events: GameEvent[] // Combat hits, item pickups, etc.
}
```

**Client-Side Prediction**:
- Client immediately applies own inputs
- Server validates and corrects if needed
- Smooth interpolation for other players
- Lag compensation for hit detection

**Data Sync**:
- Position/rotation: 20 updates/sec
- Combat events: Immediate
- Inventory changes: On action
- Quest progress: On completion

---

## 📦 Project Structure

```
3D-game/
├── .github/
│   ├── agents/
│   │   ├── core/
│   │   │   └── orchestrator.md
│   │   └── templates/
│   │       ├── frontend-react.md
│   │       ├── backend-elysia.md
│   │       ├── 3d-engineer.md
│   │       └── game-logic-engineer.md
│   └── project/
│       ├── blueprint.md (this file)
│       ├── roadmap.md
│       ├── history.json
│       └── agents/
│           ├── 3d-engineer.md
│           ├── game-logic-engineer.md
│           ├── backend-engineer.md
│           └── database-engineer.md
├── src/
│   ├── client/
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   ├── Player.tsx
│   │   │   │   ├── Enemy.tsx
│   │   │   │   ├── NPC.tsx
│   │   │   │   ├── Terrain.tsx
│   │   │   │   ├── Vehicle.tsx
│   │   │   │   └── Weapon.tsx
│   │   │   ├── ui/
│   │   │   │   ├── HUD.tsx
│   │   │   │   ├── Inventory.tsx
│   │   │   │   ├── SkillTree.tsx
│   │   │   │   ├── QuestLog.tsx
│   │   │   │   └── Minimap.tsx
│   │   │   └── world/
│   │   │       ├── Chunk.tsx
│   │   │       ├── Dungeon.tsx
│   │   │       └── Structure.tsx
│   │   ├── hooks/
│   │   │   ├── usePlayer.ts
│   │   │   ├── useControls.ts
│   │   │   ├── useInventory.ts
│   │   │   └── useMultiplayer.ts
│   │   ├── stores/
│   │   │   ├── gameStore.ts
│   │   │   ├── playerStore.ts
│   │   │   └── worldStore.ts
│   │   ├── systems/
│   │   │   ├── combat.ts
│   │   │   ├── physics.ts
│   │   │   ├── ai.ts
│   │   │   └── crafting.ts
│   │   ├── utils/
│   │   │   ├── terrain-generator.ts
│   │   │   ├── dungeon-generator.ts
│   │   │   └── noise.ts
│   │   └── App.tsx
│   └── server/
│       ├── index.ts
│       ├── db/
│       │   ├── schema.ts
│       │   └── migrations/
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── player.ts
│       │   ├── quests.ts
│       │   └── world.ts
│       ├── game/
│       │   ├── GameServer.ts
│       │   ├── EntityManager.ts
│       │   ├── CombatSystem.ts
│       │   └── QuestManager.ts
│       └── services/
│           ├── textureGenerator.ts
│           └── achievementTracker.ts
├── public/
│   ├── models/
│   ├── textures/
│   └── sounds/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Deployment Strategy

### **Production Stack**

- **Frontend**: Vercel / Netlify (static hosting)
- **Backend**: Railway / Render (Bun runtime)
- **Database**: Supabase / Neon (Postgres)
- **WebSocket**: Same server as backend (Socket.io)
- **CDN**: Cloudflare (textures, models)

### **Environment Variables**

```env
# Server
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...

# AI Textures
STABLE_DIFFUSION_API_KEY=...
STABLE_DIFFUSION_API_URL=...

# Optional
REDIS_URL=...
SENTRY_DSN=...
```

---

## 📊 Success Metrics

- **Performance**: 60 FPS on mid-range hardware
- **Network**: <100ms latency for multiplayer
- **Load Time**: <5 seconds initial load
- **Stability**: <1% crash rate
- **Engagement**: 15+ min average session time

---

## 🎯 MVP Scope (Core Features Only)

✅ **Included in MVP**:
- First-person movement (ZQSD + mouse)
- Basic terrain generation
- Melee + ranged combat
- 3-5 enemy types
- 2-3 NPCs with simple quests
- Crafting system (10 recipes)
- Skill tree (15 nodes)
- Procedural dungeons (basic)
- Vehicle system (1 vehicle type)
- Achievement system (20 achievements)
- Save/load system

❌ **Excluded from MVP** (Post-launch):
- Multiplayer (Phase 6)
- Advanced building system
- Complex AI behaviors
- Social features (guilds, chat)
- Mobile version
- Localization

---

**This blueprint is the single source of truth for the project. All agents must reference this document.**
