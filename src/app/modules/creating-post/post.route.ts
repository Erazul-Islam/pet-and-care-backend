import express from 'express'
import validateRequest from '../middleware/validateRequest'
import { postValidation } from './post.validation'
import { postController } from './post.controller'

const router = express.Router()

router.post('/pet-post', validateRequest(postValidation.postValidationSchema), postController.addPostController)
router.get('/pet-post', postController.getAllPostFromDB)
router.post('/pet-post/:postId/comments', postController.addCommentController)
router.put('/pet-post/:postId/comments/:commentId', postController.editCommentController)
router.delete('/pet-post/:postId/comments/:commentId', postController.deleteCommentController)
router.delete('/pet-post/:postId', postController.deletePostController)
router.post('/pet-post/:postId/upvote', postController.upvoteController)
router.post('/pet-post/:postId/downvote', postController.downVoteController)
router.patch('/pet-post/:postId/unpublish', postController.unPublishController)
router.patch('/pet-post/:postId/publish', postController.PublishController)
router.get('/search', postController.searchProductsController)
router.get('/my-posts',postController.getAllMyPostsController)
router.get('/pagenated-posts',postController.getPaginatedPostsFromDB)

export const postRoute = router