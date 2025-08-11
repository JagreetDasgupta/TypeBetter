import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createUserSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }

  try {
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID!,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`,
      code,
    })}`)

    const { access_token } = await tokenResponse.json()
    
    const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`)
    const facebookUser = await userResponse.json()

    let user = await getUserByEmail(facebookUser.email)
    
    if (!user) {
      const userId = await createUser({
        email: facebookUser.email,
        username: facebookUser.name || facebookUser.email.split('@')[0],
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
      user = { _id: userId, email: facebookUser.email, username: facebookUser.name }
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