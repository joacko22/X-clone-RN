import express from 'express';
import { ENV } from './config/env.js';
import cors from 'cors';
import { connectDB } from './config/db.js';
import {clerkMiddleware} from "@clerk/express"
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import commentsRoutes from './routes/comment.routes.js'; 
const app = express();

app.use(express.json());

app.use(cors())
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/users', userRoutes);
app.use('/api/posts',postRoutes)
app.use('/api/comments',commentsRoutes)
app.use((err,req,res)=>{
  console.error("Unhadled error: ", err);
  res.status(500).json({error:err.message || "Internal server error"})
  
})
const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  } finally {
    console.log('Server started successfully');
  } 
}
startServer();
