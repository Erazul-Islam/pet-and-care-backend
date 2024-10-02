import express from 'express'
import validateRequest from '../middleware/validateRequest'
import { AuthValidation } from './auth.validation'
import { authController } from './auth.controller'
import verifyToken from '../middleware/change'

const router = express.Router()

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), authController.loginUser)
router.post('/change-password', validateRequest(AuthValidation.changePasswordValidationSchema),verifyToken ,authController.changePassword)

export const authRoute = router