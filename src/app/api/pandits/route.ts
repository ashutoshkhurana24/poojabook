import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      isAvailable: true,
    }

    if (city) where.city = city
    if (category) {
      where.specializations = { contains: category }
    }

    const pandits = await prisma.pandit.findMany({
      where,
      orderBy: [{ isVerified: 'desc' }, { rating: 'desc' }],
      take: limit,
    })

    const panditsWithParsed = pandits.map((p) => ({
      ...p,
      languages: JSON.parse(p.languages || '[]'),
      specializations: JSON.parse(p.specializations || '[]'),
    }))

    return successResponse(panditsWithParsed)
  } catch (error) {
    return errorResponse('Failed to fetch pandits')
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, photo, bio, experienceYears, languages, specializations, city, state } = body

    if (!name || !city || !state) {
      return errorResponse('Name, city and state are required')
    }

    const pandit = await prisma.pandit.create({
      data: {
        name,
        photo: photo || null,
        bio: bio || null,
        experienceYears: experienceYears || 0,
        languages: JSON.stringify(languages || []),
        specializations: JSON.stringify(specializations || []),
        city,
        state,
        isVerified: false,
      },
    })

    return successResponse(pandit, 201)
  } catch (error) {
    return errorResponse('Failed to create pandit')
  }
}
