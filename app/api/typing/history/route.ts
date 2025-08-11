import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getUserTypingTests, getUserStats } from '@/lib/typing-data'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = await validateSession(sessionToken)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    // Get user's typing tests
    const tests = await getUserTypingTests(userId, limit, skip)

    // Get user's aggregated stats
    const stats = await getUserStats(userId)

    return NextResponse.json({
      tests: tests.map(test => ({
        id: test._id!.toString(),
        testMode: test.testMode,
        duration: test.duration,
        wordCount: test.wordCount,
        wpm: test.wpm,
        accuracy: test.accuracy,
        adjustedWPM: test.adjustedWPM,
        errors: test.errors,
        charactersTyped: test.charactersTyped,
        charactersCorrect: test.charactersCorrect,
        text: test.text,
        completedAt: test.completedAt,
        createdAt: test.createdAt,
      })),
      stats,
    })

  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
