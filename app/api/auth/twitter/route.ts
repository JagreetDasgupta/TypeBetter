import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/twitter/callback`,
    scope: 'tweet.read users.read',
    state: 'state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  })

  return NextResponse.redirect(`https://twitter.com/i/oauth2/authorize?${params}`)
}