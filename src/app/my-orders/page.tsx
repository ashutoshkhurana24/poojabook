'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  createdAt: string
  pooja: { title: string; slug: string }
  slot: { date: string; startTime: string; location: { name: string; city: string } }
}

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login?redirect=/my-orders')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        return fetch('/api/orders')
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data?.success) setOrders(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-3xl mb-8">My Orders</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'BOOKED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-primary/10'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📿</div>
            <h3 className="font-heading text-xl mb-2">No orders yet</h3>
            <p className="text-text-secondary mb-6">Start your divine journey by booking a pooja</p>
            <Link href="/poojas" className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition">
              Browse Poojas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/my-orders/${order.id}`}
                className="block bg-surface rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="text-text-secondary text-sm">{order.orderNo}</span>
                    </div>
                    <h3 className="font-heading text-xl mb-1">{order.pooja.title}</h3>
                    <p className="text-text-secondary text-sm">
                      {new Date(order.slot.date).toLocaleDateString('en-IN', { 
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                      })} at {order.slot.startTime}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {order.slot.location.name}, {order.slot.location.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-primary">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                    <p className="text-text-secondary text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
