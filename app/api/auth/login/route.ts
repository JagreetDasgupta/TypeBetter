import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, comparePassword, createUserSession, updateUser } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user by email
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    await updateUser(user._id!, { lastLoginAt: new Date() })

    // Create session
    const sessionToken = await createUserSession(
      user._id!,
      request.headers.get('user-agent') || undefined,
      request.headers.get('x-forwarded-for') || request.ip || undefined
    )

    // Set session cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          id: user._id!.toString(),
          email: user.email,
          username: user.username,
          preferences: user.preferences,
          stats: user.stats,
        }
      },
      { status: 200 }
    )

    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
