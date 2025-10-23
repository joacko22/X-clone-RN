import asyncHandler from 'express-async-handler';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import Comment from "../models/comment.model.js"
import {getAuth} from "@clerk/express"
import cloudinary from '../config/cloudinary.js';
/** 
 *  @description Get all posts sorted by date
 * @route   GET /api/posts
 * @access  Public
 * @return  {Promise<void>}
*/
export const getPosts = asyncHandler(async (req, res) => {
    // Fetch all posts, sorted by creation date in descending order
    // Populate user details and comments with user details
    //Populate sirve para traer los datos de las relaciones y lo que hace es que en vez de traer solo el id del usuario, trae toda la info del usuario
    //Tambien se puede hacer un populate anidado, por ejemplo, si quiero traer los datos del usuario que hizo el comentario, puedo hacer un populate dentro de otro populate
    //Esto es util para cuando quiero mostrar los posts con los datos del usuario que los creo
    // path es la ruta del campo que quiero popular, en este caso es comments
    // select es para seleccionar los campos que quiero traer del usuario, en este caso solo quiero traer username, firstName, lastName y profilePicture

const posts = await Post.find({}).sort({ createdAt: -1 }).populate('user', 'username firstName lastName profilePicture').populate({
    path: 'comments',
    populate: {
        path: 'user',
        select: 'username firstName lastName profilePicture'
    }
});
if (!posts) {
        return res.status(404).json({ message: 'No posts found' });
    }
   return res.status(200).json({posts});
})

export const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('user', 'username firstName lastName profilePicture').populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'username firstName lastName profilePicture'
        }
    });
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json({ post });
})

export const getPostsByUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate('user', 'username firstName lastName profilePicture').populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'username firstName lastName profilePicture'
        }
    });
    res.status(200).json({ posts });
})

export const createPost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req)
    const {content} = req.body;
    const image = req.file ; 
    if (!content && !image) {
        return res.status(400).json({ message: 'Content or image is required' });
    }
    const user = await User .findOne({clerckId: userId});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    let imageUrl = "";
    if (image){
        try {
            //convert buffer to base64 for cloudnary
            const base64Image = `data ${image.mimetype};base64,${image.buffer.toString("base64")}`
            const uploadResponse = await cloudinary.uploader.upload(base64Image,{
                folder:"social_media_posts",
                resource_type:"image",
                transformation:[
                    {width:800, height:600,crop:"limit"},
                    {quality:"auto"},
                    {format:"auto"}
                ]
            })
            imageUrl =uploadResponse.secure_url
        } catch (error) {
            console.log("Cloudnary error",error);
            res.status(400).json({
                message:"Failed to upload image"
            })
        }
    }
    const post = await Post.create({
        user:user._id,
        content:content || "",
        image:imageUrl,
    })
    res.status(201).json({post})
})

export const likePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;
    const user = await User.findOne({ clerckId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
        return res.status(404).json({ message: 'User or Post not found' });
    }
    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
        // If already liked, remove the like (unlike)
        await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
    } else {
        // If not liked yet, add the like
        await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });
    }
    //create notification if not liking own post
    if (!isLiked && post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: 'like',
            post: postId,
           // read: false,
        })
    }
    res.status(200).json({
        message:isLiked ? "Post unliked successfully" :"Post liked successfully"
    })
})

export const deletePost = asyncHandler(async(req,res)=>{
    const {userId} = getAuth(req)
    const {postId} = req.params

    const user = await User.findOne({clerkId:userId})
    const post = await Post.findById(postId)
    if (!user || !post) {
        return res.status(404).json({error:"User or post not Found"})
    }
    //delete all comments on this post 
    await Comment.deleteMany({post:postId})
    //delete the post
    await Post.findByIdAndDelete(postId)
    res.status(200).json({message:"Post deleted successfully"})
})