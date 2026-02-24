import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, generateOrderNo } from '@/lib/auth'
import { successResponse, errorResponse, serverError, unauthorized } from '@/lib/api'
import { z } from 'zod'

const createOrderSchema = z.object({
  poojaId: z.string().min(1),
  panditId: z.string().optional(),
  slotId: z.string().optional(),
  slotDate: z.string().optional(),
  slotTime: z.string().optional(),
  attendeeName: z.string().min(1),
  attendeePhone: z.string().min(1),
  address: z.string().optional(),
  notes: z.string().optional(),
  addOnIds: z.array(z.string()).optional(),
  mode: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return unauthorized()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = { customerId: auth.userId }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: {
        pooja: { include: { category: true } },
        slot: { include: { location: true } },
        vendor: true,
        pandit: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(orders)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser()
    if (!auth) return unauthorized()

    const body = await request.json()
    const data = createOrderSchema.parse(body)
    const { poojaId, panditId, slotId, slotDate, slotTime, attendeeName, attendeePhone, address, notes, addOnIds, mode } = data

    const pooja = await prisma.pooja.findUnique({ where: { id: poojaId } })
    if (!pooja) {
      return errorResponse('Invalid pooja')
    }

    let slot = slotId ? await prisma.poojaSlot.findUnique({ where: { id: slotId } }) : null

    if (!slot && slotDate) {
      slot = await prisma.poojaSlot.findFirst({
        where: {
          poojaId,
          date: slotDate,
          isAvailable: true,
        },
      })
    }

    if (!slot) {
      const location = await prisma.poojaLocation.findFirst()
      slot = await prisma.poojaSlot.create({
        data: {
          poojaId,
          locationId: location?.id || 'loc-1',
          date: slotDate || new Date().toISOString().split('T')[0],
          startTime: slotTime || '09:00 AM',
          capacity: 10,
          bookedCount: 0,
          isAvailable: true,
        },
      })
    }

    if (!slot.isAvailable || slot.bookedCount >= slot.capacity) {
      return errorResponse('Slot not available')
    }

    let addOnAmount = 0
    let orderItems: { addOnId: string; quantity: number; price: number }[] = []

    if (addOnIds && addOnIds.length > 0) {
      const addOns = await prisma.addOn.findMany({
        where: { id: { in: addOnIds }, poojaId, isActive: true },
      })
      addOnAmount = addOns.reduce((sum, a) => sum + a.price, 0)
      orderItems = addOns.map((a) => ({ addOnId: a.id, quantity: 1, price: a.price }))
    }

    const taxAmount = (pooja.basePrice + addOnAmount) * 0.18
    const totalAmount = pooja.basePrice + addOnAmount + taxAmount

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNo: generateOrderNo(),
          customerId: auth.userId,
          poojaId,
          slotId: slot!.id,
          panditId: panditId || null,
          mode,
          attendeeName,
          attendeePhone,
          address,
          notes,
          baseAmount: pooja.basePrice,
          addOnAmount,
          taxAmount,
          totalAmount,
          status: 'BOOKED',
        },
      })

      if (orderItems.length > 0) {
        await tx.orderItem.createMany({
          data: orderItems.map((item) => ({
            ...item,
            orderId: newOrder.id,
          })),
        })
      }

      await tx.poojaSlot.update({
        where: { id: slot!.id },
        data: { bookedCount: { increment: 1 } },
      })

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          provider: 'MOCK',
          status: 'SUCCESS',
          amount: totalAmount,
          paymentRef: `MOCK-${Date.now()}`,
        },
      })

      await tx.notification.create({
        data: {
          orderId: newOrder.id,
          type: 'SMS',
          status: 'SENT',
          recipient: attendeePhone,
          subject: 'Order Confirmed',
          body: `Your booking for ${pooja.title} is confirmed! Order No: ${newOrder.orderNo}`,
        },
      })

      return newOrder
    })

    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        pooja: { include: { category: true } },
        slot: { include: { location: true } },
        payments: true,
      },
    })

    return successResponse(fullOrder, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message)
    }
    return serverError(error)
  }
}
