import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, generateOrderNo } from '@/lib/auth'
import { createOrderSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationError, serverError, unauthorized } from '@/lib/api'

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
        vendor: { include: { user: { select: { name: true } } } },
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
    const { poojaId, slotId, attendeeName, attendeePhone, address, notes, addOnIds, mode } = data

    const [pooja, slot] = await Promise.all([
      prisma.pooja.findUnique({ where: { id: poojaId } }),
      prisma.poojaSlot.findUnique({
        where: { id: slotId },
        include: { location: true },
      }),
    ])

    if (!pooja || !slot) {
      return errorResponse('Invalid pooja or slot')
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
          slotId,
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
        where: { id: slotId },
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
          type: 'EMAIL',
          status: 'PENDING',
          recipient: auth.phone,
          subject: 'Order Confirmed',
          body: `Your order ${newOrder.orderNo} has been confirmed.`,
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
      return validationError(error)
    }
    return serverError(error)
  }
}

import { z } from 'zod'
