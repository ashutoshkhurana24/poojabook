import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, serverError } from '@/lib/api'

export async function GET() {
  try {
    const categories = await prisma.poojaCategory.findMany({
      orderBy: { name: 'asc' },
    })

    console.log('Categories found:', categories.length)

    return NextResponse.json(
      { success: true, data: categories },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Categories API error:', error)
    return serverError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon } = body

    const slug = name.toLowerCase().replace(/\s+/g, '-')

    const category = await prisma.poojaCategory.create({
      data: { name, slug, description, icon },
    })

    return successResponse(category, 201)
  } catch (error) {
    return serverError(error)
  }
}
