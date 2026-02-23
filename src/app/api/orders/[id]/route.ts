import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, notFound, unauthorized, forbidden, serverError } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser()
    if (!auth) return unauthorized()

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        pooja: { include: { category: true, addOns: true } },
        slot: { include: { location: true, vendor: { include: { user: { select: { name: true } } } } } },
        vendor: { include: { user: { select: { name: true } } } },
        customer: { select: { name: true, phone: true } },
        orderItems: { include: { addOn: true } },
        payments: true,
        notifications: true,
      },
    })

    if (!order) return notFound('Order not found')

    if (auth.role === 'CUSTOMER' && order.customerId !== auth.userId) {
      return forbidden()
    }

    if (auth.role === 'VENDOR' && order.vendorId !== auth.userId) {
      return forbidden()
    }

    return successResponse(order)
  } catch (error) {
    return serverError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser()
    if (!auth) return unauthorized()

    const { id } = await params
    const body = await request.json()
    const { status, notes, cancellationReason } = body

    const order = await prisma.order.findUnique({ 
      where: { id },
      include: { slot: true }
    })
    if (!order) return notFound('Order not found')

    if (auth.role === 'CUSTOMER') {
      if (order.customerId !== auth.userId) return forbidden()

      if (status === 'CANCELLED') {
        const slotDate = order.slot?.date
        if (!slotDate) return notFound('Slot not found')

        const slotTime = new Date(`${slotDate}T${order.slot?.startTime || '09:00'}`)
        const hoursUntil = (slotTime.getTime() - Date.now()) / (1000 * 60 * 60)

        let refundAmount = 0
        if (hoursUntil > 24) {
          refundAmount = order.totalAmount
        } else if (hoursUntil > 6) {
          refundAmount = order.totalAmount * 0.5
        }

        await prisma.order.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            cancellationReason: cancellationReason || 'Customer requested cancellation',
            refundAmount,
          },
        })

        await prisma.payment.updateMany({
          where: { orderId: id },
          data: { status: refundAmount > 0 ? 'REFUNDED' : 'FAILED' },
        })
      }
    }

    if (auth.role === 'ADMIN' || auth.role === 'VENDOR') {
      await prisma.order.update({
        where: { id },
        data: { status, notes: notes ? `${order.notes || ''}\n${notes}` : undefined },
      })
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { pooja: true, slot: { include: { location: true } } },
    })

    return successResponse(updatedOrder)
  } catch (error) {
    return serverError(error)
  }
}
