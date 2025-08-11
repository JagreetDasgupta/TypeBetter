import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createUserSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }

  try {
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/twitter/callback`,
        code_verifier: 'challenge',
      }),
    })

    const { access_token } = await tokenResponse.json()
    
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=email', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const { data: twitterUser } = await userResponse.json()
    const email = twitterUser.email || `${twitterUser.username}@twitter.local`

    let user = await getUserByEmail(email)
    
    if (!user) {
      const userId = await createUser({
        email,
        username: twitterUser.username || twitterUser.name || email.split('@')[0],
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
      user = { _id: userId, email, username: twitterUser.username }
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