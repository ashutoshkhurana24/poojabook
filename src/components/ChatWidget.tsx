'use client'

import { useState, useEffect, useRef, Suspense } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const quickReplies = [
  { label: 'Pooja pricing', message: 'What are the pooja pricing options?' },
  { label: 'How to book', message: 'How do I book a pooja?' },
  { label: 'Temple locations', message: 'Where are the temple locations?' },
  { label: 'Talk to support', message: 'I want to talk to a support agent' },
]

const botGreetings = [
  'Namaste! 🙏 How can we help you with your pooja booking today?',
  'Welcome to PoojaBook! 🪔 What can we assist you with?',
  'Hello! ✨ How may we help you today?',
]

function ChatWidgetInner() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    try {
      const stored = localStorage.getItem('poojabook_chat')
      if (stored) {
        const parsed = JSON.parse(stored)
        setMessages(parsed)
      } else {
        const greeting = botGreetings[Math.floor(Math.random() * botGreetings.length)]
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: greeting,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
        localStorage.setItem('poojabook_chat', JSON.stringify([welcomeMessage]))
      }
    } catch (e) {
      console.error('ChatWidget error:', e)
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('poojabook_chat', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isTyping])

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = getBotResponse(text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
      }
    }, 1500)
  }

  const getBotResponse = (userText: string): string => {
    const lower = userText.toLowerCase()
    
    if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('charge')) {
      return 'Our pooja services range from ₹510 for basic rituals to ₹15,100 for elaborate ceremonies. You can view all pricing on each pooja page. Would you like to browse specific poojas?'
    }
    
    if (lower.includes('book') || lower.includes('booking') || lower.includes('how to')) {
      return 'To book a pooja: 1) Browse our pooja listings, 2) Select your preferred date & time, 3) Choose temple or at-home service, 4) Complete payment. It\'s that simple! 🎯'
    }
    
    if (lower.includes('temple') || lower.includes('location')) {
      return 'We have partner temples in Mumbai, Delhi, Bangalore, Varanasi, Chennai, and more cities. You can select your preferred location while booking. Would you like to see poojas in a specific city?'
    }
    
    if (lower.includes('pandit') || lower.includes('priest')) {
      return 'All our pandits are verified and experienced in traditional rituals. You can view pandit profiles with ratings and reviews on each pooja booking page.'
    }
    
    if (lower.includes('support') || lower.includes('human') || lower.includes('agent')) {
      return 'A support agent will be with you shortly. For urgent queries, you can also email us at support@poojabook.com or call +91 98765 43210. 📞'
    }
    
    if (lower.includes('home') || lower.includes('at-home')) {
      return 'Yes! We offer at-home pooja services where our certified pandits will visit your location. You can select "At Home" mode when browsing poojas. 🏠'
    }
    
    if (lower.includes('online') || lower.includes('virtual')) {
      return 'We also offer online poojas where you can participate via video call. The pandit will perform the ritual and you can watch live from anywhere! 📱'
    }
    
    if (lower.includes('refund') || lower.includes('cancel')) {
      return 'We offer a full refund if cancelled 24+ hours before the scheduled time. For cancellations within 24 hours, a 50% refund applies. Please check our cancellation policy for details.'
    }
    
    return 'Thank you for your message! For detailed information about specific poojas, you can browse our listings at /poojas. Or you can call us at +91 98765 43210 for immediate assistance. 🙏'
  }

  const handleQuickReply = (message: string) => {
    sendMessage(message)
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 z-50 ${unreadCount > 0 ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: '#C85A28' }}
        aria-label="Open chat"
      >
        💬
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#C85A28' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white">🪔</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">PoojaBook Support</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFF8F0]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                  style={msg.sender === 'user' ? { backgroundColor: '#C85A28' } : {}}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 border-t bg-white overflow-x-auto flex gap-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(reply.message)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-primary/10 text-xs text-gray-700 rounded-full transition text-nowrap"
              >
                {reply.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-primary/90"
              style={{ backgroundColor: '#C85A28' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Chat Full Screen */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden">
          <div className="bg-primary px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#C85A28' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white">🪔</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">PoojaBook Support</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFF8F0]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                  style={msg.sender === 'user' ? { backgroundColor: '#C85A28' } : {}}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 border-t bg-white overflow-x-auto flex gap-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(reply.message)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-primary/10 text-xs text-gray-700 rounded-full transition"
              >
                {reply.label}
              </button>
            ))}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white disabled:opacity-50"
              style={{ backgroundColor: '#C85A28' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function ChatWidget() {
  return (
    <Suspense fallback={null}>
      <ChatWidgetInner />
    </Suspense>
  )
}
