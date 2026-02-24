'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  phone: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data)
      })
      .catch(() => {})
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  const isAdmin = user?.role === 'ADMIN'
  const isVendor = user?.role === 'VENDOR'

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-heading text-xl">🪔</span>
            </div>
            <span className="font-heading text-2xl text-primary">PoojaBook</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/poojas" className="text-text-secondary hover:text-primary font-medium">
              Browse Poojas
            </Link>
            <Link href="/poojas?mode=IN_TEMPLE" className="text-text-secondary hover:text-primary font-medium">
              Temple Poojas
            </Link>
            <Link href="/poojas?mode=AT_HOME" className="text-text-secondary hover:text-primary font-medium">
              At Home
            </Link>
            <Link href="/calendar" className="text-text-secondary hover:text-primary font-medium">
              Hindu Calendar
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition"
                >
                  <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg border py-2">
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-background">
                        Admin Dashboard
                      </Link>
                    )}
                    {isVendor && (
                      <Link href="/vendor" className="block px-4 py-2 text-sm hover:bg-background">
                        Vendor Dashboard
                      </Link>
                    )}
                    <Link href="/my-orders" className="block px-4 py-2 text-sm hover:bg-background">
                      My Orders
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-background">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-text-secondary hover:text-primary font-medium">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
