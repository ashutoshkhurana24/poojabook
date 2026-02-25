import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, errorResponse, unauthorized } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    const body = await request.json()
    const { token, preferences } = body

    if (!token) {
      return errorResponse('Token is required')
    }

    const userId = auth?.userId || null

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          notificationToken: token,
          notificationPreferences: preferences ? JSON.stringify(preferences) : null,
        },
      })
    } else {
      await prisma.notificationToken.upsert({
        where: { token },
        create: {
          token,
          userId,
          preferences: preferences ? JSON.stringify(preferences) : null,
        },
        update: {
          preferences: preferences ? JSON.stringify(preferences) : null,
        },
      })
    }

    return successResponse({ message: 'Token registered successfully' })
  } catch (error) {
    console.error('Error registering token:', error)
    return errorResponse('Failed to register token')
  }
}

export async function GET() {
  try {
    const auth = await getAuthUser()
    if (!auth) {
      return unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        notificationToken: true,
        notificationPreferences: true,
      },
    })

    return successResponse({
      hasToken: !!user?.notificationToken,
      preferences: user?.notificationPreferences ? JSON.parse(user.notificationPreferences) : null,
    })
  } catch (error) {
    console.error('Error getting preferences:', error)
    return errorResponse('Failed to get preferences')
  }
}
