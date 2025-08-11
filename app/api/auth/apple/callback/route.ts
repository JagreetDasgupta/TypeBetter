import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createUserSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const code = formData.get('code') as string

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }

  try {
    // Apple Sign In requires JWT for client_secret - simplified for demo
    const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.APPLE_CLIENT_ID!,
        client_secret: process.env.APPLE_CLIENT_SECRET!, // This should be a JWT
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/apple/callback`,
      }),
    })

    const tokens = await tokenResponse.json()
    
    // Decode the id_token to get user info (simplified)
    const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString())
    const email = payload.email
    const name = formData.get('user') ? JSON.parse(formData.get('user') as string).name : null

    let user = await getUserByEmail(email)
    
    if (!user) {
      const userId = await createUser({
        email,
        username: name?.firstName || email.split('@')[0],
        passwordHash: '',
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
      user = { _id: userId, email, username: name?.firstName || email.split('@')[0] }
    }

    const sessionToken = await createUserSession(user._id)
    const response = NextResponse.redirect(process.env.NEXTAUTH_URL!)
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }
}