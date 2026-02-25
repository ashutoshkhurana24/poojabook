import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let messaging: ReturnType<typeof getMessaging> | null = null

export const initializeFirebase = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const app = initializeApp(firebaseConfig)
    messaging = getMessaging(app)
    return messaging
  } catch (error) {
    console.error('Firebase initialization error:', error)
    return null
  }
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return null
    }

    const messaging = initializeFirebase()
    if (!messaging) return null

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })

    return token
  } catch (error) {
    console.error('Error getting notification permission:', error)
    return null
  }
}

export const onForegroundMessage = (callback: (payload: any) => void) => {
  const messaging = initializeFirebase()
  if (!messaging) return () => {}

  return onMessage(messaging, (payload) => {
    callback(payload)
  })
}

export { messaging }
