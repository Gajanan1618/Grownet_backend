import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { updateOfferSchema } from '../schemas/offer.schema.js'
import { listReceivedOffersHandler, updateOfferStatusHandler } from '../controllers/offers.controller.js'

const router = Router()

router.get('/', requireAuth, listReceivedOffersHandler)
router.patch('/:id', requireAuth, validate(updateOfferSchema), updateOfferStatusHandler)

export default router
