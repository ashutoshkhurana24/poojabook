import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456:web:demo',
}

let messaging: ReturnType<typeof getMessaging> | null = null

export const initializeFirebase = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    
    if (!app) {
      console.error('Failed to initialize Firebase app')
      return null
    }
    
    messaging = getMessaging(app)
    return messaging
  } catch (error) {
    console.error('Firebase initialization error:', error)
    return null
  }
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications')
    return null
  }
  
  if (!('serviceWorker' in navigator)) {
    console.error('This browser does not support service workers')
    return null
  }
  
  try {
    const permission = await Notification.requestPermission()
    console.log('Permission status:', permission)
    if (permission !== 'granted') {
      return null
    }

    const messaging = initializeFirebase()
    if (!messaging) {
      console.error('Failed to initialize messaging')
      return null
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      console.error('VAPID key not configured')
      return null
    }

    const token = await getToken(messaging, { vapidKey })
    console.log('FCM Token:', token)
    return token
  } catch (error) {
    console.error('Error getting notification permission:', error)
    return null
  }
}

export const onForegroundMessage = (callback: (payload: any) => void) => {
  try {
    const messaging = initializeFirebase()
    if (!messaging) return () => {}

    return onMessage(messaging, (payload) => {
      callback(payload)
    })
  } catch (error) {
    console.error('Error setting up foreground messages:', error)
    return () => {}
  }
}

export { messaging }
