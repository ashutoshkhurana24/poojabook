import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, serverError } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const city = searchParams.get('city')

    const where: any = { isActive: true }
    if (state) where.state = state
    if (city) where.city = city

    const locations = await prisma.poojaLocation.findMany({
      where,
      orderBy: [{ state: 'asc' }, { city: 'asc' }, { name: 'asc' }],
    })

    const grouped = locations.reduce((acc, loc) => {
      if (!acc[loc.state]) acc[loc.state] = {}
      if (!acc[loc.state][loc.city]) acc[loc.state][loc.city] = []
      acc[loc.state][loc.city].push(loc)
      return acc
    }, {} as Record<string, Record<string, typeof locations>>)

    return successResponse({ locations, grouped })
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, city, state, pincode, latitude, longitude, templeName } = body

    const location = await prisma.poojaLocation.create({
      data: { name, address, city, state, pincode, latitude, longitude, templeName },
    })

    return successResponse(location, 201)
  } catch (error) {
    return serverError(error)
  }
}
