import express from 'express'
import validateRequest from '../middleware/validateRequest'
import { postValidation } from './post.validation'
import { postController } from './post.controller'
import authValidation from '../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post('/pet-post', validateRequest(postValidation.postValidationSchema), authValidation(USER_ROLE?.USER), postController.addPostController)
router.get('/pet-post', postController.getAllPostFromDB)
router.post('/pet-post/:postId/comments', postController.addCommentController)
router.put('/pet-post/:postId/comments/:commentId', postController.editCommentController)
router.delete('/pet-post/:postId/comments/:commentId', postController.deleteCommentController)
router.delete ('/pet-post/:postId', postController.deletePostController)
router.post ('/pet-post/:postId/upvote', postController.upvoteController)
router.post ('/pet-post/:postId/downvote', postController.downVoteController)

export const postRoute = router