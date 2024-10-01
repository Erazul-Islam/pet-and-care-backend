import express from 'express'
import { userController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../middleware/validateRequest';


const router = express.Router();

router.post(
    '/register',
    validateRequest(UserValidation.userValidationSchema),
    userController.signUpRegistration,
);

router.get('/me',  userController.getProfile)

router.put('/me',  userController.getUpdatedUser)

router.post('/follow/:id',userController.followConntroller)
router.post('/unfollow/:id',userController.unfollowCoontroller)

export const userRoute = router