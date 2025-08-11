import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCollection } from './mongodb'
import { User, UserSession } from './models'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateJWT(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJWT(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export function generateSessionToken(): string {
  return require('crypto').randomBytes(32).toString('hex')
}

export async function createUserSession(userId: ObjectId, userAgent?: string, ipAddress?: string): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const session: Omit<UserSession, '_id'> = {
    userId,
    sessionToken,
    expiresAt,
    createdAt: new Date(),
    lastActivityAt: new Date(),
    userAgent,
    ipAddress,
  }

  const sessionsCollection = await getCollection('sessions')
  await sessionsCollection.insertOne(session)

  return sessionToken
}

export async function validateSession(sessionToken: string): Promise<ObjectId | null> {
  const sessionsCollection = await getCollection('sessions')
  
  const session = await sessionsCollection.findOne({
    sessionToken,
    expiresAt: { $gt: new Date() }
  })

  if (!session) {
    return null
  }

  // Update last activity
  await sessionsCollection.updateOne(
    { _id: session._id },
    { $set: { lastActivityAt: new Date() } }
  )

  return session.userId
}

export async function deleteSession(sessionToken: string): Promise<void> {
  const sessionsCollection = await getCollection('sessions')
  await sessionsCollection.deleteOne({ sessionToken })
}

export async function deleteExpiredSessions(): Promise<void> {
  const sessionsCollection = await getCollection('sessions')
  await sessionsCollection.deleteMany({
    expiresAt: { $lt: new Date() }
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const usersCollection = await getCollection('users')
  return usersCollection.findOne({ email: email.toLowerCase() })
}

export async function getUserById(userId: ObjectId): Promise<User | null> {
  const usersCollection = await getCollection('users')
  return usersCollection.findOne({ _id: userId })
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<ObjectId> {
  const usersCollection = await getCollection('users')
  
  const user: Omit<User, '_id'> = {
    ...userData,
    email: userData.email.toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await usersCollection.insertOne(user)
  return result.insertedId
}

export async function updateUser(userId: ObjectId, updates: Partial<User>): Promise<void> {
  const usersCollection = await getCollection('users')
  await usersCollection.updateOne(
    { _id: userId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    }
  )
}

export async function verifySession(sessionToken: string): Promise<User | null> {
  const userId = await validateSession(sessionToken)
  if (!userId) return null
  
  return await getUserById(userId)
}
