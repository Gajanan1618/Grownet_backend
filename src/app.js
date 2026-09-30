import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/users.routes.js'
import listingRoutes from './routes/listings.routes.js'
import requirementRoutes from './routes/requirements.routes.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.corsOrigins }))
  app.use(express.json({ limit: '8mb' })) // photos arrive as base64 — bump the default 100kb limit
  app.use(morgan(env.isProduction ? 'combined' : 'dev'))

  app.get('/health', (req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/listings', listingRoutes)
  app.use('/api/requirements', requirementRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
