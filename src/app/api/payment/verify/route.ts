import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For mock payments (test mode), skip verification
    if (razorpayPaymentId.startsWith('pay_mock_')) {
      await prisma.payment.create({
        data: {
          orderId,
          provider: 'RAZORPAY',
          status: 'SUCCESS',
          amount: 0,
          paymentRef: razorpayPaymentId,
          rawResponse: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
        },
      }).catch(() => {
        return prisma.payment.updateMany({
          where: { orderId },
          data: { 
            status: 'SUCCESS',
            rawResponse: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
          },
        })
      })
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      })

      return NextResponse.json({ success: true, data: { orderId } })
    }

    const isValid = await verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      await prisma.payment.updateMany({
        where: { paymentRef: razorpayOrderId },
        data: { status: 'FAILED' },
      })
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAYMENT_FAILED' },
      })

      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    await prisma.payment.updateMany({
      where: { paymentRef: razorpayOrderId },
      data: { 
        status: 'SUCCESS',
        rawResponse: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
      },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    })

    return NextResponse.json({ success: true, data: { orderId } })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
