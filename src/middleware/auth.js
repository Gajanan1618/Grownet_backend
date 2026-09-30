import { eq } from 'drizzle-orm'
import { verifyToken } from '../services/token.service.js'
import { db } from '../lib/db.js'
import { users } from '../db/schema.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) return res.status(401).json({ error: 'Missing Authorization header' })

  try {
    const payload = verifyToken(token)
    const user = await db.select().from(users).where(eq(users.id, payload.sub)).then((r) => r[0])
    if (!user) return res.status(401).json({ error: 'User no longer exists' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
