'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TopPooja {
  poojaId: string
  _count: { poojaId: number }
  pooja: { id: string; title: string; slug: string; basePrice: number } | null
}

interface DashboardData {
  stats: {
    totalOrders: number
    totalRevenue: number
    activeVendors: number
    totalCustomers: number
  }
  recentOrders: {
    id: string
    orderNo: string
    totalAmount: number
    status: string
    createdAt: string
    customer: { name: string; phone: string }
    pooja: { title: string }
  }[]
  topPoojas: TopPooja[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok || res.status === 401) {
          router.push('/login?redirect=/admin')
          return null
        }
        return res.json()
      })
      .then((userData) => {
        if (!userData || userData.data?.role !== 'ADMIN') {
          router.push('/?unauthorized=true')
          return null
        }
        return fetch('/api/admin/dashboard', { credentials: 'include' })
      })
      .then((res) => res?.json())
      .then((response) => {
        if (response?.success) setData(response.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-xl mb-4">Unauthorized Access</p>
          <p className="text-text-secondary">You must be an admin to view this page.</p>
        </div>
      </div>
    )
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
      <h1 className="font-heading text-3xl mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-semibold text-primary">{data?.stats.totalOrders || 0}</p>
        </div>
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-semibold text-primary">₹{(data?.stats.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">Active Vendors</p>
          <p className="text-3xl font-semibold text-primary">{data?.stats.activeVendors || 0}</p>
        </div>
        <div className="bg-surface rounded-2xl p-6">
          <p className="text-text-secondary text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-semibold text-primary">{data?.stats.totalCustomers || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-surface rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary hover:underline text-sm">
            View All →
          </Link>
        </div>
        
        {data?.recentOrders.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-text-secondary text-sm border-b">
                  <th className="pb-3">Order No</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Pooja</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-sm">{order.orderNo}</td>
                    <td className="py-3">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-text-secondary text-sm">{order.customer.phone}</p>
                    </td>
                    <td className="py-3">{order.pooja.title}</td>
                    <td className="py-3">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Poojas */}
      <div className="bg-surface rounded-2xl p-6">
        <h2 className="font-heading text-xl mb-6">Top Performing Poojas</h2>
        {data?.topPoojas.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No data yet</p>
        ) : (
          <div className="space-y-4">
            {data?.topPoojas.map((item, index) => (
              <div key={item.poojaId} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.pooja?.title || 'Unknown'}</span>
                </div>
                <span className="text-text-secondary">{item._count.poojaId} bookings</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
