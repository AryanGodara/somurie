import mongoose from 'mongoose';
import { env } from './env';

// Remove mongoose deprecation warnings
mongoose.set('strictQuery', false);

// Connection options
const options = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('🟢 MongoDB is already connected');
      return;
    }
    
    await mongoose.connect(env.MONGODB_URI, options);
    console.log('🟢 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('🟠 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Failed to disconnect from MongoDB:', error);
    process.exit(1);
  }
}

// Listen for connection errors after initial connection
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Listen for disconnection
mongoose.connection.on('disconnected', () => {
  console.log('🔴 MongoDB disconnected');
});

// Listen for process termination and close the connection
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});
