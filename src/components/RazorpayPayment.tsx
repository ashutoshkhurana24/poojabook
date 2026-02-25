'use client'

import { useState, useEffect, useRef } from 'react'

interface RazorpayPaymentProps {
  orderId: string
  amount: number
  customerName: string
  customerPhone: string
  onSuccess: (paymentId: string) => void
  onFailure: (error: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  orderId,
  amount,
  customerName,
  customerPhone,
  onSuccess,
  onFailure,
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (scriptLoaded.current) return
    scriptLoaded.current = true

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  const handlePayment = async () => {
    if (!window.Razorpay) {
      onFailure('Razorpay not loaded. Please refresh and try again.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        name: 'PoojaBook',
        description: 'Pooja Booking Payment',
        order_id: data.data.orderId,
        amount: data.data.amount,
        currency: data.data.currency || 'INR',
        prefill: {
          name: customerName,
          contact: customerPhone,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              onSuccess(response.razorpay_payment_id)
            } else {
              onFailure(verifyData.error || 'Payment verification failed')
            }
          } catch (err) {
            onFailure('Payment verification failed')
          }
        },
        theme: {
          color: '#ea580c',
        },
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.open()
    } catch (error: any) {
      onFailure(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !razorpayLoaded}
      className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </>
      ) : (
        <>Pay ₹{amount.toLocaleString()} with Razorpay</>
      )}
    </button>
  )
}
