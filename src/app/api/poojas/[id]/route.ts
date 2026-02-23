import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFound, serverError } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const pooja = await prisma.pooja.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        addOns: { where: { isActive: true } },
        reviews: {
          include: { customer: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        poojaSlots: {
          where: {
            isAvailable: true,
            date: { gte: new Date().toISOString().split('T')[0] },
          },
          include: { location: true, vendor: { include: { user: { select: { name: true } } } } },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
      },
    })

    if (!pooja) {
      return notFound('Pooja not found')
    }

    const avgRating =
      pooja.reviews.length > 0
        ? pooja.reviews.reduce((sum, r) => sum + r.rating, 0) / pooja.reviews.length
        : 0

    return successResponse({
      ...pooja,
      samagri: JSON.parse(pooja.samagri),
      avgRating,
      reviewCount: pooja.reviews.length,
    })
  } catch (error) {
    return serverError(error)
  }
}
