import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, serverError } from '@/lib/api'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const mode = searchParams.get('mode')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: Prisma.PoojaWhereInput = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }

    if (mode) {
      where.mode = mode
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (city) {
      where.poojaSlots = {
        some: {
          location: { city: { contains: city } },
        },
      }
    }

    const [poojas, total] = await Promise.all([
      prisma.pooja.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pooja.count({ where }),
    ])

    const poojasWithRating = poojas.map((pooja) => ({
      ...pooja,
      avgRating: 0,
      reviewCount: 0,
      samagri: JSON.parse(pooja.samagri || '[]'),
      languages: [],
    }))

    return successResponse({
      poojas: poojasWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return serverError(error)
  }
}
