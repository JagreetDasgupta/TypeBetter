import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await verifySession(sessionToken)
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}