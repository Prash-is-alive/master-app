const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.VERCEL_MONGODB_URI;

async function createSampleUser() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.USERS_DB_NAME);
    const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME);

    // Create user object
    const user = {
      username: process.env.SAMPLE_USERNAME,
      email: process.env.SAMPLE_EMAIL,
      password: await bcrypt.hash(process.env.SAMPLE_PASSWORD, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username: user.username });
    if (existingUser) {
      console.log('User already exists!');
      return;
    }
    
    const result = await usersCollection.insertOne(user);
    console.log('✅ Sample user created successfully!');
    console.log('User ID:', result.insertedId);
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await client.close();
  }
}

createSampleUser();