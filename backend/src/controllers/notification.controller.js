import asyncHandler from 'express-async-handler'
import { getAuth } from '@clerk/express'
import Notification from '../models/Notification.js'
import User from '../models/User.js'


export const getNotifications = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const notifications = await Notification.find({ user: user._id }).populate('from', 'username firstName lastName profilePicture').populate('post', 'content image').populate('comment', 'content').sort({ createdAt: -1 })
    if (!notifications) {
        return res.status(404).json({ message: 'No notifications found' })
    }
    return res.status(200).json({ notifications })
})

export const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        to: user._id
    })
    if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
    }
    return res.status(200).json({ message: 'Notification deleted' })
})