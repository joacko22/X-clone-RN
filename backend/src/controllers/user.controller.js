import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js'; 
import Notification from '../models/notification.model.js';
import { clerkClient, getAuth } from '@clerk/express';

export const getUserProfile = asyncHandler( async(req, res) => {
    const {username} = req.params
    // Logic to fetch user profile by username
   const user = await User.findOne({ username });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.status(200).json({user});
    }
})

export const updateUserProfile = asyncHandler(async (req, res) => {
    //  Extract userId from request using Clerk's getAuth function
    // This assumes that the user is authenticated and Clerk's middleware has been applied
   const {userId}= getAuth(req)

    // Logic to update user profile by username
    const user = await User.findOneAndUpdate(
       {userId}, req.body, { new: true, runValidators: true }
    );
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.status(200).json({ user });
    }
});

export const syncUser = asyncHandler(async (req, res) => {
    // Logic to sync user data
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

  //check if user exists
    const existingUser = await User.findOne({clerkId: userId});
    if (existingUser) {
        return res.status(200).json({ message: 'User already exist' });
    }
    // Create a new user for Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const userData = {
        clerkId: userId,
        username: clerkUser.emailAddresses[0]?.emailAddress ? clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] : `user-${Date.now()}`, // john@gmail,com -> john 
        email: clerkUser.emailAddresses[0]?.emailAddress,
        profileImageUrl: clerkUser.profileImageUrl,
    };
    // Save the user to the database
    const newUser = await User.create(userData);
    res.status(201).json({ user: newUser , message: 'User created successfully' });
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    // Extract userId from request using Clerk's getAuth function
    const { userId } = getAuth(req);
    
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch the user from the database
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
})

export const followUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (userId === targetUserId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    // Find the current user
    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
        return res.status(404).json({ message: 'Current user not found' });
    }

    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        return res.status(404).json({ message: 'Target user not found' });
    }
    const isFollowing = currentUser.following.includes(targetUserId);
    if (isFollowing){
        // Unfollow the user
        await User.findByIdAndUpdate(
            currentUser._id,
            { $pull: { following: targetUserId } },
          
        );
        await User.findByIdAndUpdate(
            targetUser._id,
            { $pull: { followers: currentUser._id } },
        );
    }else {
        // Follow targetUser
        await User.findByIdAndUpdate(
            currentUser._id,
            { $push:{following:targetUserId } })

        await User.findByIdAndUpdate(
            targetUserId,
            {$push:{followers:currentUser._id}}
        )
         // Create a notification for the target user
        await Notification.create({
            from:currentUser._id,
            to: targetUser._id,
            type: 'follow',
        })
    }

    res.status(200).json({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
});