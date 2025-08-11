import { getCollection } from './mongodb'
import { TypingTest, KeystrokeData, FingerUsage, DailyStats, LeaderboardEntry } from './models'
import { ObjectId } from 'mongodb'

export async function saveTypingTest(testData: Omit<TypingTest, '_id' | 'createdAt'>): Promise<ObjectId> {
  const testsCollection = await getCollection('typing-tests')
  
  const test: Omit<TypingTest, '_id'> = {
    ...testData,
    createdAt: new Date(),
  }

  const result = await testsCollection.insertOne(test)
  return result.insertedId
}

export async function saveKeystrokeData(keystrokeData: Omit<KeystrokeData, '_id'>): Promise<ObjectId> {
  const keystrokesCollection = await getCollection('keystrokes')
  
  const keystroke: Omit<KeystrokeData, '_id'> = {
    ...keystrokeData,
  }

  const result = await keystrokesCollection.insertOne(keystroke)
  return result.insertedId
}

export async function saveFingerUsage(fingerUsage: Omit<FingerUsage, '_id'>): Promise<ObjectId> {
  const fingerUsageCollection = await getCollection('finger-usage')
  
  const usage: Omit<FingerUsage, '_id'> = {
    ...fingerUsage,
  }

  const result = await fingerUsageCollection.insertOne(usage)
  return result.insertedId
}

export async function getUserTypingTests(userId: ObjectId, limit = 50, skip = 0): Promise<TypingTest[]> {
  const testsCollection = await getCollection('typing-tests')
  
  return testsCollection
    .find({ userId })
    .sort({ completedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray() as Promise<TypingTest[]>
}

export async function getUserStats(userId: ObjectId): Promise<{
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
}> {
  const testsCollection = await getCollection('typing-tests')
  
  const pipeline = [
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        totalTimeSpent: { $sum: '$duration' },
        averageWPM: { $avg: '$wpm' },
        bestWPM: { $max: '$wpm' },
        averageAccuracy: { $avg: '$accuracy' },
        bestAccuracy: { $max: '$accuracy' },
        totalWordsTyped: { $sum: '$wordCount' },
        totalCharactersTyped: { $sum: '$charactersTyped' },
      }
    }
  ]

  const result = await testsCollection.aggregate(pipeline).toArray()
  const stats = result[0] || {
    totalTests: 0,
    totalTimeSpent: 0,
    averageWPM: 0,
    bestWPM: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    totalWordsTyped: 0,
    totalCharactersTyped: 0,
  }

  // Calculate streak
  const streak = await calculateStreak(userId)

  return {
    ...stats,
    currentStreak: streak.current,
    longestStreak: streak.longest,
  }
}

async function calculateStreak(userId: ObjectId): Promise<{ current: number; longest: number }> {
  const testsCollection = await getCollection('typing-tests')
  
  // Get all test dates for the user
  const testDates = await testsCollection
    .find({ userId }, { projection: { completedAt: 1 } })
    .sort({ completedAt: -1 })
    .toArray()

  if (testDates.length === 0) {
    return { current: 0, longest: 0 }
  }

  const dates = testDates.map(test => new Date(test.completedAt).toDateString())
  const uniqueDates = [...new Set(dates)].sort().reverse()

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i]
    const nextDate = i < uniqueDates.length - 1 ? uniqueDates[i + 1] : null

    if (nextDate) {
      const current = new Date(currentDate)
      const next = new Date(nextDate)
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        tempStreak++
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
        }
        tempStreak = 1
      }
    } else {
      tempStreak++
    }

    // Check if this is part of current streak
    if (currentDate === today || currentDate === yesterday) {
      currentStreak = tempStreak
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak
  }

  return { current: currentStreak, longest: longestStreak }
}

export async function getLeaderboard(testMode: 'time' | 'words' | 'quote', limit = 100, sortBy: 'wpm' | 'accuracy' = 'wpm', timeframe = 'all'): Promise<LeaderboardEntry[]> {
  const testsCollection = await getCollection('typing-tests')
  
  // Build match criteria
  const matchCriteria: any = { testMode }
  
  // Add timeframe filter
  if (timeframe !== 'all') {
    const now = new Date()
    let startDate: Date
    
    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0)
    }
    
    matchCriteria.completedAt = { $gte: startDate }
  }
  
  // Build sort criteria
  const sortCriteria: any = {}
  if (sortBy === 'wpm') {
    sortCriteria.wpm = -1
    sortCriteria.accuracy = -1 // Secondary sort
  } else {
    sortCriteria.accuracy = -1
    sortCriteria.wpm = -1 // Secondary sort
  }
  
  const pipeline = [
    { $match: matchCriteria },
    {
      $group: {
        _id: '$userId',
        bestWpm: { $max: '$wpm' },
        bestAccuracy: { $max: '$accuracy' },
        testMode: { $first: '$testMode' },
        duration: { $first: '$duration' },
        createdAt: { $max: '$completedAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        username: '$user.username',
        wpm: '$bestWpm',
        accuracy: '$bestAccuracy',
        testMode: 1,
        duration: 1,
        createdAt: 1,
        isVerified: { $literal: true }
      }
    },
    { $sort: sortCriteria },
    { $limit: limit }
  ]

  return testsCollection.aggregate(pipeline).toArray() as Promise<LeaderboardEntry[]>
}

export async function getGlobalLeaderboard(limit = 100, sortBy: 'wpm' | 'accuracy' = 'wpm', timeframe = 'all'): Promise<LeaderboardEntry[]> {
  const testsCollection = await getCollection('typing-tests')
  
  // Build match criteria
  const matchCriteria: any = {}
  
  // Add timeframe filter
  if (timeframe !== 'all') {
    const now = new Date()
    let startDate: Date
    
    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0)
    }
    
    matchCriteria.completedAt = { $gte: startDate }
  }
  
  // Build sort criteria
  const sortCriteria: any = {}
  if (sortBy === 'wpm') {
    sortCriteria.wpm = -1
    sortCriteria.accuracy = -1
  } else {
    sortCriteria.accuracy = -1
    sortCriteria.wpm = -1
  }
  
  const pipeline = [
    { $match: matchCriteria },
    {
      $group: {
        _id: '$userId',
        bestWpm: { $max: '$wpm' },
        bestAccuracy: { $max: '$accuracy' },
        testMode: { $first: '$testMode' },
        duration: { $avg: '$duration' },
        createdAt: { $max: '$completedAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        username: '$user.username',
        wpm: '$bestWpm',
        accuracy: '$bestAccuracy',
        testMode: '$testMode',
        duration: { $round: ['$duration', 0] },
        createdAt: 1,
        isVerified: { $literal: true }
      }
    },
    { $sort: sortCriteria },
    { $limit: limit }
  ]

  return testsCollection.aggregate(pipeline).toArray() as Promise<LeaderboardEntry[]>
}

export async function saveDailyStats(stats: Omit<DailyStats, '_id'>): Promise<ObjectId> {
  const dailyStatsCollection = await getCollection('daily-stats')
  
  const dailyStats: Omit<DailyStats, '_id'> = {
    ...stats,
  }

  const result = await dailyStatsCollection.insertOne(dailyStats)
  return result.insertedId
}

export async function getDailyStats(userId: ObjectId, days = 30): Promise<DailyStats[]> {
  const dailyStatsCollection = await getCollection('daily-stats')
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return dailyStatsCollection
    .find({ 
      userId, 
      date: { $gte: startDate } 
    })
    .sort({ date: 1 })
    .toArray() as Promise<DailyStats[]>
}

export async function getFingerUsageStats(userId: ObjectId, days = 7): Promise<FingerUsage[]> {
  const fingerUsageCollection = await getCollection('finger-usage')
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const pipeline = [
    { 
      $match: { 
        userId, 
        date: { $gte: startDate } 
      } 
    },
    {
      $group: {
        _id: '$finger',
        usage: { $avg: '$usage' },
        accuracy: { $avg: '$accuracy' },
        speed: { $avg: '$speed' },
        errors: { $sum: '$errors' }
      }
    },
    {
      $project: {
        finger: '$_id',
        usage: 1,
        accuracy: 1,
        speed: 1,
        errors: 1
      }
    }
  ]

  return fingerUsageCollection.aggregate(pipeline).toArray() as Promise<FingerUsage[]>
}

export async function getKeystrokeStats(userId: ObjectId, testId?: ObjectId): Promise<{
  key: string
  count: number
  accuracy: number
  avgSpeed: number
  finger: string
  errors: number
}[]> {
  const keystrokesCollection = await getCollection('keystrokes')
  
  const match: any = { userId }
  if (testId) {
    match.testId = testId
  }

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: '$key',
        count: { $sum: 1 },
        correctCount: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        totalDelay: { $sum: '$delay' },
        finger: { $first: '$finger' }
      }
    },
    {
      $project: {
        key: '$_id',
        count: 1,
        accuracy: { $multiply: [{ $divide: ['$correctCount', '$count'] }, 100] },
        avgSpeed: { $divide: ['$totalDelay', '$count'] },
        finger: 1,
        errors: { $subtract: ['$count', '$correctCount'] }
      }
    },
    { $sort: { count: -1 } }
  ]

  return keystrokesCollection.aggregate(pipeline).toArray()
}
