import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `poojabook_${Date.now()}`,
  })
  return order
}

export const verifyPayment = async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  const crypto = require('crypto')
  
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  return generatedSignature === razorpaySignature
}
