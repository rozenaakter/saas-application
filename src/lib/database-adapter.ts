//  lib/database-adapter.ts
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectToDatabase } from "./mongodb";

// We return a ready-to-use NextAuth adapter
export async function dbAdapter() {
  const { client } = await connectToDatabase();
  return MongoDBAdapter(client);
}
