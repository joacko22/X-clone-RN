import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {timestastamp: true },
    {
        clerkId: { type: String, required: true, unique: true } ,
    
        email:{ type: String, required: true, unique: true } ,
    
        firstName: { type: String, required: true } ,
    
        lastName: { type: String, required: true } ,
    
        profileImageUrl: { type: String, default:"" } ,

        bannerImageUrl: { type: String, default:"" } ,

        bio: { type: String, default:"" ,maxlength: 160 } ,

        location: { type: String, default:"" } ,

        followers:{
            type:mongoose.Schema.Types.ObjectId, // Reference to User model 
            ref: "User",
            default: [] // Array of User IDs
        },
        following:{
            type:mongoose.Schema.Types.ObjectId, // Reference to User model 
            ref: "User",
            default: [] // Array of User IDs
        }
    },
)
const User = mongoose.model("User", userSchema);
export default User;