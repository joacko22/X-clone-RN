import express from'express';

const router = express.Router();


import {getUserProfile , updateUserProfile, syncUser, getCurrentUser, followUser} from'../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

//PUBLIC ROUTES
// GET /users/profile/:username - Get user profile by username
router.get('/profile/:username', getUserProfile);

// AUTHENTICATED ROUTES

// POST /users/sync - Create 
router.post('/sync',protectRoute,syncUser);

router.post('/me', protectRoute, getCurrentUser);

// PUT /users/ - Update user by ID with authentication
router.put('/profile',protectRoute, updateUserProfile);
// POST /users/follow/:targetUserId - Follow or unfollow a user
router.post('/follow/:targetUserId', protectRoute, followUser);

export default router;