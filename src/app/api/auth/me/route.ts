import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, unauthorized } from '@/lib/api'

export async function GET() {
  try {
    const auth = await getAuthUser()
    if (!auth) {
      return unauthorized()
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { vendor: true, customerProfile: true },
    })

    if (!user) {
      return unauthorized()
    }

    const { passwordHash, ...userWithoutPassword } = user
    return successResponse(userWithoutPassword)
  } catch (error) {
    console.error('Auth check error:', error)
    return unauthorized()
  }
}
