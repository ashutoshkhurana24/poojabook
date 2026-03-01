import { prisma } from '@/lib/prisma'
import { successResponse, serverError, requireRole } from '@/lib/api'

export async function GET() {
  try {
    const { response } = await requireRole('ADMIN')
    if (response) return response

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

    const topPoojaIds = topPoojas.map((item) => item.poojaId)
    const poojaDetails = await prisma.pooja.findMany({
      where: { id: { in: topPoojaIds } },
      select: { id: true, title: true, slug: true, basePrice: true },
    })
    const poojaMap = Object.fromEntries(poojaDetails.map((p) => [p.id, p]))
    const topPoojasWithDetails = topPoojas.map((item) => ({
      ...item,
      pooja: poojaMap[item.poojaId] ?? null,
    }))

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
