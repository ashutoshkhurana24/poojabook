import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body
    
    if (secret !== 'poojabook-setup') {
      return errorResponse('Invalid secret', 401)
    }

    const tables = [
      `"User" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, email TEXT UNIQUE, phone TEXT UNIQUE, name TEXT NOT NULL, role TEXT DEFAULT 'CUSTOMER', "passwordHash" TEXT, "isVerified" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"CustomerProfile" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "userId" TEXT UNIQUE, addresses TEXT DEFAULT '[]', preferences TEXT DEFAULT '{}', "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"Vendor" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "userId" TEXT UNIQUE, "businessName" TEXT, description TEXT, languages TEXT DEFAULT '[]', "serviceAreas" TEXT DEFAULT '[]', "isVerified" BOOLEAN DEFAULT false, rating REAL DEFAULT 0, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"PoojaCategory" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT, icon TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"PoojaLocation" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, name TEXT NOT NULL, address TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL, pincode TEXT, latitude REAL, longitude REAL, "templeName" TEXT, "isActive" BOOLEAN DEFAULT true, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"Pooja" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT NOT NULL, instructions TEXT, samagri TEXT DEFAULT '[]', duration INTEGER NOT NULL, "basePrice" REAL NOT NULL, mode TEXT DEFAULT 'IN_TEMPLE', "categoryId" TEXT, "isActive" BOOLEAN DEFAULT true, "isRecurring" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"PoojaSlot" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "poojaId" TEXT, "locationId" TEXT, "vendorId" TEXT, date TEXT NOT NULL, "startTime" TEXT NOT NULL, capacity INTEGER DEFAULT 1, "bookedCount" INTEGER DEFAULT 0, "isAvailable" BOOLEAN DEFAULT true, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"AddOn" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, "poojaId" TEXT, "isActive" BOOLEAN DEFAULT true, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"Order" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "orderNo" TEXT UNIQUE NOT NULL, "customerId" TEXT NOT NULL, "poojaId" TEXT NOT NULL, "slotId" TEXT NOT NULL, "vendorId" TEXT, status TEXT DEFAULT 'BOOKED', mode TEXT NOT NULL, "attendeeName" TEXT NOT NULL, "attendeePhone" TEXT NOT NULL, address TEXT, notes TEXT, "baseAmount" REAL NOT NULL, "addOnAmount" REAL DEFAULT 0, "taxAmount" REAL DEFAULT 0, "totalAmount" REAL NOT NULL, "cancellationReason" TEXT, "refundAmount" REAL, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"OrderItem" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, "addOnId" TEXT NOT NULL, quantity INTEGER DEFAULT 1, price REAL NOT NULL)`,
      `"Payment" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, provider TEXT NOT NULL, status TEXT DEFAULT 'PENDING', amount REAL NOT NULL, "paymentRef" TEXT, "rawResponse" TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"Notification" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, type TEXT NOT NULL, status TEXT DEFAULT 'PENDING', recipient TEXT NOT NULL, subject TEXT, body TEXT NOT NULL, "sentAt" TIMESTAMP, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"Review" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "orderId" TEXT NOT NULL, "customerId" TEXT NOT NULL, "poojaId" TEXT NOT NULL, rating INTEGER NOT NULL, comment TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
      `"AuditLog" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "userId" TEXT NOT NULL, action TEXT NOT NULL, "entityType" TEXT NOT NULL, "entityId" TEXT, "oldValue" TEXT, "newValue" TEXT, "createdAt" TIMESTAMP DEFAULT NOW())`,
      `"Coupon" (id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, code TEXT UNIQUE NOT NULL, "discountType" TEXT NOT NULL, "discountValue" REAL NOT NULL, "minAmount" REAL, "maxUses" INTEGER, "usedCount" INTEGER DEFAULT 0, "isActive" BOOLEAN DEFAULT true, "validFrom" TIMESTAMP NOT NULL, "validUntil" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())`,
    ]

    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS ${table}`)
      } catch (e) {
        console.log(`Table creation: ${e}`)
      }
    }

    return successResponse({ message: 'All tables created' })
  } catch (error) {
    console.error('Setup error:', error)
    return errorResponse('Error: ' + String(error))
  }
}
