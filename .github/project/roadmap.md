# 🗺️ Voxel Warfare - MVP Development Roadmap

**Project**: 3D Browser Action/Adventure Game  
**Total Estimated Time**: 16-20 hours  
**Created**: 2025-11-23

---

## 📋 Overview

This roadmap breaks down the MVP into 5 sequential phases, with clear dependencies and time estimates. Each phase builds on the previous, ensuring steady progress toward a playable game.

---

## 🎯 Phase 1: Foundation & Core Engine (4-5 hours)

**Goal**: Set up project infrastructure and basic 3D world with player movement.

### Task 1.1: Project Setup & Dependencies
**Agent**: DevOps Engineer  
**Time**: 45 minutes  
**Dependencies**: None

**Deliverables**:
- Initialize Vite + React + TypeScript project
- Install Three.js, R3F, Rapier, Zustand, shadcn/ui
- Configure Tailwind CSS
- Set up Docker for Postgres + Redis
- Create `docker-compose.yml`
- Configure Bun runtime
- Set up Biome for linting

**Acceptance Criteria**:
- ✅ `npm run dev` starts frontend on port 5173
- ✅ `bun run server` starts backend on port 3000
- ✅ Docker containers running (postgres, redis)
- ✅ No linting errors

---

### Task 1.2: Database Schema & Migrations
**Agent**: Database Engineer  
**Time**: 1 hour  
**Dependencies**: Task 1.1

**Deliverables**:
- Create `schema.ts` with Drizzle ORM
- Implement tables: players, inventory, player_skills, player_quests, world_objects, player_achievements, sessions
- Write migration scripts
- Seed database with test data (NPCs, quests, items)

**Acceptance Criteria**:
- ✅ Database migrated successfully
- ✅ All tables created with indexes
- ✅ Seed data populated
- ✅ Connection pooling configured

---

### Task 1.3: Basic 3D Scene & First-Person Camera
**Agent**: 3D Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 1.1

**Deliverables**:
- Set up React Three Fiber canvas
- Create ground plane (100x100 voxel grid)
- Implement first-person camera with PointerLockControls
- Add basic lighting (ambient + directional)
- Sky gradient background

**Acceptance Criteria**:
- ✅ 3D scene renders
- ✅ Click to lock pointer, ESC to unlock
- ✅ Mouse controls camera rotation
- ✅ Ground visible with basic texture

---

### Task 1.4: Player Movement Controller ✅ COMPLETED
**Agent**: Game Logic Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 1.3  
**Status**: ✅ **COMPLETED** (2025-11-23)

**Deliverables**:
- ZQSD keyboard input handling
- Character physics (walk, sprint, jump)
- Collision detection with ground
- Stamina system (sprint drains, regenerates)
- Player state in Zustand store
- **Camera-relative movement system** (movement continuously follows camera rotation)

**Acceptance Criteria**:
- ✅ ZQSD moves player forward/back/left/right **relative to camera orientation**
- ✅ **Movement direction updates in real-time as camera rotates (even while keys held)**
- ✅ Shift sprint works (faster speed, drains stamina)
- ✅ Spacebar jump with gravity
- ✅ Can't walk through objects
- ✅ Smooth camera following
- ✅ **Strafe movement (Q/D) perpendicular to camera direction**
- ✅ **Diagonal movement normalized for consistent speed**

**Implementation Notes**:
- Direct camera reference via `useThree()` hook
- Per-frame camera vector extraction using `camera.getWorldDirection()`
- Horizontal projection for ground-based movement
- Cross product for strafe vectors
- Physics integration via Rapier RigidBody

**Test Guide**: See `.github/project/MOVEMENT_TEST_GUIDE.md`

---

## 🎮 Phase 2: Combat & Enemies (4-5 hours)

**Goal**: Implement melee/ranged combat and basic enemy AI.

### Task 2.1: Weapon System
**Agent**: Game Logic Engineer  
**Time**: 2 hours  
**Dependencies**: Task 1.4

**Deliverables**:
- Weapon data models (sword, pistol)
- Weapon switching (keys 1-2)
- Melee attack (raycast hit detection)
- Ranged attack (projectile physics)
- Ammo system for guns
- Attack animations (placeholder)

**Acceptance Criteria**:
- ✅ Press 1 for sword, 2 for pistol
- ✅ Left-click attacks
- ✅ Sword: raycast detects hits within 2m
- ✅ Pistol: shoots bullet projectile
- ✅ Ammo counter displayed in UI
- ✅ Reload with R key

---

### Task 2.2: Enemy AI & Behavior
**Agent**: Game Logic Engineer  
**Time**: 2 hours  
**Dependencies**: Task 2.1

**Deliverables**:
- Enemy entity component (Zombie, Bandit)
- AI state machine (patrol, alert, chase, attack, flee)
- Pathfinding (simple navmesh)
- Health system
- Death/respawn logic

**Acceptance Criteria**:
- ✅ Enemies patrol waypoints
- ✅ Detect player within 15m (alert)
- ✅ Chase player when alerted
- ✅ Attack at 2m range (melee) or 10m (ranged)
- ✅ Flee when health < 20%
- ✅ Die and drop loot

---

### Task 2.3: Combat UI (HUD)
**Agent**: 3D Engineer  
**Time**: 1 hour  
**Dependencies**: Task 2.2

**Deliverables**:
- Health bar (top-left)
- Stamina bar (below health)
- Crosshair (center)
- Ammo counter (bottom-right)
- Hit markers (damage feedback)
- Enemy health bars (floating above head)

**Acceptance Criteria**:
- ✅ HUD elements positioned correctly
- ✅ Bars update in real-time
- ✅ Crosshair changes on hover over enemy
- ✅ Damage numbers appear on hit

---

## 🌍 Phase 3: World Generation & NPCs (3-4 hours)

**Goal**: Procedural terrain, NPC interactions, and quest system.

### Task 3.1: Procedural Terrain Generation
**Agent**: 3D Engineer  
**Time**: 2 hours  
**Dependencies**: Task 1.3

**Deliverables**:
- Simplex noise heightmap
- Chunk-based world (16x16 voxel chunks)
- Biome system (grass, desert, forest)
- Dynamic chunk loading/unloading
- Basic voxel textures (AI-generated SVGs)

**Acceptance Criteria**:
- ✅ Terrain generates with hills/valleys
- ✅ Different biomes visible
- ✅ Chunks load as player moves
- ✅ 60 FPS maintained with 9x9 chunk radius

---

### Task 3.2: NPC System & Dialog
**Agent**: Game Logic Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 3.1

**Deliverables**:
- NPC entity component
- Proximity detection (press E to interact)
- Dialog UI overlay
- Dialog tree system (branching choices)
- 3 NPCs with unique dialogs

**Acceptance Criteria**:
- ✅ "Press E to talk" prompt appears near NPCs
- ✅ Dialog overlay shows NPC name + text
- ✅ Player can choose dialog options
- ✅ Dialogs can trigger quests

---

### Task 3.3: Quest System
**Agent**: Backend Engineer  
**Time**: 1 hour  
**Dependencies**: Task 3.2, Task 1.2

**Deliverables**:
- Quest data models
- Quest API endpoints (GET /quests, POST /quests/:id/accept)
- Quest log UI (right-side panel)
- Objective tracking (kill, collect, interact)
- 3 starter quests

**Acceptance Criteria**:
- ✅ Accept quest from NPC
- ✅ Quest appears in quest log
- ✅ Objectives track progress (2/5 enemies killed)
- ✅ Complete quest, receive rewards (XP, items)

---

## 🛠️ Phase 4: Crafting, Skills & Progression (3-4 hours)

**Goal**: Implement crafting recipes, skill tree, and character progression.

### Task 4.1: Inventory System
**Agent**: Game Logic Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 2.2 (loot drops)

**Deliverables**:
- Inventory state (Zustand)
- Grid-based UI (drag & drop)
- Item pickup from ground
- Item stacking
- Inventory API (save to database)

**Acceptance Criteria**:
- ✅ Press I to open inventory
- ✅ Drag items between slots
- ✅ Right-click to drop item
- ✅ Items persist on logout

---

### Task 4.2: Crafting System
**Agent**: Game Logic Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 4.1

**Deliverables**:
- Recipe data (10 recipes)
- Crafting UI (recipe list + preview)
- Crafting logic (check ingredients, create item)
- Crafting stations (workbench, forge)

**Recipes**:
- Wooden Sword (5 wood)
- Stone Axe (3 wood, 2 stone)
- Health Potion (2 herbs, 1 water)
- Leather Armor (8 leather)
- Iron Sword (5 iron, 2 wood)
- Bow (6 wood, 3 string)
- Arrow x10 (2 wood, 1 feather)
- Campfire (4 wood, 2 stone)
- Wall Block (4 stone)
- Door (6 wood)

**Acceptance Criteria**:
- ✅ Open crafting menu at workbench
- ✅ See available recipes (grayed if missing ingredients)
- ✅ Click to craft item
- ✅ Item added to inventory

---

### Task 4.3: Skill Tree System
**Agent**: 3D Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 4.1

**Deliverables**:
- XP system (gain from combat, quests, crafting)
- Level-up logic (XP thresholds)
- Skill tree UI (node graph)
- 15 skill nodes across 4 categories:
  - Combat: Strength (+5 damage), Defense (-5% damage taken), Critical Hit (+10% crit)
  - Mobility: Speed (+10% move speed), Stamina (+20 max), Double Jump
  - Crafting: Efficiency (-20% craft time), Yield (+1 resource), Advanced Recipes
  - Stealth: Invisibility (-20% detection), Backstab (2x damage), Silent Movement

**Acceptance Criteria**:
- ✅ Gain XP, level up (toast notification)
- ✅ Earn skill point on level up
- ✅ Open skill tree (press K)
- ✅ Unlock skills (grayed if missing prereqs)
- ✅ Skills apply effects immediately

---

## 🏰 Phase 5: Dungeons, Vehicles & Polish (4-5 hours)

**Goal**: Add procedural dungeons, vehicle system, achievements, and final polish.

### Task 5.1: Procedural Dungeon Generator
**Agent**: 3D Engineer  
**Time**: 2 hours  
**Dependencies**: Task 3.1

**Deliverables**:
- BSP room generation algorithm
- Corridor connections
- Dungeon entrance portal (in overworld)
- Enemy spawning (scaled by difficulty)
- Treasure room with loot
- Exit portal

**Acceptance Criteria**:
- ✅ Dungeon portal spawns in world
- ✅ Enter portal → load dungeon instance
- ✅ Rooms connected by corridors
- ✅ Enemies spawn in combat rooms
- ✅ Boss enemy in final room
- ✅ Chest with rare loot
- ✅ Exit portal returns to overworld

---

### Task 5.2: Vehicle System
**Agent**: Game Logic Engineer  
**Time**: 1.5 hours  
**Dependencies**: Task 1.4

**Deliverables**:
- Vehicle entity (car)
- Vehicle physics (acceleration, steering, braking)
- Enter/exit vehicle (press F near vehicle)
- Vehicle controls (ZQSD + Space for brake)
- Vehicle durability/fuel system

**Acceptance Criteria**:
- ✅ Spawn car in world
- ✅ Press F to enter driver seat
- ✅ ZQSD controls vehicle
- ✅ Camera switches to third-person
- ✅ Press F to exit vehicle
- ✅ Vehicle takes damage from collisions

---

### Task 5.3: Achievement System
**Agent**: Backend Engineer  
**Time**: 1 hour  
**Dependencies**: All previous tasks

**Deliverables**:
- Achievement definitions (20 achievements)
- Achievement tracking service
- Achievement API endpoints
- Achievement UI (grid view)
- Toast notifications on unlock

**Achievements**:
- First Blood (kill first enemy)
- Survivalist (survive 10 minutes)
- Crafter (craft 10 items)
- Explorer (visit 5 biomes)
- Dungeon Delver (complete first dungeon)
- Sharpshooter (50 headshots)
- Speedrunner (complete quest in <5 min)
- Rich (earn 1000 gold)
- Collector (obtain 50 unique items)
- Max Level (reach level 20)
- Master Blacksmith (craft legendary weapon)
- Pacifist (complete quest without killing)
- Tank (take 1000 damage without dying)
- Glass Cannon (deal 5000 damage with <50% health)
- Social Butterfly (talk to 10 NPCs)
- Treasure Hunter (open 20 chests)
- Architect (build 50 structures)
- Road Warrior (drive 10km in vehicle)
- Boss Slayer (defeat dungeon boss)
- Completionist (unlock all skills)

**Acceptance Criteria**:
- ✅ Achievements unlock automatically
- ✅ Toast shows achievement title + icon
- ✅ Achievement panel shows progress
- ✅ Persisted to database

---

### Task 5.4: Final Polish & Testing
**Agent**: 3D Engineer + Backend Engineer  
**Time**: 1.5 hours  
**Dependencies**: All previous tasks

**Deliverables**:
- Main menu (start, settings, exit)
- Settings menu (graphics, controls, audio)
- Save/load system (auto-save every 2 minutes)
- Sound effects (footsteps, gunshots, hits)
- Background music
- Loading screens
- Error handling & fallbacks
- Performance optimization pass

**Acceptance Criteria**:
- ✅ Main menu functional
- ✅ Settings persist
- ✅ Save/load works reliably
- ✅ Sound effects play correctly
- ✅ Music loops without gaps
- ✅ Maintains 60 FPS on medium settings
- ✅ No critical bugs

---

## 🚀 Phase 6: Multiplayer Foundation (Post-MVP) (6-8 hours)

**Goal**: Add real-time multiplayer support.

### Task 6.1: WebSocket Infrastructure
**Agent**: Backend Engineer  
**Time**: 2 hours

**Deliverables**:
- Socket.io server setup
- Room management (lobbies)
- Player connection/disconnection handling
- Basic state synchronization

---

### Task 6.2: Multiplayer Game State
**Agent**: Backend Engineer  
**Time**: 2 hours

**Deliverables**:
- Server-authoritative game loop
- Player position broadcasting (20Hz)
- Combat event sync
- Inventory/quest sync

---

### Task 6.3: Client-Side Prediction & Interpolation
**Agent**: 3D Engineer  
**Time**: 2 hours

**Deliverables**:
- Client prediction for local player
- Entity interpolation for remote players
- Lag compensation for hit detection
- Network debugging UI

---

### Task 6.4: Multiplayer Testing & Optimization
**Agent**: Backend Engineer + 3D Engineer  
**Time**: 2 hours

**Deliverables**:
- Stress testing (50+ concurrent players)
- Network optimization (delta compression)
- Cheat prevention (server validation)
- Reconnection logic

---

## 📊 Task Dependencies Graph

```
Phase 1: Foundation
├─ 1.1 Project Setup (no deps)
├─ 1.2 Database Schema (deps: 1.1)
├─ 1.3 3D Scene (deps: 1.1)
└─ 1.4 Player Movement (deps: 1.3)

Phase 2: Combat
├─ 2.1 Weapon System (deps: 1.4)
├─ 2.2 Enemy AI (deps: 2.1)
└─ 2.3 Combat UI (deps: 2.2)

Phase 3: World & NPCs
├─ 3.1 Terrain Generation (deps: 1.3)
├─ 3.2 NPC System (deps: 3.1)
└─ 3.3 Quest System (deps: 3.2, 1.2)

Phase 4: Crafting & Skills
├─ 4.1 Inventory (deps: 2.2)
├─ 4.2 Crafting (deps: 4.1)
└─ 4.3 Skill Tree (deps: 4.1)

Phase 5: Dungeons & Polish
├─ 5.1 Dungeons (deps: 3.1)
├─ 5.2 Vehicles (deps: 1.4)
├─ 5.3 Achievements (deps: all)
└─ 5.4 Polish (deps: all)

Phase 6: Multiplayer (Post-MVP)
├─ 6.1 WebSocket (deps: 1.1)
├─ 6.2 Game State Sync (deps: 6.1)
├─ 6.3 Client Prediction (deps: 6.2)
└─ 6.4 Testing (deps: 6.3)
```

---

## 🎯 Critical Path

The shortest path to a playable MVP:

1. **1.1 Project Setup** → **1.3 3D Scene** → **1.4 Player Movement**
2. **2.1 Weapon System** → **2.2 Enemy AI** → **2.3 Combat UI**
3. **3.2 NPC System** → **3.3 Quest System**
4. **4.1 Inventory** → **4.2 Crafting**
5. **5.4 Polish**

**Minimum viable game**: ~12 hours of focused work.

---

## 📈 Progress Tracking

After each task, update `.github/project/history.json`:

```json
{
  "project": "voxel-warfare",
  "created": "2025-11-23T...",
  "lastUpdated": "2025-11-23T...",
  "currentPhase": "Phase 1 - Foundation",
  "tasks": [
    {
      "id": 1,
      "phase": "Phase 1",
      "task": "Project setup & dependencies",
      "agent": "devops-engineer",
      "status": "completed",
      "startedAt": "...",
      "completedAt": "...",
      "files": ["package.json", "docker-compose.yml"],
      "notes": "..."
    }
  ],
  "metrics": {
    "totalTasks": 23,
    "completed": 0,
    "inProgress": 0,
    "remaining": 23
  }
}
```

---

## 🚨 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Performance issues (low FPS) | Medium | High | LOD, object pooling, profiling |
| Multiplayer lag/desync | High | High | Client prediction, server authority |
| Terrain generation too slow | Medium | Medium | Web Workers, caching |
| AI pathfinding performance | Low | Medium | Spatial hashing, update throttling |
| Scope creep | High | High | Strict MVP focus, Phase 6 for extras |

---

## ✅ MVP Definition of Done

The MVP is complete when:

- ✅ Player can move in 3D world (ZQSD + mouse)
- ✅ Player can attack enemies (melee + ranged)
- ✅ Enemies chase and attack player
- ✅ NPCs give quests
- ✅ Quest log tracks objectives
- ✅ Inventory system works
- ✅ Crafting system works (10 recipes)
- ✅ Skill tree unlockable (15 skills)
- ✅ Procedural terrain generates
- ✅ Dungeons generate and are completable
- ✅ Vehicle drivable
- ✅ Achievements unlock
- ✅ Save/load persists progress
- ✅ Runs at 60 FPS on mid-range hardware
- ✅ No critical bugs

---

**Total Estimated Time**: 16-20 hours  
**Target Completion**: 2-3 days of focused development

🚀 Ready to start building! Next step: Task 1.1 (Project Setup)
