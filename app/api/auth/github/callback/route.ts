import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createUserSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_error`)
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    })

    const { access_token } = await tokenResponse.json()
    
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const githubUser = await userResponse.json()
    const emails = await emailResponse.json()
    const primaryEmail = emails.find((e: any) => e.primary)?.email || githubUser.email

    let user = await getUserByEmail(primaryEmail)
    
    if (!user) {
      const userId = await createUser({
        email: primaryEmail,
        username: githubUser.login || githubUser.name || primaryEmail.split('@')[0],
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
      user = { _id: userId, email: primaryEmail, username: githubUser.login }
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