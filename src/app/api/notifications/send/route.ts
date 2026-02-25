import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, errorResponse, unauthorized, forbidden } from '@/lib/api'
import { z } from 'zod'

const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY

async function sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>) {
  if (!FIREBASE_SERVER_KEY) {
    throw new Error('Firebase server key not configured')
  }

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${FIREBASE_SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title,
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
      },
      data: data || {},
      webpush: {
        notification: {
          vibrate: [200, 100, 200],
          requireInteraction: true,
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`FCM error: ${error}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'ADMIN') {
      return forbidden('Only admins can send notifications')
    }

    const body = await request.json()
    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      body: z.string().min(1, 'Body is required'),
      type: z.enum(['all', 'specific', 'booked']).default('all'),
      targetUserId: z.string().optional(),
      data: z.record(z.string()).optional(),
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
      tokens = users.map(u => u.notificationToken).filter(Boolean) as string[]
    } else {
      const users = await prisma.user.findMany({
        where: { notificationToken: { not: null } },
        select: { notificationToken: true },
      })
      tokens = users.map(u => u.notificationToken).filter(Boolean) as string[]
    }

    if (tokens.length === 0) {
      return errorResponse('No users to notify')
    }

    const results = await Promise.allSettled(
      tokens.map(token => sendPushNotification(token, title, notificationBody, data))
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return successResponse({
      sent: successful,
      failed,
      total: tokens.length,
    })
  } catch (error: any) {
    console.error('Error sending notification:', error)
    return errorResponse(error.message || 'Failed to send notification')
  }
}
