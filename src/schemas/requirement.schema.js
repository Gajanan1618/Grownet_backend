import { z } from 'zod'

export const createRequirementSchema = z.object({
  category: z.enum(['grains', 'vegetables', 'fruits', 'pulses', 'spices', 'dairy', 'organic']),
  product: z.string().min(2).max(120),
  loc: z.string().min(2).max(120),
  qty: z.number().positive(),
  unit: z.enum(['kg', 'quintal', 'tonne', 'litre']),
  quality: z.enum(['Standard', 'Good', 'Premium', 'Organic']),
  maxPrice: z.number().positive(),
  needBy: z.string().optional(),
  urgency: z.enum(['normal', 'soon', 'urgent']),
  desc: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
})
