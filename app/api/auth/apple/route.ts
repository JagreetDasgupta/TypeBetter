import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/apple/callback`,
    response_type: 'code',
    scope: 'name email',
    response_mode: 'form_post',
  })

  return NextResponse.redirect(`https://appleid.apple.com/auth/authorize?${params}`)
}