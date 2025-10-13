import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import {createComment,getComment, deleteComment} from '../controllers/comment.controller.js'

const router = express.Router();
//Public route to get a comment by id
router.get('/post/:postId', getComment);
//Protected route to create a comment
router.post('post/:postId', protectRoute, createComment);
//Protected route to delete a comment
router.delete('/:commentId', protectRoute, deleteComment);

export default router;