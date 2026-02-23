'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  role: string
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.role === 'ADMIN') {
          setUser(data.data)
        }
      })
      .catch(() => {})
  }, [])

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'Orders', icon: '📋' },
    { href: '/admin/vendors', label: 'Vendors', icon: '👤' },
    { href: '/admin/poojas', label: 'Poojas', icon: '🪔' },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl mb-4">Admin Access Only</h2>
          <p className="text-text-secondary">Please login as admin to access this page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-surface border-r p-6">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <span className="font-heading text-2xl text-primary">Admin</span>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-primary text-white'
                  : 'hover:bg-background'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
