import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { saveTypingTest, saveKeystrokeData, saveFingerUsage, updateUser } from '@/lib/typing-data'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
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

    const {
      testMode,
      duration,
      wordCount,
      wpm,
      accuracy,
      adjustedWPM,
      errors,
      charactersTyped,
      charactersCorrect,
      text,
      keystrokes,
      fingerUsage,
    } = await request.json()

    // Save typing test
    const testId = await saveTypingTest({
      userId,
      testMode,
      duration,
      wordCount,
      wpm,
      accuracy,
      adjustedWPM,
      errors,
      charactersTyped,
      charactersCorrect,
      text,
      completedAt: new Date(),
    })

    // Save keystroke data if provided
    if (keystrokes && Array.isArray(keystrokes)) {
      for (const keystroke of keystrokes) {
        await saveKeystrokeData({
          userId,
          testId,
          key: keystroke.key,
          timestamp: new Date(keystroke.timestamp),
          isCorrect: keystroke.isCorrect,
          delay: keystroke.delay,
          finger: keystroke.finger,
        })
      }
    }

    // Save finger usage data if provided
    if (fingerUsage && Array.isArray(fingerUsage)) {
      for (const usage of fingerUsage) {
        await saveFingerUsage({
          userId,
          date: new Date(),
          finger: usage.finger,
          usage: usage.usage,
          accuracy: usage.accuracy,
          speed: usage.speed,
          errors: usage.errors,
        })
      }
    }

    return NextResponse.json({
      success: true,
      testId: testId.toString(),
      message: 'Test results saved successfully',
    })

  } catch (error) {
    console.error('Save test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
