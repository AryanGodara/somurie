import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { connectToDatabase, disconnectFromDatabase } from './config/db'
import { env } from './config/env'
import { apiRouter } from './routes'

// Initialize MongoDB connection
connectToDatabase().catch((err) => {
  console.error('Failed to connect to MongoDB:', err)
  process.exit(1)
})

// Create Hono app
const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
  '*',
  cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
    credentials: true,
  }),
)

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'Somurie API server is running',
    version: '0.1.0',
    features: ['Creator Score', 'Leaderboards', 'Loan Waitlist'],
  })
})

// Mount API routes
app.route('/api', apiRouter)

// Start the server
const PORT = env.PORT || 4000
console.log(`🚀 Server is running on port ${PORT}`)
console.log(`💻 Environment: ${env.NODE_ENV}`)

serve({
  fetch: app.fetch,
  port: Number(PORT),
})

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received, shutting down gracefully')
  await disconnectFromDatabase().catch((err: Error) =>
    console.error('Error during shutdown:', err),
  )
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT signal received, shutting down gracefully')
  await disconnectFromDatabase().catch((err: Error) =>
    console.error('Error during shutdown:', err),
  )
  process.exit(0)
})
