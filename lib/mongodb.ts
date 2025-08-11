import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'typing-practice';

if (!uri) {
  throw new Error('❌ Please define the MONGODB_URI environment variable in your Render environment settings');
}

// Even though SRV implies TLS, we set it explicitly for safety.
const options = {
  tls: true,
  tlsAllowInvalidCertificates: false, // Change to true only if self-signed cert (dev only)
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!(globalThis as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (globalThis as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (globalThis as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function getCollection<T = any>(collectionName: string) {
  const db = await getDb();
  return db.collection<T>(collectionName);
}
