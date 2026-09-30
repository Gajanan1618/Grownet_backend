import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { Pool } = pg

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('Missing required environment variable: DATABASE_URL')
}

// Neon (and most managed Postgres free tiers) require SSL; local dev usually doesn't.
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('sslmode=require') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})

export const db = drizzle(pool, { schema })

/** Applies any .sql files in /migrations that haven't run yet, in filename order. */
export async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  const dir = path.join(__dirname, '../../migrations')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
  const { rows } = await pool.query('SELECT name FROM _migrations')
  const applied = new Set(rows.map((r) => r.name))

  for (const file of files) {
    if (applied.has(file)) continue
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    await pool.query('BEGIN')
    try {
      await pool.query(sql)
      await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file])
      await pool.query('COMMIT')
      console.log(`Applied migration: ${file}`)
    } catch (err) {
      await pool.query('ROLLBACK')
      throw new Error(`Migration ${file} failed: ${err.message}`)
    }
  }
}
