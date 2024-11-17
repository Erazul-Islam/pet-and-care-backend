import express from 'express'
import { eventController } from './event.controller'

const router = express.Router()

router.post('/create-event',eventController.addEventController)

export const eventRoute = router