import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to User model
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 280 // Twitter-like character limit
        },
        imageUrl: {
            type: String,
            default: ''
        },
        likes:[ {
            type: [mongoose.Schema.Types.ObjectId], // Array of User IDs who liked the post
            ref: 'User',
            default: []
        }],
        comments:[ {
            type: [mongoose.Schema.Types.ObjectId], // Array of Comment IDs
            ref: 'Comment',
            default: []
        }]
    }
    ,
    {
        timestamps: true // Automatically manage createdAt and updatedAt fields
    }
)
const Post = mongoose.model('Post', postSchema);
export default Post;