const express = require('express');

const router = express.Router();


const {getUserProfile , updateUserProfile, syncUser, getCurrentUser, followUser} = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/auth.middleware');

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

module.exports = router;