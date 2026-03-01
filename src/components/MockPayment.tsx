'use client'

import { useState } from 'react'

interface MockPaymentProps {
  orderId: string
  amount: number
  customerName: string
  customerPhone: string
  onSuccess: (paymentId: string) => void
  onFailure: (error: string) => void
}

export default function MockPayment({
  orderId,
  amount,
  onSuccess,
  onFailure,
}: MockPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      setError('Please fill all card details')
      return
    }

    setLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockPaymentId = 'pay_mock_' + Date.now()

    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: 'mock_order_' + orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: 'mock_signature',
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Payment verification failed')
        setLoading(false)
        return
      }

      setLoading(false)
      setShowPopup(false)
      onSuccess(mockPaymentId)
    } catch {
      setError('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  const handleFailure = () => {
    setShowPopup(false)
    onFailure('Payment cancelled by user')
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Payment</h3>
          <button onClick={handleFailure} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-orange-800">
            💳 <strong>Test Mode</strong> - Use any dummy card details
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="4111 1111 1111 1111"
              className="w-full px-4 py-3 border rounded-lg focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border rounded-lg focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="w-full px-4 py-3 border rounded-lg focus:border-primary outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{amount.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              `Pay ₹${amount.toLocaleString()}`
            )}
          </button>

          <button
            onClick={handleFailure}
            className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
