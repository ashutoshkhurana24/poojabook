'use client'

import { useState } from 'react'

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showNotif, setShowNotif] = useState(false)

  const handleSend = () => {
    if (!title || !body) return
    
    const notification = { title, body, timestamp: Date.now() }
    const existing = JSON.parse(localStorage.getItem('poojabook_notifications') || '[]')
    existing.push(notification)
    localStorage.setItem('poojabook_notifications', JSON.stringify(existing))
    
    window.dispatchEvent(new CustomEvent('poojabook-notification', { detail: { title, body } }))
    
    setShowNotif(true)
    setTimeout(() => setShowNotif(false), 5000)
  }

  const quickNotifications = [
    { title: 'Pooja Reminder', body: 'Your booked pooja is tomorrow! 🙏' },
    { title: 'Special Offer', body: '🎉 20% off on Lakshmi Puja this weekend!' },
    { title: 'Festival Alert', body: 'Diwali is in 7 days! Book now 🪔' },
    { title: 'New Pooja', body: 'Hanuman Puja now available!' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* In-page notification that WILL show */}
      {showNotif && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ea580c',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 99999,
          maxWidth: '400px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
          <div style={{ fontSize: '14px' }}>{body}</div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Send Notifications</h1>
        <p className="text-gray-600 mb-6">Send in-app notifications to users</p>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Compose Notification</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="PoojaBook Reminder"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Your Ganesh Puja is tomorrow at 10 AM"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!title || !body}
              className="w-full py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              Show Notification
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Templates</h2>
          <div className="space-y-2">
            {quickNotifications.map((notif, idx) => (
              <button
                key={idx}
                onClick={() => { setTitle(notif.title); setBody(notif.body) }}
                className="w-full p-3 text-left bg-gray-50 hover:bg-orange-50 rounded-lg"
              >
                <p className="font-medium">{notif.title}</p>
                <p className="text-sm text-gray-500">{notif.body}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> This shows an in-app notification. 
            For browser push notifications, user must allow in browser settings.
          </p>
        </div>
      </div>
    </div>
  )
}
