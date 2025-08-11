import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getUserById } from '@/lib/auth'
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

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id!.toString(),
        email: user.email,
        username: user.username,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
