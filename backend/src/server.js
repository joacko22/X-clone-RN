import express from 'express';
import { ENV } from './config/env.js';
import cors from 'cors';
import { connectDB } from './config/db.js';
import {clerkMiddleware} from "@clerk/express"
import {arcjetMiddleware} from "./middleware/arcjet.middleware.js"
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentsRoutes from './routes/comment.routes.js'; 
import notificationRoutes from "./routes/notification.routes.js"
const app = express();

app.use(express.json());

app.use(cors())
app.use(clerkMiddleware());
app.use(arcjetMiddleware())
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/users', userRoutes);
app.use('/api/posts',postRoutes)
app.use('/api/comments',commentsRoutes)
app.use('/api/notifications',notificationRoutes)

app.use((err,req,res)=>{
  console.error("Unhadled error: ", err);
  res.status(500).json({error:err.message || "Internal server error"})
  
})
const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
       app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
    }
   
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  } finally {
    console.log('Server started successfully');
  } 
}
startServer();

//export for vercel
export default app;
