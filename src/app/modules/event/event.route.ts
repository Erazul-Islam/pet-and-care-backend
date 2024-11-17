import express from 'express'
import { eventController } from './event.controller'

const router = express.Router()

router.post('/create-event',eventController.addEventController)
router.post('/create-interested/:eventId/interested',eventController.interestedEventController)

export const eventRoute = router