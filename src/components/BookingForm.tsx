'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PanditCard from './PanditCard'
import MockPayment from './MockPayment'

const getPanditAvatar = (name: string) => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e67e22&color=fff&bold=true&size=128`

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
  const [premiumOnly, setPremiumOnly] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user)
          setAttendeeName(data.user.name || '')
          setAttendeePhone(data.user.phone || '')
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const premiumParam = premiumOnly ? '&premium=true' : ''
    fetch(`/api/pandits?category=${categorySlug || 'ganesh'}&limit=4${premiumParam}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPandits(data.data)
        }
      })
  }, [categorySlug, premiumOnly])

  useEffect(() => {
    const hasPremiumAddon = selectedAddons.includes('1')
    if (hasPremiumAddon && pandits.length > 0) {
      const premiumPandit = pandits.find(p => p.isPremium)
      if (premiumPandit && !selectedPandit) {
        setSelectedPandit(premiumPandit.id)
      }
    }
  }, [selectedAddons, pandits, selectedPandit])

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
    { id: '1', name: '⭐ Premium Pandit Upgrade', price: 500, desc: 'Highly experienced senior Pandit with 15+ years experience' },
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
        sessionStorage.setItem('bookingRedirect', window.location.pathname + window.location.search)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">{error}</div>
      )}

      {!showPanditSelection ? (
        <>
          {/* Date Selection */}
          <div data-tour="date-picker" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Select Date</label>
            <div className="flex flex-wrap gap-2">
              {dates.slice(0, 7).map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedDate === date || (!selectedDate && date === dates[0])
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-50 border border-gray-200 hover:border-primary hover:bg-orange-50'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </button>
              ))}
            </div>
          </div>

          {/* Pandit Selection */}
          <div data-tour="pandit-select" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">🧑‍🎓 Choose Your Pandit</label>
            </div>
            {pandits.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowPanditSelection(true)}
                className="w-full p-4 border-2 border-dashed border-primary/30 rounded-xl text-left hover:border-primary hover:bg-orange-50/50 transition bg-gray-50"
              >
                {selectedPanditData ? (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      <img src={getPanditAvatar(selectedPanditData.name)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{selectedPanditData.name}</p>
                        {selectedPanditData.isPremium && <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">⭐ Premium</span>}
                      </div>
                      <p className="text-sm text-gray-500">{selectedPanditData.city}, {selectedPanditData.state}</p>
                      <p className="text-sm text-gray-500">⭐ {selectedPanditData.rating} • {selectedPanditData.experienceYears} years exp.</p>
                    </div>
                    <span className="text-primary font-medium">Change</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-2">
                    <p className="text-primary font-medium text-lg">Select a Pandit →</p>
                  </div>
                )}
              </button>
            ) : (
              <p className="text-text-secondary text-sm">Loading pandits...</p>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">🧑‍🎓 Choose Your Pandit</label>
            <button
              type="button"
              onClick={() => setShowPanditSelection(false)}
              className="text-sm text-primary hover:underline"
            >
              {selectedPandit ? 'Done' : 'Skip'}
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {pandits.map((pandit) => (
              <div
                key={pandit.id}
                onClick={() => {
                  setSelectedPandit(pandit.id)
                  setShowPanditSelection(false)
                }}
                className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                  selectedPandit === pandit.id 
                    ? 'border-primary bg-orange-50' 
                    : 'border-gray-100 hover:border-primary/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-yellow-400">
                    <img src={getPanditAvatar(pandit.name)} alt={pandit.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{pandit.name}</p>
                      {pandit.isPremium && <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">⭐ Premium</span>}
                      {pandit.isVerified && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ Verified</span>}
                    </div>
                    <p className="text-sm text-gray-500">{pandit.city}, {pandit.state}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>⭐ {pandit.rating}</span>
                      <span>•</span>
                      <span>{pandit.experienceYears} years exp.</span>
                      <span>•</span>
                      <span>{pandit.totalReviews} reviews</span>
                    </div>
                    {pandit.bio && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{pandit.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons Section */}
      <div data-tour="addons" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">✨ Add-ons (Optional)</label>
        <div className="space-y-2">
          {addons.map((addon) => (
            <label 
              key={addon.id} 
              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                selectedAddons.includes(addon.id) 
                  ? 'border-primary bg-orange-50' 
                  : 'border-gray-100 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
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
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium text-gray-800 text-sm">{addon.name}</span>
                  <p className="text-xs text-gray-500">{addon.desc}</p>
                </div>
              </div>
              <span className="text-primary font-semibold whitespace-nowrap">+₹{addon.price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div data-tour="customer-info" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3">👤 Your Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              readOnly={!!currentUser?.name}
              className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition ${currentUser?.name ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={attendeePhone}
              onChange={(e) => setAttendeePhone(e.target.value)}
              placeholder="+91 9876543210"
              readOnly={!!currentUser?.phone}
              className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition ${currentUser?.phone ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any specific requirements..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Base Price</span>
            <span>₹{basePrice.toLocaleString()}</span>
          </div>
          {addOnTotal > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Add-ons</span>
              <span>₹{addOnTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax (18%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-gray-800 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span className="text-primary">₹{total.toLocaleString()}</span>
          </div>
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
          data-tour="book-button"
          disabled={submitting || !attendeeName || !attendeePhone}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Book Now'}
        </button>
      )}
    </form>
  )
}
