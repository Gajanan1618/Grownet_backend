import { eq } from 'drizzle-orm'
import { db } from '../lib/db.js'
import { otpCodes } from '../db/schema.js'
import { env } from '../config/env.js'

// Backed by Postgres, not memory — a free Render instance restarts/spins
// down between requests, which would otherwise wipe pending OTPs.
const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
const VERIFIED_WINDOW_MS = 10 * 60 * 1000 // how long a verified-but-not-yet-signed-up phone stays trusted

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/**
 * Swap this out for a real provider (MSG91, Twilio Verify, Gupshup) before
 * production. The rest of the app never needs to change — it only calls
 * sendOtp/verifyOtp below.
 */
async function deliverSms(phone, code) {
  if (env.demoMode) {
    // In demo mode we don't actually send anything — the code is returned
    // to the caller instead, matching the frontend's existing "Demo mode" UI.
    return
  }
  throw new Error(
    'DEMO_MODE is off but no real SMS provider is wired up yet. Implement deliverSms() with MSG91/Twilio/Gupshup.'
  )
}

export async function sendOtp(phone) {
  const code = generateCode()
  await db
    .insert(otpCodes)
    .values({ phone, code, expiresAt: new Date(Date.now() + OTP_TTL_MS), verifiedAt: null })
    .onConflictDoUpdate({
      target: otpCodes.phone,
      set: { code, expiresAt: new Date(Date.now() + OTP_TTL_MS), verifiedAt: null },
    })
  await deliverSms(phone, code)
  return env.demoMode ? code : undefined
}

export async function verifyOtp(phone, code) {
  const entry = await db.select().from(otpCodes).where(eq(otpCodes.phone, phone)).then((r) => r[0])
  if (!entry) return { ok: false, reason: 'No OTP was requested for this number' }
  if (Date.now() > entry.expiresAt.getTime()) return { ok: false, reason: 'Code expired, request a new one' }
  if (entry.code !== code) return { ok: false, reason: 'Incorrect code' }

  await db.update(otpCodes).set({ verifiedAt: new Date() }).where(eq(otpCodes.phone, phone))
  return { ok: true }
}

/** Has this phone completed OTP verification recently? Used to gate signup completion. */
export async function isRecentlyVerified(phone) {
  const entry = await db.select().from(otpCodes).where(eq(otpCodes.phone, phone)).then((r) => r[0])
  if (!entry?.verifiedAt) return false
  return Date.now() - entry.verifiedAt.getTime() < VERIFIED_WINDOW_MS
}

export async function clearOtp(phone) {
  await db.delete(otpCodes).where(eq(otpCodes.phone, phone))
}
