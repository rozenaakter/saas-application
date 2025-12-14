import { Db } from "mongodb";
import { connectToDatabase } from "./mongodb";

// Simple helper function
export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
