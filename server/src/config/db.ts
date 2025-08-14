import mongoose from 'mongoose'
import { env } from './env'

// Configure mongoose options
mongoose.set('strictQuery', false)

const options = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('🟢 MongoDB already connected')
      return
    }

    await mongoose.connect(env.MONGODB_URI, options)
    console.log('🟢 MongoDB connected successfully')

    // Set up event listeners
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('🔴 MongoDB disconnected')
    })
  } catch (error) {
    console.error(
      '❌ MongoDB connection error:',
      error instanceof Error ? error.message : String(error),
    )
    throw error // Let the caller handle process exit if needed
  }
}

/**
 * Disconnect from MongoDB database
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect()
    console.log('🟠 MongoDB disconnected')
  } catch (error) {
    console.error(
      '❌ Failed to disconnect from MongoDB:',
      error instanceof Error ? error.message : String(error),
    )
    throw error // Let the caller handle process exit if needed
  }
}
