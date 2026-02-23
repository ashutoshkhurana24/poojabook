import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body
    
    if (secret !== 'poojabook-setup-2026') {
      return errorResponse('Invalid secret', 401)
    }

    // Create tables
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (id TEXT PRIMARY KEY, email TEXT UNIQUE, phone TEXT UNIQUE, name TEXT, role TEXT DEFAULT 'CUSTOMER', "passwordHash" TEXT, "isVerified" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "PoojaCategory" (id TEXT PRIMARY KEY, name TEXT, slug TEXT UNIQUE, description TEXT, icon TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "PoojaLocation" (id TEXT PRIMARY KEY, name TEXT, address TEXT, city TEXT, state TEXT, pincode TEXT, latitude REAL, longitude REAL, "templeName" TEXT, "isActive" BOOLEAN DEFAULT true, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Pooja" (id TEXT PRIMARY KEY, title TEXT, slug TEXT UNIQUE, description TEXT, instructions TEXT, samagri TEXT DEFAULT '[]', duration INTEGER, "basePrice" REAL, mode TEXT DEFAULT 'IN_TEMPLE', "categoryId" TEXT, "isActive" BOOLEAN DEFAULT true, "isRecurring" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "PoojaSlot" (id TEXT PRIMARY KEY, "poojaId" TEXT, "locationId" TEXT, "vendorId" TEXT, date TEXT, "startTime" TEXT, capacity INTEGER DEFAULT 1, "bookedCount" INTEGER DEFAULT 0, "isAvailable" BOOLEAN DEFAULT true, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "AddOn" (id TEXT PRIMARY KEY, name TEXT, description TEXT, price REAL, "poojaId" TEXT, "isActive" BOOLEAN DEFAULT true, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Order" (id TEXT PRIMARY KEY, "orderNo" TEXT UNIQUE, "customerId" TEXT, "poojaId" TEXT, "slotId" TEXT, "vendorId" TEXT, status TEXT DEFAULT 'BOOKED', mode TEXT, "attendeeName" TEXT, "attendeePhone" TEXT, address TEXT, notes TEXT, "baseAmount" REAL, "addOnAmount" REAL DEFAULT 0, "taxAmount" REAL DEFAULT 0, "totalAmount" REAL, "cancellationReason" TEXT, "refundAmount" REAL, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`

    return successResponse({ message: 'Database tables created' })
  } catch (error) {
    console.error('Setup error:', error)
    return errorResponse('Setup failed: ' + String(error))
  }
}
