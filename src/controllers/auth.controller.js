import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '../lib/db.js'
import { users } from '../db/schema.js'
import { sendOtp, verifyOtp, isRecentlyVerified, clearOtp } from '../services/otp.service.js'
import { signToken } from '../services/token.service.js'

export function serializeUser(user) {
  const { id, phone, name, roles, email, emailVerified, photoUrl, village, businessName, aadhaarLast4, upiId, gstin } = user
  return { id, phone, name, roles, email, emailVerified: !!emailVerified, photoUrl, village, businessName, aadhaarLast4, upiId, gstin }
}

export async function sendOtpHandler(req, res) {
  const { phone } = req.body
  const demoOtp = await sendOtp(phone)
  res.json({ sent: true, ...(demoOtp ? { demoOtp } : {}) })
}

export async function verifyOtpHandler(req, res) {
  const { phone, code } = req.body
  const result = await verifyOtp(phone, code)
  if (!result.ok) return res.status(400).json({ error: result.reason })

  const existing = await db.select().from(users).where(eq(users.phone, phone)).then((r) => r[0])
  if (existing) {
    await clearOtp(phone)
    return res.json({ isNewUser: false, token: signToken(existing), user: serializeUser(existing) })
  }
  res.json({ isNewUser: true })
}

export async function completeSignupHandler(req, res) {
  const { phone, name, roles } = req.body

  if (!(await isRecentlyVerified(phone))) {
    return res.status(400).json({ error: 'Verify your phone with OTP before completing signup' })
  }
  const already = await db.select().from(users).where(eq(users.phone, phone)).then((r) => r[0])
  if (already) return res.status(409).json({ error: 'An account with this phone already exists' })

  const now = new Date()
  const [user] = await db
    .insert(users)
    .values({ id: randomUUID(), phone, name, roles, emailVerified: false, createdAt: now, updatedAt: now })
    .returning()

  await clearOtp(phone)
  res.status(201).json({ token: signToken(user), user: serializeUser(user) })
}

export function meHandler(req, res) {
  res.json({ user: serializeUser(req.user) })
}
