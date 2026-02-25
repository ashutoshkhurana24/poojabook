import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

console.log('Firebase env check:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? 'SET' : 'MISSING',
})

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

let messaging: ReturnType<typeof getMessaging> | null = null

export const initializeFirebase = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const supported = await isSupported()
    if (!supported) {
      console.error('Firebase Messaging is not supported in this browser')
      return null
    }
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
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
  
  try {
    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)
    if (permission !== 'granted') {
      console.log('Notification permission not granted')
      return null
    }

    const messaging = await initializeFirebase()
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
    console.log('FCM Token obtained:', token ? 'yes' : 'no')
    return token
  } catch (error: any) {
    console.error('Error getting notification permission:', error?.message || error)
    return null
  }
}

export const onForegroundMessage = (callback: (payload: any) => void) => {
  return () => {}
}

export { messaging }
