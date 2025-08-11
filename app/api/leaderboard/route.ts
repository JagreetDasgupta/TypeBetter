import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard, getGlobalLeaderboard } from '@/lib/typing-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testMode = (searchParams.get('mode') as 'time' | 'words' | 'quote') || 'time'
    const limit = parseInt(searchParams.get('limit') || '100')
    const sortBy = (searchParams.get('sortBy') as 'wpm' | 'accuracy') || 'wpm'
    const timeframe = searchParams.get('timeframe') || 'all' // all, week, month

    let leaderboard
    if (testMode === 'global') {
      leaderboard = await getGlobalLeaderboard(limit, sortBy, timeframe)
    } else {
      leaderboard = await getLeaderboard(testMode, limit, sortBy, timeframe)
    }

    return NextResponse.json({
      success: true,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry.userId.toString(),
        username: entry.username,
        wpm: entry.wpm,
        accuracy: entry.accuracy,
        testMode: entry.testMode,
        duration: entry.duration,
        createdAt: entry.createdAt,
        isVerified: entry.isVerified,
      })),
      meta: {
        total: leaderboard.length,
        testMode,
        sortBy,
        timeframe,
        limit
      }
    })

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    )
  }
}
