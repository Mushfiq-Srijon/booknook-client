
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "booknook";

if (!uri) {
    throw new Error("MONGODB_URI is missing from environment variables.");
}

declare global {
    var mongoClient: MongoClient | undefined;
}

const client =
    global.mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
    global.mongoClient = client;
}

export const db = client.db(dbName);
export { client };
