// lib/mongodb.ts
import { Db, MongoClient } from "mongodb";

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "chat";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env"
  );
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    //  MongoDB
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    //  MongoDB
    await client.connect();
    const db = client.db(MONGODB_DB);

    // client
    cachedClient = client;
    cachedDb = db;

    console.log("✅ Connected to MongoDB successfully");
    return { client, db };
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}

export class MongoDBService {
  public db: Db;

  constructor(db: Db) {
    this.db = db;
  }
}

//MongoDB
export async function getMongoDBService(): Promise<MongoDBService> {
  const { db } = await connectToDatabase();
  return new MongoDBService(db);
}

// ============================================
// NextAuth Adapter এর জন্য clientPromise
// ============================================
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Development mode: global variable use করে connection preserve করা
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production mode: নতুন client তৈরি করা
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;