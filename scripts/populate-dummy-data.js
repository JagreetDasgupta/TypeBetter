const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/typing-practice';
const dbName = process.env.MONGODB_DB_NAME || 'typing-practice';

// Dummy user data
const dummyUsers = [
  { username: 'SpeedDemon', email: 'speeddemon@example.com', wpm: 120, accuracy: 98 },
  { username: 'TypeMaster', email: 'typemaster@example.com', wpm: 115, accuracy: 96 },
  { username: 'KeyboardNinja', email: 'keyboardninja@example.com', wpm: 110, accuracy: 99 },
  { username: 'FastFingers', email: 'fastfingers@example.com', wpm: 105, accuracy: 94 },
  { username: 'TypingPro', email: 'typingpro@example.com', wpm: 100, accuracy: 97 },
  { username: 'QuickType', email: 'quicktype@example.com', wpm: 95, accuracy: 93 },
  { username: 'RapidTyper', email: 'rapidtyper@example.com', wpm: 90, accuracy: 95 },
  { username: 'SwiftKeys', email: 'swiftkeys@example.com', wpm: 85, accuracy: 92 },
  { username: 'FlashType', email: 'flashtype@example.com', wpm: 80, accuracy: 90 },
  { username: 'LightningFast', email: 'lightningfast@example.com', wpm: 75, accuracy: 88 },
  { username: 'TypingWiz', email: 'typingwiz@example.com', wpm: 70, accuracy: 91 },
  { username: 'KeyStroke', email: 'keystroke@example.com', wpm: 65, accuracy: 89 },
  { username: 'WordRacer', email: 'wordracer@example.com', wpm: 60, accuracy: 87 },
  { username: 'TypingBeast', email: 'typingbeast@example.com', wpm: 55, accuracy: 85 },
  { username: 'SpeedTyper', email: 'speedtyper@example.com', wpm: 50, accuracy: 83 }
];

async function populateDummyData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const testsCollection = db.collection('typing-tests');
    
    // Clear existing dummy data (optional)
    console.log('Clearing existing dummy data...');
    try {
      await usersCollection.deleteMany({ email: { $regex: '@example.com$' } });
      console.log('Existing dummy data cleared');
    } catch (error) {
      console.log('Skipping clear operation (may not have permissions):', error.message);
    }
    
    // Create dummy users and tests
    console.log('Creating dummy users and leaderboard data...');
    
    for (const userData of dummyUsers) {
      // Hash password
      const passwordHash = await bcrypt.hash('password123', 12);
      
      // Create user
      const user = {
        email: userData.email,
        username: userData.username,
        passwordHash,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        updatedAt: new Date(),
        preferences: {
          theme: 'dark',
          soundEnabled: true,
          keyboardLayout: 'qwerty',
          defaultTestMode: 'time',
          defaultTestDuration: 60,
          defaultWordCount: 50,
        },
        stats: {
          totalTests: Math.floor(Math.random() * 100) + 10,
          totalTimeSpent: Math.floor(Math.random() * 10000) + 1000,
          averageWPM: userData.wpm - Math.floor(Math.random() * 10),
          bestWPM: userData.wpm,
          averageAccuracy: userData.accuracy - Math.floor(Math.random() * 5),
          bestAccuracy: userData.accuracy,
          totalWordsTyped: Math.floor(Math.random() * 50000) + 5000,
          totalCharactersTyped: Math.floor(Math.random() * 250000) + 25000,
          currentStreak: Math.floor(Math.random() * 15),
          longestStreak: Math.floor(Math.random() * 30) + 15,
        },
      };
      
      const userResult = await usersCollection.insertOne(user);
      const userId = userResult.insertedId;
      
      // Create multiple test results for each user
      const testModes = ['time', 'words', 'quote'];
      const testCount = Math.floor(Math.random() * 10) + 5; // 5-15 tests per user
      
      for (let i = 0; i < testCount; i++) {
        const testMode = testModes[Math.floor(Math.random() * testModes.length)];
        const wpmVariation = Math.floor(Math.random() * 20) - 10; // ±10 WPM variation
        const accuracyVariation = Math.floor(Math.random() * 10) - 5; // ±5% accuracy variation
        
        const test = {
          userId,
          testMode,
          duration: testMode === 'time' ? [30, 60, 120][Math.floor(Math.random() * 3)] : Math.floor(Math.random() * 120) + 30,
          wordCount: testMode === 'words' ? [25, 50, 100][Math.floor(Math.random() * 3)] : Math.floor(Math.random() * 100) + 25,
          wpm: Math.max(20, userData.wpm + wpmVariation),
          accuracy: Math.max(70, Math.min(100, userData.accuracy + accuracyVariation)),
          adjustedWPM: Math.max(15, userData.wpm + wpmVariation - Math.floor(Math.random() * 5)),
          errors: Math.floor(Math.random() * 10),
          charactersTyped: Math.floor(Math.random() * 500) + 100,
          charactersCorrect: Math.floor(Math.random() * 450) + 90,
          text: "Sample typing test text for leaderboard entry",
          completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        };
        
        await testsCollection.insertOne(test);
      }
      
      console.log(`Created user: ${userData.username} with ${testCount} test results`);
    }
    
    console.log('✅ Dummy data populated successfully!');
    console.log(`Created ${dummyUsers.length} users with test results`);
    
    // Display some stats
    const totalUsers = await usersCollection.countDocuments();
    const totalTests = await testsCollection.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);
    console.log(`Total tests in database: ${totalTests}`);
    
  } catch (error) {
    console.error('Error populating dummy data:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
populateDummyData().catch(console.error);