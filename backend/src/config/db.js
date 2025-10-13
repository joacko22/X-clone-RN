import mongoose from 'mongoose';
import { ENV } from './env.js';
export const connectDB = async () => {
    try {
      await  mongoose.connect(ENV.MONGO_URI )
        console.info('MongoDB connected successfully ✅');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
        
    }
}