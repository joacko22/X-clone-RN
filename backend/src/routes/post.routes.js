import express from 'express';
const router = express.Router();

import { createPost, deletePost, getPostById, getPosts, getPostsByUser, likePost } from '../controllers/post.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
//public routes
router.get("/",getPosts)
router.get("/:postId", getPostById);
router.get("/user/:username", getPostsByUser);

//protected routes
router.post("/",protectRoute,upload.single("image"),createPost)
router.post("/:postId/like",protectRoute,likePost)
router.delete("/:postId",protectRoute,deletePost)
export default router;