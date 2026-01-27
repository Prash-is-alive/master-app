/**
 * Database Setup Script
 * Run this script to create indexes in MongoDB
 * 
 * Usage: node scripts/setup-db.js
 * 
 * Make sure MongoDB is running and MONGODB_URI is set in .env.local
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.VERCEL_MONGODB_URI;

async function setupDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Setup Users Database
    const usersDb = client.db(process.env.USERS_DB_NAME);
    const usersCollection = usersDb.collection(process.env.USERS_COLLECTION_NAME);

    // Create indexes for users
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });

    // Setup Gym-Log Database
    const gymLogDb = client.db(process.env.GYM_LOG_DB_NAME);
    const workoutLogsCollection = gymLogDb.collection(process.env.GYM_LOG_COLLECTION_NAME);

    // Create indexes for workout_logs
    await workoutLogsCollection.createIndex({ id: 1 }, { unique: true });
    await workoutLogsCollection.createIndex({ userId: 1 });
    await workoutLogsCollection.createIndex({ userId: 1, date: -1 });
    await workoutLogsCollection.createIndex({ date: -1 });
    await workoutLogsCollection.createIndex({ createdAt: -1 });

    console.log('\n✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();

