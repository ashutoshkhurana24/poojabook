import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, unauthorized, forbidden, serverError } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'VENDOR') return forbidden()

    const vendor = await prisma.vendor.findFirst({
      where: { userId: auth.userId },
      include: { user: { select: { name: true, phone: true, email: true } } },
    })

    if (!vendor) return forbidden('Vendor profile not found')

    const today = new Date().toISOString().split('T')[0]

    const [todayOrders, pendingOrders, completedOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          vendorId: vendor.id,
          slot: { date: today },
          status: { not: 'CANCELLED' },
        },
        include: {
          pooja: true,
          slot: { include: { location: true } },
          customer: { select: { name: true, phone: true } },
        },
        orderBy: { slot: { startTime: 'asc' } },
      }),
      prisma.order.findMany({
        where: { vendorId: vendor.id, status: 'ASSIGNED' },
        include: {
          pooja: true,
          slot: { include: { location: true } },
          customer: { select: { name: true, phone: true } },
        },
        take: 10,
      }),
      prisma.order.findMany({
        where: { vendorId: vendor.id, status: 'COMPLETED' },
        include: { pooja: true },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
    ])

    const weekEarnings = await prisma.order.aggregate({
      where: {
        vendorId: vendor.id,
        status: 'COMPLETED',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _sum: { totalAmount: true },
    })

    return successResponse({
      vendor,
      todayOrders,
      pendingOrders,
      completedOrders,
      weekEarnings: weekEarnings._sum.totalAmount || 0,
    })
  } catch (error) {
    return serverError(error)
  }
}
