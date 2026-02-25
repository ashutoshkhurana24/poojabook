import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY

async function sendPushNotification(token: string, title: string, body: string) {
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
    const body = await request.json()
    const { title, body: notificationBody } = body

    if (!title || !notificationBody) {
      return errorResponse('Title and body are required')
    }

    // Get all stored tokens
    const users = await prisma.user.findMany({
      where: { notificationToken: { not: null } },
      select: { notificationToken: true },
    })
    
    const anonTokens = await prisma.notificationToken.findMany({
      select: { token: true },
    })

    const allTokens = [
      ...users.map(u => u.notificationToken).filter(Boolean),
      ...anonTokens.map(t => t.token),
    ] as string[]

    // For demo mode, just return success
    if (allTokens.length === 0 || allTokens[0]?.startsWith('demo_')) {
      return successResponse({ 
        sent: 0, 
        demo: true, 
        message: 'Demo mode - no real tokens registered' 
      })
    }

    // Send to real tokens
    let sent = 0
    let failed = 0
    
    for (const token of allTokens) {
      if (token.startsWith('demo_')) continue
      try {
        await sendPushNotification(token, title, notificationBody)
        sent++
      } catch (e) {
        failed++
      }
    }

    return successResponse({ sent, failed, total: allTokens.length })
  } catch (error: any) {
    console.error('Error:', error)
    return errorResponse(error.message || 'Failed to send')
  }
}
