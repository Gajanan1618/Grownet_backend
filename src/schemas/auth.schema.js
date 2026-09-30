import { z } from 'zod'

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
})

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  code: z.string().length(6),
})

export const completeSignupSchema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  name: z.string().min(2).max(80),
  roles: z.array(z.enum(['farmer', 'buyer'])).min(1),
})
