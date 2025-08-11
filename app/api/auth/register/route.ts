import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, hashPassword, createUserSession } from '@/lib/auth'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists by email or username
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Check if username is taken
    const usersCollection = await getCollection('users')
    const existingUsername = await usersCollection.findOne({ username })
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const userId = await createUser({
      email,
      username,
      passwordHash,
      preferences: {
        theme: 'dark',
        soundEnabled: true,
        keyboardLayout: 'qwerty',
        defaultTestMode: 'time',
        defaultTestDuration: 60,
        defaultWordCount: 50,
      },
      stats: {
        totalTests: 0,
        totalTimeSpent: 0,
        averageWPM: 0,
        bestWPM: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        totalWordsTyped: 0,
        totalCharactersTyped: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
    })

    // Create session
    const sessionToken = await createUserSession(
      userId,
      request.headers.get('user-agent') || undefined,
      request.headers.get('x-forwarded-for') || request.ip || undefined
    )

    // Set session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: {
          id: userId.toString(),
          email,
          username,
        }
      },
      { status: 201 }
    )

    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
