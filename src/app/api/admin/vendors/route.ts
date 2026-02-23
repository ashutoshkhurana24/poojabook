import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, hashPassword } from '@/lib/auth'
import { successResponse, forbidden, serverError } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'ADMIN') return forbidden()

    const { searchParams } = new URL(request.url)
    const verified = searchParams.get('verified')

    const where: any = {}
    if (verified !== null) where.isVerified = verified === 'true'

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        orders: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(
      vendors.map((v) => ({
        ...v,
        languages: JSON.parse(v.languages),
        serviceAreas: JSON.parse(v.serviceAreas),
        orderCount: v.orders.length,
      }))
    )
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'ADMIN') return forbidden()

    const body = await request.json()
    const { name, phone, email, businessName, description, languages, serviceAreas, password } =
      body

    const passwordHash = await hashPassword(password || 'vendor123')

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        passwordHash,
        role: 'VENDOR',
        isVerified: true,
      },
    })

    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName,
        description,
        languages: JSON.stringify(languages || ['Hindi', 'English']),
        serviceAreas: JSON.stringify(serviceAreas || []),
        isVerified: true,
      },
    })

    return successResponse({ user, vendor }, 201)
  } catch (error) {
    return serverError(error)
  }
}
