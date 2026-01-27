import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/**
 * Get a database instance by name
 * @param dbName - Name of the database
 * @returns Database instance
 */
export async function getDb(dbName: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Get the shared users database
 */
export async function getUsersDb(): Promise<Db> {
  return getDb('users');
}

/**
 * Get a module-specific database
 * @param moduleName - Name of the module (e.g., 'gym-log')
 */
export async function getModuleDb(moduleName: string): Promise<Db> {
  return getDb(moduleName);
}

