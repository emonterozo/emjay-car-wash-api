import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_CONNECTION_STRING;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI!, {
      dbName: process.env.MONGO_DATASOURCE,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
