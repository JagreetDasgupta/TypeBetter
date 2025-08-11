import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export async function GET() {
  try {
    const usersCollection = await getCollection('users')
    const userCount = await usersCollection.countDocuments()
    
    const testsCollection = await getCollection('typing-tests')
    const testCount = await testsCollection.countDocuments()
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      users: userCount,
      tests: testCount
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}