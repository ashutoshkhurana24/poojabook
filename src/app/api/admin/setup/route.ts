import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, secret } = body
    
    if (!process.env.ADMIN_SETUP_SECRET || secret !== process.env.ADMIN_SETUP_SECRET) {
      return errorResponse('Invalid secret', 401)
    }

    if (action === 'setup') {
      // Create all tables
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'CUSTOMER',
        "passwordHash" TEXT,
        "isVerified" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )`
      
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "PoojaCategory" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )`
      
      return successResponse({ message: 'Setup completed' })
    }

    return errorResponse('Unknown action')
  } catch (error) {
    console.error('Admin error:', error)
    return errorResponse('Error: ' + String(error))
  }
}
