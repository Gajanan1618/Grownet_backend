import { z } from 'zod'

export const createListingSchema = z.object({
  category: z.enum(['grains', 'vegetables', 'fruits', 'pulses', 'spices', 'dairy', 'organic']),
  name: z.string().min(2).max(120),
  village: z.string().min(2).max(120),
  price: z.number().positive(),
  unit: z.enum(['kg', 'quintal', 'tonne', 'litre']),
  qty: z.string().min(1),
  grade: z.enum(['Standard', 'Good', 'Premium', 'Organic']),
  harvested: z.string().default('Freshly listed'),
  tags: z.array(z.string()).default([]),
  photoUrl: z.string().optional(),
  photos: z.array(z.string()).max(5).default([]),
  videoUrl: z.string().optional(),
  desc: z.string().max(1000).optional(),
})
