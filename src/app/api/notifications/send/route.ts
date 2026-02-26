import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, forbidden } from '@/lib/api'
import { sendPushNotification } from '@/lib/firebase-admin'
import { z } from 'zod'
import { requireRole } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

    const body = await request.json()
    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      type: z.enum(['all', 'specific', 'booked']).default('all'),
      targetUserId: z.string().optional(),
      data: z.record(z.string(), z.string()).optional(),
    })

    const { title, body: notificationBody, type, targetUserId, data } = schema.parse(body)

    let tokens: string[] = []

    if (type === 'specific' && targetUserId) {
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { notificationToken: true },
      })
      if (user?.notificationToken) {
        tokens = [user.notificationToken]
      }
    } else if (type === 'booked') {
      const users = await prisma.user.findMany({
        where: {
          notificationToken: { not: null },
          orders: { some: {} },
        },
        select: { notificationToken: true },
      })
      tokens = users.map((u) => u.notificationToken).filter(Boolean) as string[]
    } else {
      const users = await prisma.user.findMany({
        where: { notificationToken: { not: null } },
        select: { notificationToken: true },
      })
      const userTokens = users.map((u) => u.notificationToken).filter(Boolean) as string[]

      const anonymousTokens = await prisma.notificationToken.findMany({
        select: { token: true },
      })
      const anonTokens = anonymousTokens.map((t) => t.token)

      tokens = [...userTokens, ...anonTokens]
    }

    if (tokens.length === 0) {
      return errorResponse('No users to notify')
    }

    const { successCount, failureCount } = await sendPushNotification(tokens, title, notificationBody, data)

    return successResponse({
      sent: successCount,
      failed: failureCount,
      total: tokens.length,
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return errorResponse(error instanceof Error ? error.message : 'Failed to send notification')
  }
}
