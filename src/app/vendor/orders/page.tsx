'use client'

import { useEffect, useState } from 'react'

interface Order {
  id: string
  orderNo: string
  status: string
  pooja: { title: string }
  slot: { date: string; startTime: string; location: { name: string; city: string } }
  customer: { name: string; phone: string }
  notes?: string
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = () => {
    const url = filter ? `/api/vendor/orders?status=${filter}` : '/api/vendor/orders'
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/vendor/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, notes }),
      })
      const data = await res.json()
      if (data.success) {
        setSelectedOrder(null)
        setNotes('')
        fetchOrders()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-surface hover:bg-primary/10'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-surface rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="text-text-secondary text-sm font-mono">{order.orderNo}</span>
                </div>
                <h3 className="font-heading text-lg mb-1">{order.pooja.title}</h3>
                <p className="text-text-secondary text-sm">
                  {new Date(order.slot.date).toLocaleDateString('en-IN', { 
                    weekday: 'long', day: 'numeric', month: 'long' 
                  })} at {order.slot.startTime}
                </p>
                <p className="text-text-secondary text-sm">
                  {order.slot.location.name}, {order.slot.location.city}
                </p>
                <p className="text-text-secondary text-sm mt-2">
                  Customer: {order.customer.name} • {order.customer.phone}
                </p>
                {order.notes && (
                  <p className="text-text-secondary text-sm mt-2 bg-background p-2 rounded">
                    Notes: {order.notes}
                  </p>
                )}
              </div>
              
              {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="bg-surface rounded-2xl p-12 text-center">
          <p className="text-text-secondary">No orders found</p>
        </div>
      )}

      {/* Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-heading text-xl mb-4">Update Order</h3>
            <p className="text-text-secondary mb-4">{selectedOrder.pooja.title}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Add Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="Any updates or notes..."
              />
            </div>

            <div className="flex gap-2 mb-4">
              {selectedOrder.status === 'ASSIGNED' && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'IN_PROGRESS')}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Start Work
                </button>
              )}
              {selectedOrder.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'COMPLETED')}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Complete
                </button>
              )}
            </div>
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2 border rounded-lg hover:bg-background"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
