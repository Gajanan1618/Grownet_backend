import { randomUUID } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../lib/db.js'
import { offers } from '../db/schema.js'

function serializeOffer(o) {
  return { ...o, createdAt: o.createdAt.toISOString() }
}

/** Shared by listings.controller.js and requirements.controller.js. */
export async function recordOffer({ targetType, targetId, targetTitle, fromUser, toUserId, body }) {
  const [offer] = await db
    .insert(offers)
    .values({
      id: randomUUID(),
      targetType,
      targetId,
      targetTitle,
      fromUserId: fromUser.id,
      fromUserName: fromUser.name,
      toUserId,
      price: body.price ?? null,
      qty: body.qty ?? null,
      message: body.message ?? null,
      status: 'pending',
      createdAt: new Date(),
    })
    .returning()
  return offer
}

// Offers received by the logged-in user — this is what powers the
// notification panel for both farmers (offers on their listings) and
// buyers (offers on their requirements), since it's the same inbox.
export async function listReceivedOffersHandler(req, res) {
  const rows = await db
    .select()
    .from(offers)
    .where(eq(offers.toUserId, req.user.id))
    .orderBy(desc(offers.createdAt))
  res.json({ offers: rows.map(serializeOffer) })
}

export async function updateOfferStatusHandler(req, res) {
  const current = await db.select().from(offers).where(eq(offers.id, req.params.id)).then((r) => r[0])
  if (!current) return res.status(404).json({ error: 'Offer not found' })
  if (current.toUserId !== req.user.id) {
    return res.status(403).json({ error: 'Only the recipient can respond to this offer' })
  }
  const [updated] = await db
    .update(offers)
    .set({ status: req.body.status })
    .where(and(eq(offers.id, current.id)))
    .returning()
  res.json({ offer: serializeOffer(updated) })
}
