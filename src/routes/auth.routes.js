import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { sendOtpSchema, verifyOtpSchema, completeSignupSchema } from '../schemas/auth.schema.js'
import {
  sendOtpHandler,
  verifyOtpHandler,
  completeSignupHandler,
  meHandler,
} from '../controllers/auth.controller.js'

const router = Router()

// An attacker spamming this endpoint is the classic way to rack up an SMS
// bill or brute-force a phone number — cap it hard.
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests — please wait a few minutes and try again' },
})

router.post('/send-otp', otpLimiter, validate(sendOtpSchema), sendOtpHandler)
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtpHandler)
router.post('/complete-signup', validate(completeSignupSchema), completeSignupHandler)
router.get('/me', requireAuth, meHandler)

export default router
