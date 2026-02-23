'use client'

import { useEffect, useState } from 'react'

interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  pooja: { title: string }
  slot: { date: string; startTime: string; location: { name: string; city: string } }
  customer: { name: string; phone: string }
}

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/vendor/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setData(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl mb-4">Vendor Access Only</h2>
          <p className="text-text-secondary">Please login as vendor to access this page</p>
        </div>
      </div>
    )
  }

  const { vendor, todayOrders, pendingOrders, completedOrders, weekEarnings } = data

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Vendor Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">Today&apos;s Orders</p>
          <p className="text-3xl font-semibold text-primary">{todayOrders?.length || 0}</p>
        </div>
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">Pending Assignments</p>
          <p className="text-3xl font-semibold text-primary">{pendingOrders?.length || 0}</p>
        </div>
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">This Week&apos;s Earnings</p>
          <p className="text-3xl font-semibold text-primary">₹{(weekEarnings || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-surface rounded-2xl p-6 mb-8">
        <h2 className="font-heading text-xl mb-6">Today&apos;s Schedule</h2>
        {todayOrders?.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No orders scheduled for today</p>
        ) : (
          <div className="space-y-4">
            {todayOrders?.map((order: Order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-semibold">{order.pooja.title}</p>
                  <p className="text-text-secondary text-sm">
                    {order.slot.startTime} • {order.slot.location.name}, {order.slot.location.city}
                  </p>
                  <p className="text-text-secondary text-sm">
                    Customer: {order.customer.name} • {order.customer.phone}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  order.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Orders */}
      <div className="bg-surface rounded-2xl p-6">
        <h2 className="font-heading text-xl mb-6">Pending Orders</h2>
        {pendingOrders?.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No pending orders</p>
        ) : (
          <div className="space-y-4">
            {pendingOrders?.map((order: Order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-semibold">{order.pooja.title}</p>
                  <p className="text-text-secondary text-sm">
                    {new Date(order.slot.date).toLocaleDateString('en-IN')} at {order.slot.startTime}
                  </p>
                  <p className="text-text-secondary text-sm">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await fetch('/api/vendor/orders', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id, status: 'ASSIGNED' }),
                      })
                      window.location.reload()
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      await fetch('/api/vendor/orders', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id, status: 'CANCELLED', notes: 'Rejected by vendor' }),
                      })
                      window.location.reload()
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-error/10"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
