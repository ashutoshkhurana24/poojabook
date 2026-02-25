'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PanditCard from './PanditCard'
import MockPayment from './MockPayment'

export default function BookingForm({ poojaId, basePrice, categorySlug }: { 
  poojaId: string; 
  basePrice: number;
  categorySlug?: string;
}) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [selectedPandit, setSelectedPandit] = useState<string | null>(null)
  const [pandits, setPandits] = useState<any[]>([])
  const [showPanditSelection, setShowPanditSelection] = useState(false)
  const [attendeeName, setAttendeeName] = useState('')
  const [attendeePhone, setAttendeePhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [showPayment, setShowPayment] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    fetch(`/api/pandits?category=${categorySlug || 'ganesh'}&limit=4`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPandits(data.data)
        }
      })
  }, [categorySlug])

  const generateDates = () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const dates = generateDates()

  const addons: { id: string; name: string; price: number; desc: string }[] = [
    { id: '1', name: 'Premium Pandit', price: 500, desc: 'Highly experienced senior pandit' },
    { id: '2', name: 'Samagri Kit', price: 300, desc: 'All items pre-arranged and delivered' },
    { id: '3', name: 'Prasad Delivery', price: 200, desc: 'Prasad delivered to your home' },
  ]

  const addOnTotal = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id)
    return sum + (addon?.price || 0)
  }, 0)
  const taxRate = 0.18
  const subtotal = basePrice + addOnTotal
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!attendeeName || !attendeePhone) {
      setError('Please fill all required fields')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          poojaId,
          panditId: selectedPandit,
          slotDate: selectedDate || dates[0],
          slotTime: '09:00 AM',
          attendeeName,
          attendeePhone,
          address,
          notes,
          addOnIds: selectedAddons,
          mode: 'IN_TEMPLE',
        }),
      })

      const data = await res.json()

      if (res.status === 401 || data.error?.includes('authorized')) {
        router.push('/login')
        return
      }

      if (!data.success) {
        setError(data.error || 'Something went wrong')
        return
      }

      setCreatedOrderId(data.data.id)
      setShowPayment(true)
    } catch (err) {
      setError('Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentSuccess(true)
    setShowPayment(false)
  }

  const handlePaymentFailure = (errorMsg: string) => {
    setError(errorMsg)
    setShowPayment(false)
  }

  if (paymentSuccess) {
    return (
      <div className="bg-surface rounded-2xl p-6 sticky top-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
        <p className="text-text-secondary mb-4">Your pooja has been booked successfully.</p>
        {createdOrderId && (
          <button
            onClick={() => router.push(`/my-orders/${createdOrderId}`)}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            View Booking Details
          </button>
        )}
      </div>
    )
  }

  const selectedPanditData = pandits.find(p => p.id === selectedPandit)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {!showPanditSelection ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <div className="flex flex-wrap gap-2">
              {dates.slice(0, 7).map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    selectedDate === date || (!selectedDate && date === dates[0])
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 border hover:border-primary'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Choose Your Pandit</label>
            {pandits.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowPanditSelection(true)}
                className="w-full p-4 border-2 border-dashed border-primary/30 rounded-lg text-left hover:border-primary transition"
              >
                {selectedPanditData ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {selectedPanditData.photo ? (
                        <img src={selectedPanditData.photo} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : '🧑‍🎓'}
                    </div>
                    <div>
                      <p className="font-medium">{selectedPanditData.name}</p>
                      <p className="text-sm text-text-secondary">{selectedPanditData.city} • {selectedPanditData.rating}⭐</p>
                    </div>
                    <span className="ml-auto text-primary">Change</span>
                  </div>
                ) : (
                  <p className="text-primary font-medium">Select a Pandit →</p>
                )}
              </button>
            ) : (
              <p className="text-text-secondary text-sm">Loading pandits...</p>
            )}
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Choose Your Pandit</label>
            <button
              type="button"
              onClick={() => setShowPanditSelection(false)}
              className="text-sm text-primary hover:underline"
            >
              {selectedPandit ? 'Change' : 'Skip'}
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pandits.map((pandit) => (
              <div
                key={pandit.id}
                onClick={() => {
                  setSelectedPandit(pandit.id)
                  setShowPanditSelection(false)
                }}
                className={`p-2 border-2 rounded-lg cursor-pointer transition ${
                  selectedPandit === pandit.id ? 'border-primary' : 'border-transparent hover:border-primary/30'
                }`}
              >
                <PanditCard pandit={pandit} selected={selectedPandit === pandit.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Add-ons (Optional)</label>
        <div className="space-y-2">
          {addons.map((addon) => (
            <label key={addon.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAddons([...selectedAddons, addon.id])
                    } else {
                      setSelectedAddons(selectedAddons.filter(id => id !== addon.id))
                    }
                  }}
                  className="rounded"
                />
                <div>
                  <span className="font-medium">{addon.name}</span>
                  <p className="text-xs text-gray-500">{addon.desc}</p>
                </div>
              </div>
              <span className="text-primary">+₹{addon.price}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Your Details</h3>
        
        <div>
          <label className="block text-sm mb-1">Full Name *</label>
          <input
            type="text"
            value={attendeeName}
            onChange={(e) => setAttendeeName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone Number *</label>
          <input
            type="tel"
            value={attendeePhone}
            onChange={(e) => setAttendeePhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any specific requirements..."
            className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span>Base Price</span>
          <span>₹{basePrice.toLocaleString()}</span>
        </div>
        {addOnTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span>Add-ons</span>
            <span>₹{addOnTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Tax (18%)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {showPayment && createdOrderId ? (
        <MockPayment
          orderId={createdOrderId}
          amount={total}
          customerName={attendeeName}
          customerPhone={attendeePhone}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      ) : (
        <button
          type="submit"
          disabled={submitting || !attendeeName || !attendeePhone}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Book Now'}
        </button>
      )}
    </form>
  )
}
