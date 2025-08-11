import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import { ObjectId } from 'mongodb'

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
]

export async function POST(request: NextRequest) {
  try {
    // Force create collections
    const usersCollection = await getCollection('users')
    const testsCollection = await getCollection('typing-tests')
    
    // Create indexes for better performance
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ username: 1 }, { unique: true })
    await testsCollection.createIndex({ userId: 1 })
    await testsCollection.createIndex({ testMode: 1 })
    await testsCollection.createIndex({ wpm: -1 })
    
    let createdUsers = 0
    let createdTests = 0
    
    console.log('Starting dummy data population...')
    
    for (const userData of dummyUsers) {
      try {
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: userData.email })
        if (existingUser) {
          console.log(`User ${userData.username} already exists, skipping...`)
          continue
        }
        
        // Hash password
        const passwordHash = await hashPassword('password123')
        
        // Create user
        const user = {
          email: userData.email,
          username: userData.username,
          passwordHash,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
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
        }
        
        const userResult = await usersCollection.insertOne(user)
        const userId = userResult.insertedId
        createdUsers++
        
        // Create multiple test results for each user
        const testModes = ['time', 'words', 'quote']
        const testCount = Math.floor(Math.random() * 10) + 5
        
        for (let i = 0; i < testCount; i++) {
          const testMode = testModes[Math.floor(Math.random() * testModes.length)]
          const wpmVariation = Math.floor(Math.random() * 20) - 10
          const accuracyVariation = Math.floor(Math.random() * 10) - 5
          
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
          }
          
          await testsCollection.insertOne(test)
          createdTests++
        }
        
        console.log(`Created user: ${userData.username} with ${testCount} test results`)
        
      } catch (userError) {
        console.error(`Error creating user ${userData.username}:`, userError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Dummy data populated successfully',
      stats: {
        usersCreated: createdUsers,
        testsCreated: createdTests
      }
    })
    
  } catch (error) {
    console.error('Error populating dummy data:', error)
    return NextResponse.json(
      { error: 'Failed to populate dummy data', details: error.message },
      { status: 500 }
    )
  }
}