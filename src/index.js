import { createApp } from './app.js'
import { env } from './config/env.js'
import { runMigrations } from './lib/db.js'

runMigrations()

const app = createApp()

app.listen(env.port, () => {
  console.log(`GrowNet API listening on http://localhost:${env.port}`)
  console.log(`Demo mode: ${env.demoMode ? 'ON (OTPs are returned in the response)' : 'OFF'}`)
})
