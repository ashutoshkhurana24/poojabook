import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, phone, name } = body
    
    if (secret !== 'poojabook-seed-2026') {
      return errorResponse('Invalid secret', 401)
    }

    if (phone && name) {
      const existingUser = await prisma.user.findFirst({
        where: { phone },
      })
      
      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'ADMIN' },
        })
        return successResponse({ message: 'User promoted to ADMIN', phone })
      }
      
      const user = await prisma.user.create({
        data: {
          name,
          phone,
          role: 'ADMIN',
          phoneVerified: true,
        },
      })
      return successResponse({ message: 'Admin user created', userId: user.id })
    }

    // Create categories
    const cat1 = await prisma.poojaCategory.create({ data: { name: 'Ganesh', slug: 'ganesh', icon: '🐘' } })
    const cat2 = await prisma.poojaCategory.create({ data: { name: 'Lakshmi', slug: 'lakshmi', icon: '💰' } })
    const cat3 = await prisma.poojaCategory.create({ data: { name: 'Navgraha', slug: 'navgraha', icon: '🪐' } })
    const cat4 = await prisma.poojaCategory.create({ data: { name: 'Satyanarayan', slug: 'satyanarayan', icon: '🔱' } })
    const cat5 = await prisma.poojaCategory.create({ data: { name: 'Rudrabhishek', slug: 'rudrabhishek', icon: '🗿' } })

    // Create locations
    const loc1 = await prisma.poojaLocation.create({ data: { name: 'Mumbai Temple', address: 'Mumbai', city: 'Mumbai', state: 'Maharashtra' } })
    const loc2 = await prisma.poojaLocation.create({ data: { name: 'Delhi Temple', address: 'Delhi', city: 'Delhi', state: 'Delhi' } })
    const loc3 = await prisma.poojaLocation.create({ data: { name: 'Bangalore Temple', address: 'Bangalore', city: 'Bangalore', state: 'Karnataka' } })

    // Create poojas
    await prisma.pooja.create({ data: { title: 'Ganesh Puja', slug: 'ganesh-puja', description: 'Invoke blessings of Lord Ganesha', samagri: '["Modak","Flowers","Coconut"]', duration: 60, basePrice: 1100, mode: 'IN_TEMPLE', categoryId: cat1.id } })
    await prisma.pooja.create({ data: { title: 'Lakshmi Puja', slug: 'lakshmi-puja', description: 'Propitiate Goddess Lakshmi', samagri: '["Lotus","Coins","Sweets"]', duration: 90, basePrice: 2100, mode: 'IN_TEMPLE', categoryId: cat2.id } })
    await prisma.pooja.create({ data: { title: 'Navgraha Shanti', slug: 'navgraha-shanti', description: 'Pacify nine planetary influences', samagri: '["Nine Grains","Ghee"]', duration: 120, basePrice: 5100, mode: 'AT_HOME', categoryId: cat3.id } })
    await prisma.pooja.create({ data: { title: 'Satyanarayan Puja', slug: 'satyanarayan-puja', description: 'For prosperity and peace', samagri: '["Banana","Milk"]', duration: 90, basePrice: 2500, mode: 'AT_HOME', categoryId: cat4.id } })
    await prisma.pooja.create({ data: { title: 'Rudrabhishek', slug: 'rudrabhishek', description: 'Abhishek of Lord Shiva', samagri: '["Milk","Honey","Bilva"]', duration: 150, basePrice: 8100, mode: 'AT_HOME', categoryId: cat5.id } })

    return successResponse({ message: 'Seed completed', categories: 5, poojas: 5 })
  } catch (error) {
    console.error('Seed error:', error)
    return errorResponse('Seed failed: ' + String(error))
  }
}
