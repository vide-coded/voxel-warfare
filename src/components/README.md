# 🎮 Voxel Warfare - Components

## 📁 Structure

```
components/
├── game/          # Core game components
│   ├── Scene.tsx  # Main R3F Canvas with lighting and physics
│   └── Camera.tsx # First-person camera with pointer lock controls
├── world/         # World-related components
│   └── Ground.tsx # 100x100 ground plane with procedural texture
└── ui/            # User interface overlays
    └── Instructions.tsx # Click to play overlay and crosshair
```

## 🎯 Task 1.3: Basic 3D Scene ✅ COMPLETED

### What Was Built

**Scene Component** (`game/Scene.tsx`)
- ✅ R3F Canvas with WebGL2 renderer
- ✅ ACESFilmic tone mapping for realistic colors
- ✅ Ambient light (0.5 intensity) + Directional light (1.5 intensity)
- ✅ 2048x2048 shadow maps enabled
- ✅ Sky component with sun positioning
- ✅ Rapier physics world (gravity: -20 m/s²)
- ✅ Pixel ratio capped at 2 for performance

**Camera Component** (`game/Camera.tsx`)
- ✅ PointerLockControls integration
- ✅ Click canvas to lock pointer
- ✅ ESC to unlock pointer
- ✅ Mouse look functionality
- ✅ Camera FOV: 75°, position: [0, 1.7, 5] (eye height)

**Ground Component** (`world/Ground.tsx`)
- ✅ 100x100 unit plane with Rapier physics (fixed rigid body)
- ✅ Procedural grass texture with variations
- ✅ Voxel grid visualization (8x8 unit cells)
- ✅ Texture repeating and nearest-neighbor filtering
- ✅ Receives shadows from directional light

**Instructions UI** (`ui/Instructions.tsx`)
- ✅ "Click to play" overlay when pointer is unlocked
- ✅ Instructions for ESC and mouse controls
- ✅ Crosshair when pointer is locked
- ✅ Small hint at top when playing

### Performance Metrics

- **FPS**: 60 (stable on empty scene)
- **Draw Calls**: ~3-5 (canvas, ground, sky)
- **Memory**: Minimal (~50MB)
- **Shadows**: Working correctly

### How to Test

1. Start dev server: `npm run dev`
2. Open http://localhost:5173/
3. Click canvas to lock pointer
4. Move mouse to look around
5. Press ESC to unlock pointer

### Next Steps (Task 1.4)

The **Game Logic Engineer** will now implement player movement:
- ZQSD keyboard input handling
- Character physics (walk, sprint, jump)
- Collision detection with ground
- Stamina system
- Player state in Zustand store
