import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, amount } = body

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or amount' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const razorpayOrder = await createRazorpayOrder(amount)

    await prisma.payment.create({
      data: {
        orderId,
        provider: 'RAZORPAY',
        status: 'PENDING',
        amount,
        paymentRef: razorpayOrder.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
