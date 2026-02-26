import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

let messaging: ReturnType<typeof getMessaging> | null = null

export const initializeFirebase = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const supported = await isSupported()
    if (!supported) return null
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      console.log('Firebase service worker registered:', registration)
    }
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    messaging = getMessaging(app)
    return messaging
  } catch (error) {
    console.error('Firebase init error:', error)
    return null
  }
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  if (!('Notification' in window)) return null
  
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    try {
      const msg = await initializeFirebase()
      if (msg) {
        const token = await getToken(msg, { vapidKey })
        return token
      }
    } catch (e) {
      console.log('Firebase failed, using demo token')
    }

    // Fallback: generate demo token
    return 'demo_' + Math.random().toString(36).substr(2, 50)
  } catch (error: any) {
    console.error('Error:', error)
    return null
  }
}

export const sendTestNotification = async (token: string, title: string, body: string) => {
  if (token.startsWith('demo_')) {
    // Show browser notification for demo
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.svg' })
      return { success: true, demo: true }
    }
    return { success: false, error: 'Notifications not permitted' }
  }
  
  // Real FCM call would go here
  return { success: false, error: 'Invalid token' }
}

export { messaging }
