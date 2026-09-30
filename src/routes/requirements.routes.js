import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createRequirementSchema } from '../schemas/requirement.schema.js'
import {
  listRequirementsHandler,
  createRequirementHandler,
  sendRequirementOfferHandler,
} from '../controllers/requirements.controller.js'

const router = Router()

router.get('/', listRequirementsHandler)
router.post('/', requireAuth, validate(createRequirementSchema), createRequirementHandler)
router.post('/:id/offers', requireAuth, sendRequirementOfferHandler)

export default router
