import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { updateProfileSchema, sendEmailSchema } from '../schemas/user.schema.js'
import {
  updateProfileHandler,
  sendEmailVerificationHandler,
  confirmEmailVerificationHandler,
} from '../controllers/users.controller.js'

const router = Router()

router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfileHandler)
router.post('/me/email/send', requireAuth, validate(sendEmailSchema), sendEmailVerificationHandler)
router.post('/me/email/confirm', requireAuth, confirmEmailVerificationHandler)

export default router
