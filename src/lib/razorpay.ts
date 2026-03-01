import Razorpay from 'razorpay'
import crypto from 'crypto'

let razorpay: Razorpay | null = null

function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    })
  }
  return razorpay
}

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  const order = await getRazorpay().orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `poojabook_${Date.now()}`,
  })
  return order
}

export const verifyPayment = (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  return generatedSignature === razorpaySignature
}
