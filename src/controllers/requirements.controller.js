import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { db } from '../lib/db.js'
import { requirements } from '../db/schema.js'

function serializeRequirement(r) {
  const { category, buyerName, createdAt, ...rest } = r
  return { ...rest, cat: category, buyer: buyerName, createdAt: createdAt.toISOString() }
}

export async function listRequirementsHandler(req, res) {
  const rows = await db.select().from(requirements).orderBy(desc(requirements.createdAt))
  res.json({ requirements: rows.map(serializeRequirement) })
}

export async function createRequirementHandler(req, res) {
  if (!req.user.roles.includes('buyer')) {
    return res.status(403).json({ error: 'Only buyer accounts can post requirements' })
  }
  const [row] = await db
    .insert(requirements)
    .values({
      id: randomUUID(),
      ...req.body,
      buyerId: req.user.id,
      buyerName: req.user.name,
      createdAt: new Date(),
    })
    .returning()
  res.status(201).json({ requirement: serializeRequirement(row) })
}

export async function sendRequirementOfferHandler(req, res) {
  const current = await db.select().from(requirements).where(eq(requirements.id, req.params.id)).then((r) => r[0])
  if (!current) return res.status(404).json({ error: 'Requirement not found' })
  if (current.buyerId === req.user.id) {
    return res.status(400).json({ error: "You can't send an offer on your own requirement" })
  }
  const [updated] = await db
    .update(requirements)
    .set({ offers: current.offers + 1 })
    .where(eq(requirements.id, current.id))
    .returning()
  res.json({ requirement: serializeRequirement(updated) })
}
