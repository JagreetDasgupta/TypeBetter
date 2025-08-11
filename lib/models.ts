import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  username: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    soundEnabled: boolean
    keyboardLayout: 'qwerty' | 'azerty' | 'dvorak'
    defaultTestMode: 'time' | 'words' | 'quote'
    defaultTestDuration: number
    defaultWordCount: number
  }
  stats?: {
    totalTests: number
    totalTimeSpent: number
    averageWPM: number
    bestWPM: number
    averageAccuracy: number
    bestAccuracy: number
    totalWordsTyped: number
    totalCharactersTyped: number
    currentStreak: number
    longestStreak: number
  }
}

export interface TypingTest {
  _id?: ObjectId
  userId: ObjectId
  testMode: 'time' | 'words' | 'quote'
  duration: number // in seconds
  wordCount: number
  wpm: number
  accuracy: number
  adjustedWPM: number
  errors: number
  charactersTyped: number
  charactersCorrect: number
  text: string
  completedAt: Date
  createdAt: Date
}

export interface KeystrokeData {
  _id?: ObjectId
  userId: ObjectId
  testId: ObjectId
  key: string
  timestamp: Date
  isCorrect: boolean
  delay: number // time since last keystroke in ms
  finger: string
}

export interface FingerUsage {
  _id?: ObjectId
  userId: ObjectId
  date: Date
  finger: string
  usage: number // percentage
  accuracy: number
  speed: number // average keystroke time in ms
  errors: number
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  sessionToken: string
  expiresAt: Date
  createdAt: Date
  lastActivityAt: Date
  userAgent?: string
  ipAddress?: string
}

export interface LeaderboardEntry {
  _id?: ObjectId
  userId: ObjectId
  username: string
  wpm: number
  accuracy: number
  testMode: 'time' | 'words' | 'quote'
  duration: number
  createdAt: Date
  isVerified: boolean
}

export interface DailyStats {
  _id?: ObjectId
  userId: ObjectId
  date: Date
  testsCompleted: number
  totalTimeSpent: number
  averageWPM: number
  bestWPM: number
  averageAccuracy: number
  totalWordsTyped: number
  totalCharactersTyped: number
  errors: number
}
