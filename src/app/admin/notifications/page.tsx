'use client'

import { useState } from 'react'

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [result, setResult] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!title || !body) {
      setResult('Please enter title and message')
      return
    }

    setSending(true)
    setResult('')

    try {
      // Check permission
      if (Notification.permission === 'granted') {
        // Send notification directly
        new Notification(title, {
          body,
          icon: '/favicon.svg',
          tag: 'poojabook-notification'
        })
        setResult('✅ Notification sent directly to your browser!')
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.svg'
          })
          setResult('✅ Permission granted! Notification sent.')
        } else {
          setResult('❌ Notification permission denied')
        }
      } else {
        setResult('❌ Notifications blocked. Please enable in browser settings.')
      }
    } catch (error) {
      setResult('❌ Error: ' + String(error))
    } finally {
      setSending(false)
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
              disabled={sending || !title || !body}
              className="w-full py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Notification'}
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
                className="w-full p-3 text-left bg-gray-50 hover:bg-orange-50 rounded-lg transition"
              >
                <p className="font-medium">{notif.title}</p>
                <p className="text-sm text-gray-500">{notif.body}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Note</h3>
          <p className="text-sm text-yellow-700">
            This sends notifications directly to YOUR browser for testing. 
            For sending to ALL users, you need to set up OneSignal or Firebase properly.
          </p>
        </div>
      </div>
    </div>
  )
}
