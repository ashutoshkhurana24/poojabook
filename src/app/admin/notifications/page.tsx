'use client'

import { useState, useEffect } from 'react'

interface TokenStats {
  userTokens: number
  anonTokens: number
}

interface SendResult {
  sent: number
  failed: number
  total: number
}

const quickTemplates = [
  { title: 'Pooja Reminder', body: 'Your booked pooja is tomorrow! 🙏 Be prepared.' },
  { title: 'Special Offer', body: '🎉 20% off on Lakshmi Puja this weekend! Book now.' },
  { title: 'Festival Alert', body: 'Diwali is in 7 days! Book your pooja now 🪔' },
  { title: 'New Pooja Available', body: 'Hanuman Puja is now available. Book your slot today!' },
]

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<TokenStats | null>(null)

  useEffect(() => {
    fetch('/api/notifications/debug')
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          setStats({ userTokens: r.data.userTokens, anonTokens: r.data.anonTokens })
        }
      })
      .catch(() => {})
  }, [result])

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)
    setError('')

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, type: 'all' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send notifications')
      } else {
        setResult(data.data)
        setTitle('')
        setBody('')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setSending(false)
    }
  }

  const totalTokens = (stats?.userTokens ?? 0) + (stats?.anonTokens ?? 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1>
          <p className="text-gray-500 mt-1">Send real browser push notifications to all visitors</p>
        </div>

        {/* Token stats */}
        <div className="bg-white rounded-xl shadow p-5 flex gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{totalTokens}</p>
            <p className="text-sm text-gray-500 mt-1">Total subscribers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-700">{stats?.userTokens ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">Logged-in users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-700">{stats?.anonTokens ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">Anonymous visitors</p>
          </div>
        </div>

        {/* Send result banner */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium">
              ✓ Sent to {result.sent} of {result.total} subscribers
              {result.failed > 0 && ` (${result.failed} failed)`}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Compose */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Compose Notification</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special Offer 🎉"
              maxLength={80}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="e.g. 20% off on all poojas this weekend!"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{body.length}/200</p>
          </div>

          <button
            onClick={handleSend}
            disabled={!title.trim() || !body.trim() || sending || totalTokens === 0}
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {sending ? 'Sending…' : `Send to All ${totalTokens > 0 ? `(${totalTokens} subscribers)` : ''}`}
          </button>

          {totalTokens === 0 && stats !== null && (
            <p className="text-sm text-yellow-700 bg-yellow-50 rounded-lg p-3">
              No subscribers yet. Visitors need to allow notifications on your site before you can push to them.
            </p>
          )}
        </div>

        {/* Quick templates */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Templates</h2>
          <div className="space-y-2">
            {quickTemplates.map((t, i) => (
              <button
                key={i}
                onClick={() => { setTitle(t.title); setBody(t.body); setResult(null); setError('') }}
                className="w-full p-3 text-left bg-gray-50 hover:bg-orange-50 rounded-lg transition"
              >
                <p className="font-medium text-gray-800">{t.title}</p>
                <p className="text-sm text-gray-500">{t.body}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
