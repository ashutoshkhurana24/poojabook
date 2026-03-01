'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  createdAt: string
  customer: { name: string; phone: string }
  pooja: { title: string }
  slot: { date: string; location: { name: string; city: string } }
  vendor?: { id: string; user: { name: string } }
}

interface Vendor {
  id: string
  businessName: string
  user: { name: string }
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [assignVendor, setAssignVendor] = useState('')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) {
          router.push('/login?redirect=/admin/orders')
          return
        }
        
        const userData = await authRes.json()
        if (!userData.success || userData.data?.role !== 'ADMIN') {
          router.push('/?unauthorized=true')
          return
        }
        
        setAuthorized(true)
        
        const [ordersRes, vendorsRes] = await Promise.all([
          fetch('/api/admin/orders', { credentials: 'include' }),
          fetch('/api/admin/vendors', { credentials: 'include' })
        ])
        
        const ordersData = await ordersRes.json()
        const vendorsData = await vendorsRes.json()
        
        if (ordersData.success) setOrders(ordersData.data.orders)
        if (vendorsData.success) setVendors(vendorsData.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleAssign = async () => {
    if (!selectedOrder || !assignVendor) return

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId: selectedOrder.id, vendorId: assignVendor, status: 'ASSIGNED' }),
      })
      const data = await res.json()
      if (data.success) {
        const vendor = vendors.find(v => v.id === assignVendor)
        setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, vendor: vendor ? { id: vendor.id, user: vendor.user } : undefined } : o))
        setSelectedOrder(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, status }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredOrders = filter ? orders.filter(o => o.status === filter) : orders

  if (loading || !authorized) {
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
        {['', 'BOOKED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
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

      {/* Orders Table */}
      <div className="bg-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr className="text-left text-text-secondary text-sm">
                <th className="p-4">Order No</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pooja</th>
                <th className="p-4">Date</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-background/50">
                  <td className="p-4 font-mono text-sm">{order.orderNo}</td>
                  <td className="p-4">
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-text-secondary text-sm">{order.customer.phone}</p>
                  </td>
                  <td className="p-4">{order.pooja.title}</td>
                  <td className="p-4">
                    <p>{new Date(order.slot.date).toLocaleDateString('en-IN')}</p>
                    <p className="text-text-secondary text-sm">{order.slot.location.city}</p>
                  </td>
                  <td className="p-4">
                    {order.vendor ? (
                      <span className="text-sm">{order.vendor.user.name}</span>
                    ) : (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary text-sm hover:underline"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                  <td className="p-4 font-semibold">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 rounded border text-sm"
                    >
                      <option value="BOOKED">Booked</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Vendor Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-heading text-xl mb-4">Assign Vendor</h3>
            <p className="text-text-secondary mb-4">Order: {selectedOrder.orderNo}</p>
            <select
              value={assignVendor}
              onChange={(e) => setAssignVendor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.businessName}</option>
              ))}
            </select>
            <div className="flex gap-4">
              <button
                onClick={handleAssign}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Assign
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2 border rounded-lg hover:bg-background"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
