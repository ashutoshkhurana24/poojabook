'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Slot {
  id: string
  date: string
  startTime: string
  location: { name: string; city: string }
}

interface AddOn {
  id: string
  name: string
  price: number
}

interface Pooja {
  id: string
  basePrice: number
  mode: string
}

export function BookingForm({ pooja, slots }: { pooja: Pooja; slots: Record<string, Slot[]> }) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [attendeeName, setAttendeeName] = useState('')
  const [attendeePhone, setAttendeePhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addons = pooja.mode === 'AT_HOME' 
    ? [
        { id: '1', name: 'Premium Pandit', price: 500 },
        { id: '2', name: 'Samagri Delivery', price: 300 },
        { id: '3', name: 'Prasad Home Delivery', price: 200 },
      ]
    : []

  const selectedSlotData = Object.values(slots).flat().find(s => s.id === selectedSlot)
  const taxRate = 0.18
  const addOnTotal = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id)
    return sum + (addon?.price || 0)
  }, 0)
  const subtotal = pooja.basePrice + addOnTotal
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedSlot || !attendeeName || !attendeePhone) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poojaId: pooja.id,
          slotId: selectedSlot,
          attendeeName,
          attendeePhone,
          address: pooja.mode === 'AT_HOME' ? address : undefined,
          notes,
          addOnIds: selectedAddons,
          mode: pooja.mode,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push(`/orders/${data.data.id}`)
    } catch (err) {
      setError('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error/10 text-error p-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(slots).slice(0, 7).map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => { setSelectedDate(date); setSelectedSlot(''); }}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                selectedDate === date
                  ? 'bg-primary text-white'
                  : 'bg-background border hover:border-primary'
              }`}
            >
              {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </button>
          ))}
        </div>
      </div>

      {/* Slot Selection */}
      {selectedDate && slots[selectedDate] && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Time Slot</label>
          <div className="grid grid-cols-2 gap-2">
            {slots[selectedDate].map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-3 rounded-lg text-sm text-left transition ${
                  selectedSlot === slot.id
                    ? 'bg-primary text-white'
                    : 'bg-background border hover:border-primary'
                }`}
              >
                <div className="font-medium">{slot.startTime}</div>
                <div className="text-xs opacity-80">{slot.location.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {addons.length > 0 && selectedSlot && (
        <div>
          <label className="block text-sm font-medium mb-2">Add-ons</label>
          <div className="space-y-2">
            {addons.map((addon) => (
              <label key={addon.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-background">
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
                  <span>{addon.name}</span>
                </div>
                <span className="text-primary">+₹{addon.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Attendee Details */}
      {selectedSlot && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Attendee Details</h3>
          
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

          {pooja.mode === 'AT_HOME' && (
            <div>
              <label className="block text-sm mb-1">Address *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:border-primary outline-none"
                required
              />
            </div>
          )}

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
      )}

      {/* Price Summary */}
      {selectedSlot && (
        <div className="bg-background p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Base Price</span>
            <span>₹{pooja.basePrice.toLocaleString()}</span>
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
      )}

      <button
        type="submit"
        disabled={loading || !selectedSlot}
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  )
}
