import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, email, name, secret } = body

    if (secret !== 'poojabook-admin-2026') {
      return errorResponse('Invalid secret')
    }

    // Build lookup conditions
    const orConditions: { phone?: string; email?: string }[] = []
    if (phone) {
      orConditions.push({ phone })
      orConditions.push({ phone: '+91' + phone })
    }
    if (email) {
      orConditions.push({ email })
    }

    if (orConditions.length === 0) {
      return errorResponse('Provide phone or email')
    }

    let user = await prisma.user.findFirst({ where: { OR: orConditions } })

    if (!user) {
      // Create the admin user if they don't exist yet
      const userName = name || (email ? email.split('@')[0] : 'Admin')
      const sanitizedPhone = phone ? (phone.startsWith('+91') ? phone : '+91' + phone) : undefined
      user = await prisma.user.create({
        data: {
          name: userName,
          phone: sanitizedPhone || null,
          email: email || null,
          role: 'ADMIN',
          isVerified: true,
          phoneVerified: !!sanitizedPhone,
        },
      })
      return NextResponse.json({ success: true, message: 'Admin user created', userId: user.id })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    })

    return NextResponse.json({ success: true, message: 'User promoted to ADMIN', userId: user.id })
  } catch (error) {
    console.error('Error:', error)
    return errorResponse('Failed to promote user')
  }
}
