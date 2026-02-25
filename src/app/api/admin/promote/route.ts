import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, secret } = body

    if (secret !== 'poojabook-admin-2026') {
      return errorResponse('Invalid secret')
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { phone: '+91' + phone },
        ],
      },
    })

    if (!user) {
      return errorResponse('User not found with phone: ' + phone)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    })

    return NextResponse.json({ success: true, message: 'User promoted to ADMIN' })
  } catch (error) {
    console.error('Error:', error)
    return errorResponse('Failed to promote user')
  }
}
