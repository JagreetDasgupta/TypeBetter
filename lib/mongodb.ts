import { MongoClient, Db } from 'mongodb'

const isMongoDisabled = process.env.MONGODB_DISABLED === 'true'

if (isMongoDisabled) {
  console.log('📴 MongoDB disabled - running in offline mode')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!isMongoDisabled && process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI
  const options = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  }

  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export async function getDb(): Promise<Db> {
  if (process.env.MONGODB_DISABLED === 'true') {
    throw new Error('MongoDB is disabled')
  }
  
  try {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME || 'typing-practice')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('Failed to connect to database')
  }
}

export async function getCollection(collectionName: string) {
  if (process.env.MONGODB_DISABLED === 'true') {
    throw new Error('MongoDB is disabled')
  }
  
  try {
    const db = await getDb()
    return db.collection(collectionName)
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}
