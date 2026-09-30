import { pgTable, text, integer, boolean, doublePrecision, timestamp, jsonb, index } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  roles: jsonb('roles').notNull(), // ["farmer"], ["buyer"], or both
  email: text('email'),
  emailPending: text('email_pending'),
  emailVerified: boolean('email_verified').notNull().default(false),
  photoUrl: text('photo_url'),
  village: text('village'),
  businessName: text('business_name'),
  aadhaarLast4: text('aadhaar_last4'),
  upiId: text('upi_id'),
  gstin: text('gstin'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
})

export const listings = pgTable(
  'listings',
  {
    id: text('id').primaryKey(),
    category: text('category').notNull(),
    name: text('name').notNull(),
    farmerId: text('farmer_id').notNull().references(() => users.id),
    farmerName: text('farmer_name').notNull(),
    village: text('village').notNull(),
    price: doublePrecision('price').notNull(),
    unit: text('unit').notNull(),
    qty: text('qty').notNull(),
    grade: text('grade').notNull(),
    verified: boolean('verified').notNull().default(true),
    harvested: text('harvested').notNull(),
    tags: jsonb('tags').notNull(),
    photoUrl: text('photo_url'),
    photos: jsonb('photos').notNull(),
    videoUrl: text('video_url'),
    desc: text('desc'),
    offers: integer('offers').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  },
  (t) => [index('listings_category_idx').on(t.category), index('listings_created_at_idx').on(t.createdAt)]
)

export const requirements = pgTable(
  'requirements',
  {
    id: text('id').primaryKey(),
    category: text('category').notNull(),
    product: text('product').notNull(),
    buyerId: text('buyer_id').notNull().references(() => users.id),
    buyerName: text('buyer_name').notNull(),
    loc: text('loc').notNull(),
    qty: integer('qty').notNull(),
    unit: text('unit').notNull(),
    quality: text('quality').notNull(),
    maxPrice: doublePrecision('max_price').notNull(),
    needBy: text('need_by'),
    urgency: text('urgency').notNull(),
    desc: text('desc'),
    tags: jsonb('tags').notNull(),
    offers: integer('offers').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  },
  (t) => [index('requirements_category_idx').on(t.category), index('requirements_created_at_idx').on(t.createdAt)]
)

// Replaces the in-memory OTP Map — a free Render instance restarts/spins down,
// which would otherwise wipe pending OTPs. This table also means multiple
// API instances (a future paid tier) share OTP state correctly.
export const otpCodes = pgTable('otp_codes', {
  phone: text('phone').primaryKey(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  verifiedAt: timestamp('verified_at', { mode: 'date' }),
})
