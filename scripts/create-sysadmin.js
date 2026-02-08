/**
 * Script to create the root sysadmin user
 *
 * Usage:
 *   node scripts/create-sysadmin.js
 *
 * This creates a "sysadmins" collection in the users DB
 * with a root user for privileged operations.
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.USERS_DB_NAME;
const sysadminCollectionName = process.env.SYSADMIN_COLLECTION_NAME;

const SYSADMIN_USERNAME = process.env.SYSADMIN_USERNAME;
const SYSADMIN_PASSWORD = process.env.SYSADMIN_PASSWORD;

async function createSysadmin() {
  if (!uri || !dbName) {
    console.error('❌ MONGODB_URI and USERS_DB_NAME must be set in .env.local');
    process.exit(1);
  }

  if (!SYSADMIN_PASSWORD) {
    console.error('❌ Please set SYSADMIN_PASSWORD in this script before running.');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(sysadminCollectionName);

    // Create unique index on username
    await collection.createIndex({ username: 1 }, { unique: true });
    console.log('✅ Ensured unique index on username');

    // Check if root already exists
    const existing = await collection.findOne({ username: SYSADMIN_USERNAME });
    if (existing) {
      console.log(`⚠️  Sysadmin "${SYSADMIN_USERNAME}" already exists. Skipping.`);
      return;
    }

    // Hash password and insert
    const hashedPassword = await bcrypt.hash(SYSADMIN_PASSWORD, 10);

    const result = await collection.insertOne({
      username: SYSADMIN_USERNAME,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Sysadmin "${SYSADMIN_USERNAME}" created successfully!`);
    console.log('   ID:', result.insertedId.toString());
  } catch (error) {
    console.error('❌ Error creating sysadmin:', error);
  } finally {
    await client.close();
  }
}

createSysadmin();

