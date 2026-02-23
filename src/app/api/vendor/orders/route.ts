import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, forbidden, serverError } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'VENDOR') return forbidden()

    const vendor = await prisma.vendor.findFirst({ where: { userId: auth.userId } })
    if (!vendor) return forbidden('Vendor not found')

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    const where: any = { vendorId: vendor.id }
    if (status) where.status = status
    if (date) where.slot = { date }

    const orders = await prisma.order.findMany({
      where,
      include: {
        pooja: { include: { category: true } },
        slot: { include: { location: true } },
        customer: { select: { name: true, phone: true } },
        orderItems: { include: { addOn: true } },
      },
      orderBy: [{ slot: { date: 'asc' } }, { slot: { startTime: 'asc' } }],
    })

    return successResponse(orders)
  } catch (error) {
    return serverError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'VENDOR') return forbidden()

    const vendor = await prisma.vendor.findFirst({ where: { userId: auth.userId } })
    if (!vendor) return forbidden('Vendor not found')

    const body = await request.json()
    const { orderId, status, notes } = body

    const order = await prisma.order.findFirst({
      where: { id: orderId, vendorId: vendor.id },
    })

    if (!order) return forbidden('Order not assigned to you')

    const updateData: any = { status }
    if (notes) {
      updateData.notes = `${order.notes || ''}\n[${new Date().toISOString()}] ${notes}`
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        pooja: true,
        slot: { include: { location: true } },
        customer: { select: { name: true, phone: true } },
      },
    })

    return successResponse(updated)
  } catch (error) {
    return serverError(error)
  }
}
