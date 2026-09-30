import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createListingSchema } from '../schemas/listing.schema.js'
import {
  listListingsHandler,
  createListingHandler,
  sendListingOfferHandler,
} from '../controllers/listings.controller.js'

const router = Router()

router.get('/', listListingsHandler) // public — anyone can browse without logging in
router.post('/', requireAuth, validate(createListingSchema), createListingHandler)
router.post('/:id/offers', requireAuth, sendListingOfferHandler)

export default router
