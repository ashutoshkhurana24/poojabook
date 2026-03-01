import { NextRequest, NextResponse } from 'next/server'
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

    console.log('API /api/poojas called with:', { category, city, mode, search })

    const where: Prisma.PoojaWhereInput = { isActive: true }

    if (category && category.trim() !== '') {
      where.category = { slug: category.trim().toLowerCase() }
    }

    if (mode && mode.trim() !== '') {
      where.mode = mode.trim()
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ]
    }

    if (city && city.trim() !== '') {
      where.poojaSlots = {
        some: {
          location: { city: { contains: city.trim() } },
        },
      }
    }

    console.log('Prisma where:', JSON.stringify(where))

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

    console.log('Found poojas:', poojas.length, 'total:', total)
    console.log('Sample pooja:', JSON.stringify(poojas[0]))

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
    console.error('Poojas API error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: 'Internal server error: ' + message }, { status: 500 })
  }
}
