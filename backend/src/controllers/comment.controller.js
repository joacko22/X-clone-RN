import AsyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getComment = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate("user", "username firstName lastName profilePicture")
    .sort({ createdAt: -1 });
    if (!comments) {
        return res.status(404).json({ message: "No comments found" });
    }
    return res.status(200).json({ comments });
}
);

export const createComment = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = getAuth(req);
    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findById
    (postId).populate('user');
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    const comment = await Comment.create({
        content,
        user: user._id,
        post: post._id
    });
     // Add the comment to the post's comments array
await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    // Create a notification for the post owner
    if (post.user._id.toString() !== user._id.toString()) {
        await Notification.create({
            type: 'comment',
            user: post.user,
            from: user._id,
            post: postId,
            comment: comment._id,
           
        });
    }
    return res.status(201).json({ message: "Comment created", comment });
} );

export const deleteComment = AsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }
    await Comment.findByIdAndDelete(commentId);
    // Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    return res.status(200).json({ message: "Comment deleted" });
} );