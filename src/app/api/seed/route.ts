import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body
    
    if (secret !== 'poojabook-seed-2026') {
      return errorResponse('Invalid secret', 401)
    }

    // Create categories
    const categories = await Promise.all([
      prisma.poojaCategory.upsert({ where: { slug: 'ganesh' }, update: {}, create: { name: 'Ganesh', slug: 'ganesh', icon: '🐘' } }),
      prisma.poojaCategory.upsert({ where: { slug: 'lakshmi' }, update: {}, create: { name: 'Lakshmi', slug: 'lakshmi', icon: '💰' } }),
      prisma.poojaCategory.upsert({ where: { slug: 'navgraha' }, update: {}, create: { name: 'Navgraha', slug: 'navgraha', icon: '🪐' } }),
      prisma.poojaCategory.upsert({ where: { slug: 'satyanarayan' }, update: {}, create: { name: 'Satyanarayan', slug: 'satyanarayan', icon: '🔱' } }),
      prisma.poojaCategory.upsert({ where: { slug: 'rudrabhishek' }, update: {}, create: { name: 'Rudrabhishek', slug: 'rudrabhishek', icon: '🗿' } }),
    ])

    // Create locations
    await Promise.all([
      prisma.poojaLocation.upsert({ where: { id: 'loc-1' }, update: {}, create: { id: 'loc-1', name: 'Mumbai Temple', address: 'Mumbai', city: 'Mumbai', state: 'Maharashtra' } }),
      prisma.poojaLocation.upsert({ where: { id: 'loc-2' }, update: {}, create: { id: 'loc-2', name: 'Delhi Temple', address: 'Delhi', city: 'Delhi', state: 'Delhi' } }),
      prisma.poojaLocation.upsert({ where: { id: 'loc-3' }, update: {}, create: { id: 'loc-3', name: 'Bangalore Temple', address: 'Bangalore', city: 'Bangalore', state: 'Karnataka' } }),
    ])

    // Create poojas
    const poojas = await Promise.all([
      prisma.pooja.upsert({ where: { slug: 'ganesh-puja' }, update: {}, create: { title: 'Ganesh Puja', slug: 'ganesh-puja', description: 'Invoke blessings of Lord Ganesha', samagri: '["Modak","Flowers"]', duration: 60, basePrice: 1100, mode: 'IN_TEMPLE', categoryId: categories[0].id } }),
      prisma.pooja.upsert({ where: { slug: 'lakshmi-puja' }, update: {}, create: { title: 'Lakshmi Puja', slug: 'lakshmi-puja', description: 'Propitiate Goddess Lakshmi', samagri: '["Lotus","Coins"]', duration: 90, basePrice: 2100, mode: 'IN_TEMPLE', categoryId: categories[1].id } }),
      prisma.pooja.upsert({ where: { slug: 'navgraha-shanti' }, update: {}, create: { title: 'Navgraha Shanti', slug: 'navgraha-shanti', description: 'Pacify nine planets', samagri: '["Nine Grains"]', duration: 120, basePrice: 5100, mode: 'AT_HOME', categoryId: categories[2].id } }),
    ])

    return successResponse({ message: 'Seed completed', categories: categories.length, poojas: poojas.length })
  } catch (error) {
    console.error('Seed error:', error)
    return errorResponse('Seed failed: ' + String(error))
  }
}
