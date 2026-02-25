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
    const { token, title, body: notificationBody } = body

    if (!token || !title || !notificationBody) {
      return errorResponse('token, title, and body are required')
    }

    const result = await sendPushNotification(token, title, notificationBody)
    return successResponse({ result })
  } catch (error: any) {
    console.error('Error:', error)
    return errorResponse(error.message || 'Failed to send')
  }
}
