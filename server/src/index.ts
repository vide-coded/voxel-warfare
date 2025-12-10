import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { checkDatabaseConnection, db } from './db'

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Voxel Warfare API',
          version: '1.0.0',
          description: 'Backend API for Voxel Warfare game',
        },
      },
    }),
  )
  .decorate('db', db)
  .get('/', () => ({
    message: 'Voxel Warfare API',
    version: '1.0.0',
    status: 'online',
  }))
  .get('/health', async () => {
    const dbConnected = await checkDatabaseConnection()
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
    }
  })
  .listen(3000)

console.log(`🚀 Server running at http://localhost:${app.server?.port}`)
console.log(`📚 API docs at http://localhost:${app.server?.port}/swagger`)
console.log(
  `🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Not configured'}`,
)
