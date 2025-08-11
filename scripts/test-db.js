require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

async function testConnection() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB_NAME || 'typing-practice'
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables')
    console.log('Please check your .env.local file')
    process.exit(1)
  }
  
  console.log('🔍 Testing MongoDB connection...')
  console.log(`📡 URI: ${uri}`)
  console.log(`🗄️  Database: ${dbName}`)
  console.log('')
  
  let client
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri)
    await client.connect()
    console.log('✅ Connected to MongoDB successfully!')
    
    // Get database
    const db = client.db(dbName)
    console.log(`✅ Database "${dbName}" accessed successfully!`)
    
    // Test collections
    const collections = ['users', 'sessions', 'typing-tests', 'keystrokes', 'finger-usage', 'daily-stats']
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName)
        const count = await collection.countDocuments()
        console.log(`✅ Collection "${collectionName}": ${count} documents`)
      } catch (error) {
        console.log(`⚠️  Collection "${collectionName}": ${error.message}`)
      }
    }
    
    // Get database stats
    const stats = await db.stats()
    console.log('')
    console.log('📊 Database Statistics:')
    console.log(`   Collections: ${stats.collections}`)
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   Indexes: ${stats.indexes}`)
    
    console.log('')
    console.log('🎉 Database connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(`   Error: ${error.message}`)
    console.error('')
    console.error('🔧 Troubleshooting tips:')
    console.error('   1. Check if MongoDB is running')
    console.error('   2. Verify your MONGODB_URI in .env.local')
    console.error('   3. Ensure network connectivity')
    console.error('   4. Check MongoDB authentication credentials')
    
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Connection closed')
    }
  }
}

testConnection()
