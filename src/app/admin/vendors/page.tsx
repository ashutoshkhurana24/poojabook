'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Vendor {
  id: string
  businessName: string
  description: string
  isVerified: boolean
  rating: number
  languages: string[]
  serviceAreas: string[]
  user: { name: string; phone: string; email: string }
  orderCount: number
}

export default function AdminVendorsPage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', businessName: '', description: '', password: ''
  })

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok || res.status === 401) {
          router.push('/login?redirect=/admin/vendors')
          return null
        }
        return res.json()
      })
      .then((userData) => {
        if (!userData || userData.data?.role !== 'ADMIN') {
          router.push('/?unauthorized=true')
          return null
        }
        setAuthorized(true)
        return fetch('/api/admin/vendors', { credentials: 'include' })
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data?.success) setVendors(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const fetchVendors = () => {
    fetch('/api/admin/vendors', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVendors(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setShowAdd(false)
        setFormData({ name: '', phone: '', email: '', businessName: '', description: '', password: '' })
        fetchVendors()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleVerify = async (vendorId: string, isVerified: boolean) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vendorId, isVerified: !isVerified }),
      })
      const data = await res.json()
      if (data.success) {
        setVendors(vendors.map(v => v.id === vendorId ? { ...v, isVerified: !isVerified } : v))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl">Vendors</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-surface rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg">{vendor.businessName}</h3>
                <p className="text-text-secondary text-sm">{vendor.user.name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                vendor.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {vendor.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <p><span className="text-text-secondary">Phone:</span> {vendor.user.phone}</p>
              {vendor.user.email && <p><span className="text-text-secondary">Email:</span> {vendor.user.email}</p>}
              <p><span className="text-text-secondary">Languages:</span> {vendor.languages.join(', ')}</p>
              <p><span className="text-text-secondary">Orders:</span> {vendor.orderCount}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleVerify(vendor.id, vendor.isVerified)}
                className={`flex-1 py-2 rounded-lg text-sm transition ${
                  vendor.isVerified
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {vendor.isVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {vendors.length === 0 && (
        <div className="bg-surface rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="font-heading text-xl mb-2">No vendors yet</h3>
          <p className="text-text-secondary">Add your first vendor to get started</p>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-heading text-xl mb-4">Add New Vendor</h3>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <input
                type="text"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Add Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-background"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
