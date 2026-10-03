import { z } from 'zod'

export const sendOfferSchema = z.object({
  price: z.number().positive().optional(),
  qty: z.string().max(100).optional(),
  message: z.string().max(500).optional(),
})

export const updateOfferSchema = z.object({
  status: z.enum(['accepted', 'declined']),
})
