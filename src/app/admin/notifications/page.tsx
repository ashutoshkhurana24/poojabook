'use client'

import { useState } from 'react'

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [result, setResult] = useState('')

  const handleSend = () => {
    if (!title || !body) {
      setResult('Please enter title and message')
      return
    }

    if (!('Notification' in window)) {
      setResult('This browser does not support notifications')
      return
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.svg'
      })
      setResult('✅ Notification sent!')
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.svg'
          })
          setResult('✅ Permission granted! Notification sent!')
        } else {
          setResult('❌ Notifications blocked. Please enable in browser settings.')
        }
      })
    }
  }

  const quickNotifications = [
    { title: 'Pooja Reminder', body: 'Your booked pooja is tomorrow! 🙏' },
    { title: 'Special Offer', body: '🎉 20% off on Lakshmi Puja this weekend!' },
    { title: 'Festival Alert', body: 'Diwali is in 7 days! Book now 🪔' },
    { title: 'New Pooja', body: 'Hanuman Puja now available!' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Send Notifications</h1>
        <p className="text-gray-600 mb-6">Send push notifications to users</p>

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
              className="w-full py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
            >
              Send Notification
            </button>

            {result && (
              <div className={`p-4 rounded-lg ${result.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {result}
              </div>
            )}
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
      </div>
    </div>
  )
}
