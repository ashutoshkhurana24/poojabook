import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { notificationToken: { not: null } },
      select: { id: true, name: true, phone: true, notificationToken: true },
      take: 10,
    })
    
    const anonTokens = await prisma.notificationToken.findMany({
      take: 10,
    })

    return successResponse({
      userTokens: users.length,
      anonTokens: anonTokens.length,
      sampleUser: users[0] || null,
      sampleAnon: anonTokens[0] || null,
    })
  } catch (error) {
    console.error('Error:', error)
    return errorResponse('Failed to get tokens')
  }
}
