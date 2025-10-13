import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
   from: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true
   }, 
    to: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: "User",
        required: true
    },
    type: {
        type: String, // e.g., 'like', 'comment', 'follow'
        required: true,
        enum: ["like", "comment", "follow", "mention", "reply"] // Define the types of notifications
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Post model
        ref: "Post",
        required: false ,// Not required for all notification types
        default: null,
    }, 
    comment: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Comment model
        ref: "Comment",
        required: false, // Not required for all notification types
        default: null,
    },
})

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;