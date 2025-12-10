# Database Setup Guide

## 📋 Overview

This guide explains how to set up and use the PostgreSQL database for Voxel Warfare.

## 🚀 Quick Start

### 1. Start Database with Docker

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d postgres redis

# Verify containers are running
docker-compose ps
```

### 2. Generate and Run Migrations

```bash
cd server

# Generate migration from schema
bun run db:generate

# Push schema to database
bun run db:push
```

### 3. Seed Database

```bash
# Seed with test data
bun run db:seed
```

Test account will be created:
- **Username**: testplayer
- **Email**: test@voxelwarfare.com
- **Password**: password123

### 4. Open Drizzle Studio (Optional)

```bash
# Visual database browser
bun run db:studio
```

Visit `https://local.drizzle.studio`

## 📦 Database Schema

### Tables

1. **players** - User accounts and stats
2. **inventory** - Player items and equipment
3. **player_skills** - Skill tree progression
4. **player_quests** - Quest tracking
5. **world_objects** - Persistent world entities
6. **player_achievements** - Achievement progress
7. **sessions** - Authentication tokens

### Indexes

All tables have optimized indexes for:
- Primary keys (UUID)
- Foreign keys
- Frequently queried columns (username, email, chunk coordinates)

## 🔧 Available Commands

```bash
# Development
bun run db:generate  # Generate migrations from schema changes
bun run db:migrate   # Run migrations (alternative to push)
bun run db:push      # Push schema directly to database
bun run db:studio    # Open visual database browser
bun run db:seed      # Seed database with test data

# Server
bun run dev          # Start server with hot reload
bun run start        # Start production server
```

## 📊 Using Queries

The `src/db/queries.ts` file provides pre-built query functions:

```typescript
import { getPlayerById, getPlayerInventory, addItemToInventory } from './db/queries'

// Get player
const player = await getPlayerById('uuid')

// Get inventory
const inventory = await getPlayerInventory('uuid')

// Add item
await addItemToInventory('playerId', 'wooden_sword', 1)
```

## 🗄️ Data Definitions

### Items
`src/db/data/items.ts` - All game items (weapons, materials, consumables)

### Quests
`src/db/data/quests.ts` - Quest definitions and objectives

### Recipes
`src/db/data/recipes.ts` - Crafting recipes

### Achievements
`src/db/data/achievements.ts` - Achievement definitions

## 🔐 Environment Variables

Create `.env` file in `server/` directory:

```env
DATABASE_URL=postgresql://gameuser:gamepass@localhost:5432/voxel_warfare
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 🧪 Testing Database Connection

```bash
# Health check endpoint
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-11-23T...",
  "database": "connected"
}
```

## 📝 Schema Changes

When modifying schema:

1. Edit `src/db/schema.ts`
2. Run `bun run db:generate` to create migration
3. Run `bun run db:push` to apply changes
4. Update seed data if needed

## 🚨 Troubleshooting

### Database connection fails
```bash
# Check if Postgres is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart containers
docker-compose restart postgres
```

### Migration errors
```bash
# Reset database (CAUTION: deletes all data)
docker-compose down -v
docker-compose up -d postgres redis
bun run db:push
bun run db:seed
```

### Port conflicts
If port 5432 is already in use, edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use different host port
```

Then update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://gameuser:gamepass@localhost:5433/voxel_warfare
```

## 📈 Performance Tips

1. **Connection Pooling**: Already configured (max 20 connections)
2. **Indexes**: All critical columns are indexed
3. **Queries**: Use provided query functions for optimized queries
4. **Batch Operations**: Use array inserts when possible

## 🔒 Security

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- Parameterized queries (SQL injection protection)
- Foreign key constraints for data integrity
- Environment variables for secrets

## 📚 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
