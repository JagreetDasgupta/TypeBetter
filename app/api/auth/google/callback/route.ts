import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createUserSession } from '@/lib/auth'
import { getCollection } from '@/lib/mongodb'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    })

    const tokens = await tokenResponse.json()
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const googleUser = await userResponse.json()

    // Check if user exists
    let user = await getUserByEmail(googleUser.email)
    
    if (!user) {
      // Create new user
      const userId = await createUser({
        email: googleUser.email,
        username: googleUser.name || googleUser.email.split('@')[0],
        passwordHash: '', // No password for OAuth users
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
      user = { _id: userId, email: googleUser.email, username: googleUser.name }
    }

    // Create session
    const sessionToken = await createUserSession(
      user._id,
      request.headers.get('user-agent') || undefined,
      request.headers.get('x-forwarded-for') || request.ip || undefined
    )

    // Redirect with session
    const response = NextResponse.redirect(process.env.NEXTAUTH_URL!)
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }
}