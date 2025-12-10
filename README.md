# Voxel Warfare

3D browser-based action/adventure game combining Minecraft-style building with GTA-style gameplay.

## 🎮 Features

- **First-Person Movement**: ZQSD controls + mouse look
- **Combat System**: Melee and ranged weapons
- **Enemy AI**: Patrol, chase, attack, flee behaviors
- **NPC Interactions**: Dialog system with quests
- **Crafting System**: 10+ recipes for weapons, tools, consumables
- **Skill Tree**: 15 skills across Combat, Mobility, Crafting, Stealth
- **Procedural World**: Chunk-based terrain with biomes
- **Procedural Dungeons**: Randomized dungeons with loot
- **Vehicle System**: Driveable vehicles
- **Achievements**: 20 unlockable achievements
- **Low-Poly Art**: AI-generated SVG textures

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) 18+ (for npm commands)

### Installation

1. **Clone and install dependencies**:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
bun install
cd ..
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Docker containers** (Postgres + Redis):
```bash
docker-compose up -d
```

4. **Start development servers**:
```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Bun + Elysia)
npm run server
```

5. **Open the game**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/swagger

## 📁 Project Structure

```
voxel-warfare/
├── src/                    # Frontend source
│   ├── components/
│   │   ├── game/          # 3D game entities
│   │   ├── ui/            # UI overlays
│   │   └── world/         # World generation
│   ├── hooks/             # React hooks
│   ├── stores/            # Zustand state
│   ├── systems/           # Game logic
│   └── utils/             # Utilities
├── server/                # Backend source
│   └── src/
│       ├── db/            # Database schema
│       ├── routes/        # API routes
│       └── game/          # Game server logic
├── public/                # Static assets
├── .github/
│   ├── agents/            # AI agent definitions
│   └── project/           # Project docs
└── docker-compose.yml     # Docker services
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **Rapier** - Physics engine
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Socket.io Client** - Multiplayer (Phase 6)

### Backend
- **Bun** - JavaScript runtime
- **Elysia** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Socket.io** - WebSocket server
- **Zod** - Schema validation

## 🎯 Development Roadmap

See [.github/project/roadmap.md](.github/project/roadmap.md) for the complete development plan.

**Current Phase**: Phase 1 - Foundation ✅

- [x] Project setup
- [ ] Database schema
- [ ] 3D scene setup
- [ ] Player controller

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && bun test
```

## 🐛 Debugging

### Frontend
- Open browser DevTools (F12)
- Check Console for errors
- Use React DevTools extension

### Backend
- Check server logs in terminal
- Visit http://localhost:3000/swagger for API testing

### Database
```bash
# Access Postgres
docker exec -it voxel-warfare-db psql -U gameuser -d voxel_warfare

# View logs
docker logs voxel-warfare-db
```

## 📚 Documentation

- [Blueprint](.github/project/blueprint.md) - Technical architecture
- [Roadmap](.github/project/roadmap.md) - Development plan
- [Agent Guides](.github/project/agents/) - Specialized agent docs

## 🤝 Contributing

This project is built with AI agents. See [orchestrator.md](.github/agents/core/orchestrator.md) for the development workflow.

## 📄 License

MIT

## 🎮 Play & Enjoy!

Built with ❤️ using Three.js, React, and Bun.
