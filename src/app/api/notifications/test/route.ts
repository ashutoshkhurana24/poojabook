import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'
import { sendPushNotification } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: notificationBody } = body

    if (!title || !notificationBody) {
      return errorResponse('Title and body are required')
    }

    const users = await prisma.user.findMany({
      where: { notificationToken: { not: null } },
      select: { notificationToken: true },
    })

    const anonTokens = await prisma.notificationToken.findMany({
      select: { token: true },
    })

    const allTokens = [
      ...users.map((u) => u.notificationToken).filter(Boolean),
      ...anonTokens.map((t) => t.token),
    ].filter((t) => !t!.startsWith('demo_')) as string[]

    if (allTokens.length === 0) {
      return successResponse({
        sent: 0,
        message: 'No real FCM tokens registered yet. Open the app in a browser and allow notifications first.',
      })
    }

    const { successCount, failureCount } = await sendPushNotification(allTokens, title, notificationBody)

    return successResponse({ sent: successCount, failed: failureCount, total: allTokens.length })
  } catch (error) {
    console.error('Error:', error)
    return errorResponse(error instanceof Error ? error.message : 'Failed to send')
  }
}
