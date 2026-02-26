import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, forbidden, serverError, requireRole } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { auth, response } = await requireRole('ADMIN')
    if (response) return response

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vendorId = searchParams.get('vendorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: { status?: string; vendorId?: string } = {}
    if (status) where.status = status
    if (vendorId) where.vendorId = vendorId

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { name: true, phone: true } },
          pooja: { select: { title: true, basePrice: true } },
          slot: { include: { location: true } },
          vendor: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return successResponse({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return serverError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { auth, response } = await requireRole('ADMIN')
    if (response) return response

    const body = await request.json()
    const { orderId, vendorId, status } = body

    const updateData: { vendorId?: string; status?: string } = {}
    if (vendorId) updateData.vendorId = vendorId
    if (status) updateData.status = status

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: true,
        pooja: true,
        slot: { include: { location: true } },
      },
    })

    return successResponse(order)
  } catch (error) {
    return serverError(error)
  }
}
