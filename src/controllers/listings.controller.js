import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { db } from '../lib/db.js'
import { listings } from '../db/schema.js'
import { recordOffer } from './offers.controller.js'

function serializeListing(l) {
  const { category, farmerName, createdAt, ...rest } = l
  return { ...rest, cat: category, farmer: farmerName, createdAt: createdAt.toISOString() }
}

export async function listListingsHandler(req, res) {
  const rows = await db.select().from(listings).orderBy(desc(listings.createdAt))
  res.json({ listings: rows.map(serializeListing) })
}

export async function createListingHandler(req, res) {
  if (!req.user.roles.includes('farmer')) {
    return res.status(403).json({ error: 'Only farmer accounts can create listings' })
  }
  const [listing] = await db
    .insert(listings)
    .values({
      id: randomUUID(),
      ...req.body,
      farmerId: req.user.id,
      farmerName: req.user.name,
      createdAt: new Date(),
    })
    .returning()
  res.status(201).json({ listing: serializeListing(listing) })
}

export async function sendListingOfferHandler(req, res) {
  const current = await db.select().from(listings).where(eq(listings.id, req.params.id)).then((r) => r[0])
  if (!current) return res.status(404).json({ error: 'Listing not found' })
  if (current.farmerId === req.user.id) {
    return res.status(400).json({ error: "You can't send an offer on your own listing" })
  }
  const [updated] = await db
    .update(listings)
    .set({ offers: current.offers + 1 })
    .where(eq(listings.id, current.id))
    .returning()

  await recordOffer({
    targetType: 'listing',
    targetId: current.id,
    targetTitle: current.name,
    fromUser: req.user,
    toUserId: current.farmerId,
    body: req.body,
  })

  res.json({ listing: serializeListing(updated) })
}
