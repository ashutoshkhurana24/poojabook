import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const poojas = await prisma.pooja.findMany({
    select: { title: true, slug: true }
  })
  return NextResponse.json(poojas)
}
