import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  village: z.string().max(120).optional(),
  businessName: z.string().max(120).optional(),
  aadhaarLast4: z.string().regex(/^\d{4}$/).or(z.literal('')).optional(),
  upiId: z
    .string()
    .regex(/^[\w.-]+@[\w.-]+$/, 'Enter a valid UPI ID, e.g. name@bank')
    .or(z.literal(''))
    .optional(),
  gstin: z.string().max(20).optional(),
  photoUrl: z.string().optional(), // data URL for now; swap to an uploaded file URL once S3/R2 is wired up
})

export const sendEmailSchema = z.object({
  email: z.string().email(),
})
