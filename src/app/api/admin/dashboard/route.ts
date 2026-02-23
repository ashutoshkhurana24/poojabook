import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, unauthorized, forbidden, serverError } from '@/lib/api'

export async function GET() {
  try {
    const auth = await getAuthUser()
    if (!auth || auth.role !== 'ADMIN') return forbidden()

    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [
      totalOrders,
      totalRevenue,
      activeVendors,
      totalCustomers,
      recentOrders,
      ordersByDay,
      topPoojas,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.vendor.count({ where: { isVerified: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, phone: true } },
          pooja: { select: { title: true } },
          vendor: { include: { user: { select: { name: true } } } },
        },
      }),
      prisma.$queryRaw`
        SELECT date(createdAt) as date, COUNT(*) as count, SUM(totalAmount) as revenue
        FROM orders
        WHERE createdAt >= ${thirtyDaysAgo}
        GROUP BY date(createdAt)
        ORDER BY date ASC
      `,
      prisma.order.groupBy({
        by: ['poojaId'],
        _count: { poojaId: true },
        orderBy: { _count: { poojaId: 'desc' } },
        take: 5,
      }),
    ])

    const topPoojasWithDetails = await Promise.all(
      topPoojas.map(async (item) => {
        const pooja = await prisma.pooja.findUnique({ where: { id: item.poojaId } })
        return { ...item, pooja }
      })
    )

    return successResponse({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        activeVendors,
        totalCustomers,
      },
      recentOrders,
      ordersByDay,
      topPoojas: topPoojasWithDetails,
    })
  } catch (error) {
    return serverError(error)
  }
}
