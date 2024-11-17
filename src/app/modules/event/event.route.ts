import express from 'express'
import { eventController } from './event.controller'

const router = express.Router()

router.post('/create-event',eventController.addEventController)
router.post('/create-interested/:eventId/interested',eventController.interestedEventController)
router.patch('/ended-event/:eventId/ended',eventController.EndEventController)

export const eventRoute = router