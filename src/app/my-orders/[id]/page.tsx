'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  baseAmount: number
  addOnAmount: number
  taxAmount: number
  createdAt: string
  attendeeName: string
  attendeePhone: string
  address?: string
  notes?: string
  pooja: { title: string; slug: string; category: { name: string } }
  slot: { date: string; startTime: string; location: { name: string; city: string } }
  vendor?: { businessName: string; user: { name: string } }
  payments: { status: string; provider: string; paymentRef: string }[]
  orderItems: { addOn: { name: string }; price: number }[]
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    Promise.resolve(params).then(({ id }) => {
      fetch('/api/auth/me')
        .then((res) => {
          if (!res.ok) {
            router.push(`/login?redirect=/my-orders/${id}`)
            return null
          }
          return fetch(`/api/orders/${id}`)
        })
        .then((res) => res?.json())
        .then((data) => {
          if (data?.success) setOrder(data.data)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    })
  }, [params, router])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    
    setCancelling(true)
    try {
      const res = await fetch(`/api/orders/${order?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', cancellationReason: 'User requested cancellation' }),
      })
      const data = await res.json()
      if (data.success) setOrder(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setCancelling(false)
    }
  }

  const canCancel = order && ['BOOKED', 'ASSIGNED'].includes(order.status)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl mb-4">Order not found</h2>
          <Link href="/my-orders" className="text-primary hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  const statusTimeline = [
    { status: 'BOOKED', label: 'Order Placed', icon: '✓' },
    { status: 'ASSIGNED', label: 'Assigned to Pandit', icon: '👤' },
    { status: 'IN_PROGRESS', label: 'In Progress', icon: '🪔' },
    { status: 'COMPLETED', label: 'Completed', icon: '✨' },
  ]

  const currentIndex = statusTimeline.findIndex(s => s.status === order.status)

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/my-orders" className="text-text-secondary hover:text-primary">
              ← Back to orders
            </Link>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="font-heading text-3xl mb-2">Order Confirmed</h1>
          <p className="text-text-secondary">Order No: {order.orderNo}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            {statusTimeline.map((step, index) => (
              <div key={step.status} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                {index < statusTimeline.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentIndex ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {statusTimeline.map((step, index) => (
              <span key={step.status} className={`text-xs ${
                index <= currentIndex ? 'text-primary' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-surface rounded-2xl p-6">
            <h2 className="font-heading text-xl mb-4">Pooja Details</h2>
            <p className="font-semibold text-lg mb-2">{order.pooja.title}</p>
            <p className="text-text-secondary text-sm mb-4">{order.pooja.category.name}</p>
            
            <div className="space-y-2 text-sm">
              <p><span className="text-text-secondary">Date:</span> {new Date(order.slot.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><span className="text-text-secondary">Time:</span> {order.slot.startTime}</p>
              <p><span className="text-text-secondary">Location:</span> {order.slot.location.name}, {order.slot.location.city}</p>
              {order.vendor && (
                <p><span className="text-text-secondary">Pandit:</span> {order.vendor.businessName}</p>
              )}
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6">
            <h2 className="font-heading text-xl mb-4">Attendee Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-text-secondary">Name:</span> {order.attendeeName}</p>
              <p><span className="text-text-secondary">Phone:</span> {order.attendeePhone}</p>
              {order.address && (
                <p><span className="text-text-secondary">Address:</span> {order.address}</p>
              )}
              {order.notes && (
                <p><span className="text-text-secondary">Notes:</span> {order.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="font-heading text-xl mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>₹{order.baseAmount.toLocaleString()}</span>
            </div>
            {order.addOnAmount > 0 && (
              <div className="flex justify-between">
                <span>Add-ons</span>
                <span>₹{order.addOnAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{order.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canCancel && (
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-6 py-3 bg-error text-white rounded-lg hover:bg-error/90 transition disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}

        {/* Help */}
        <div className="mt-8 p-4 bg-accent/10 rounded-lg">
          <p className="text-sm">
            Need help? Contact us at{' '}
            <span className="text-primary font-medium">support@poojabook.com</span> or{' '}
            <span className="text-primary font-medium">+91 98765 43210</span>
          </p>
        </div>
      </div>
    </div>
  )
}
