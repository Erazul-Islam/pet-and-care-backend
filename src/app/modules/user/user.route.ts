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

router.delete('/:userId', userController.deleteSingleUser)

router.get('/all-profile', userController.getAllProfile)

router.patch('/:userId', userController.getUpdatedUserRole)

router.post('/send', userController.sendFriendRequest)

router.post('/accept', userController.acceptFrinedRequest)

router.get('/:userId/pending', userController.viewFriendRequest)
router.get('/:userId/friend', userController.viewFriend)

export const userRoute = router