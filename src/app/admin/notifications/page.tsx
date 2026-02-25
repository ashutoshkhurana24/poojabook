'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const quickNotifications = [
  { title: 'Pooja Reminder', body: 'Your booked pooja is tomorrow! 🙏', type: 'pooja_reminder' },
  { title: 'Special Offer', body: '🎉 Get 20% off on Lakshmi Puja this weekend!', type: 'discount' },
  { title: 'Festival Alert', body: 'Diwali is in 7 days! Book your Lakshmi Puja now 🪔', type: 'festival' },
  { title: 'New Pooja', body: 'New: Hanuman Puja now available in your city!', type: 'new_pooja' },
]

const notificationTypes = [
  { value: 'all', label: 'All Users', description: 'Send to all users with notifications enabled' },
  { value: 'booked', label: 'Users with Bookings', description: 'Send to users who have booked poojas' },
  { value: 'specific', label: 'Specific User', description: 'Send to a particular user' },
]

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState<'all' | 'booked' | 'specific'>('all')
  const [targetUserId, setTargetUserId] = useState('')
  const [manualToken, setManualToken] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [testResult, setTestResult] = useState('')

  const handleSend = async () => {
    if (!title || !body) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          type,
          targetUserId: type === 'specific' ? targetUserId : undefined,
          data: { url: '/' },
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResult(data.data)
      } else {
        alert(data.error || 'Failed to send')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  const handleQuickSend = (notification: typeof quickNotifications[0]) => {
    setTitle(notification.title)
    setBody(notification.body)
  }

  const handleTestSend = async () => {
    if (!title || !body) {
      setTestResult('Please enter title and body')
      return
    }
    setSending(true)
    setTestResult('')
    
    // Try browser notification first
    if (Notification.permission === 'granted') {
      new Notification(title, { 
        body,
        icon: '/favicon.svg',
        tag: 'test-notification'
      })
      setTestResult('✅ Browser notification shown!')
    } else {
      // Fallback to API
      try {
        const res = await fetch('/api/notifications/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body }),
        })
        const data = await res.json()
        if (data.success) {
          setTestResult(data.data.demo ? '✅ Demo mode - notification sent locally!' : `✅ Sent to ${data.data.sent} users`)
        } else {
          setTestResult('❌ ' + (data.error || 'Failed'))
        }
      } catch (e) {
        setTestResult('❌ Error: ' + String(e))
      }
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Send Notifications</h1>
          <p className="text-gray-600">Push notifications to users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Compose Notification</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="PoojaBook - Reminder"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Your Ganesh Puja is tomorrow at 10 AM 🙏"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  {notificationTypes.map(nt => (
                    <option key={nt.value} value={nt.value}>{nt.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {notificationTypes.find(nt => nt.value === type)?.description}
                </p>
              </div>

              {type === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="text"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sending || !title || !body}
                className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                style={{ backgroundColor: '#C85A28' }}
              >
                {sending ? 'Sending...' : 'Send Notification'}
              </button>

              {result && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Sent to {result.sent} users ({result.failed} failed)
                  </p>
                </div>
              )}
            </div>

            {/* Test Token Section */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Test with Token</h2>
              <p className="text-sm text-gray-600 mb-3">
                Get your FCM token from browser console after allowing notifications, then paste it here to test.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste FCM token here..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={handleTestSend}
                  disabled={sending || !manualToken || !title || !body}
                  className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Test Notification'}
                </button>
                {testResult && (
                  <p className="text-sm font-medium">{testResult}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Notifications</h2>
              <div className="space-y-3">
                {quickNotifications.map((notif, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickSend(notif)}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-orange-50 rounded-lg transition border border-gray-100"
                  >
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-500 truncate">{notif.body}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Notification Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">-</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">-</p>
                  <p className="text-sm text-gray-600">Opted In</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Stats will update after users enable notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
