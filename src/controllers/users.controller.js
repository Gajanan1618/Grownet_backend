import { eq } from 'drizzle-orm'
import { db } from '../lib/db.js'
import { users } from '../db/schema.js'
import { serializeUser } from './auth.controller.js'

export async function updateProfileHandler(req, res) {
  const [user] = await db
    .update(users)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(users.id, req.user.id))
    .returning()
  res.json({ user: serializeUser(user) })
}

export async function sendEmailVerificationHandler(req, res) {
  const { email } = req.body
  await db.update(users).set({ emailPending: email, updatedAt: new Date() }).where(eq(users.id, req.user.id))
  res.json({ sent: true, email })
}

export async function confirmEmailVerificationHandler(req, res) {
  const current = await db.select().from(users).where(eq(users.id, req.user.id)).then((r) => r[0])
  if (!current.emailPending) {
    return res.status(400).json({ error: 'No pending email verification' })
  }
  const [user] = await db
    .update(users)
    .set({ email: current.emailPending, emailPending: null, emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, req.user.id))
    .returning()
  res.json({ user: serializeUser(user) })
}
