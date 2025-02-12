import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logWithContext } from '../logs/logger';

dotenv.config();

const mongoURI = process.env.MONGO_CONNECTION_STRING;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI!, {
      dbName: process.env.MONGO_DATASOURCE,
    });
    logWithContext({
      level: 'info',
      message: 'MongoDB connected successfully',
      file: 'db.ts',
      data: undefined,
      errors: undefined,
    });
  } catch (error) {
    logWithContext({
      level: 'error',
      message: 'Error connecting to MongoDB',
      file: 'db.ts',
      data: undefined,
      errors: error,
    });
    process.exit(1);
  }
};

export default connectDB;
