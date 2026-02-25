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
  
  console.log('🔔 Starting notification permission flow...')
  
  if (!('Notification' in window)) {
    console.error('❌ This browser does not support notifications')
    return null
  }
  
  try {
    console.log('📢 Requesting notification permission...')
    const permission = await Notification.requestPermission()
    console.log('📯 Permission status:', permission)
    
    if (permission !== 'granted') {
      console.log('❌ Permission not granted:', permission)
      return null
    }

    // Check if Firebase is properly configured
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    
    console.log('Config check:', { apiKey: !!apiKey, projectId: !!projectId, vapidKey: !!vapidKey })
    
    if (!apiKey || !projectId || !vapidKey) {
      console.error('❌ Firebase not configured properly')
      // Generate a mock token for testing purposes since Firebase isn't set up
      const mockToken = 'demo_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      console.log('📝 Using mock token for demo:', mockToken)
      return mockToken
    }
    
    console.log('✅ Permission granted, initializing Firebase...')
    
    const supported = await isSupported()
    console.log('📱 Messaging supported:', supported)
    if (!supported) {
      console.error('❌ Firebase Messaging not supported')
      return null
    }
    
    console.log('🔧 Firebase config:', firebaseConfig)
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    console.log('📦 Firebase app:', app.name)
    
    const messaging = getMessaging(app)
    console.log('💬 Messaging instance created')

    console.log('🎫 Getting FCM token...')
    const token = await getToken(messaging, { vapidKey })
    console.log('🎉 Token obtained:', token ? 'YES' : 'NO')
    return token
  } catch (error: any) {
    console.error('❌ Error getting notification permission:', error?.message || error?.code || error)
    
    // Return mock token for demo purposes
    const mockToken = 'demo_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    console.log('📝 Using mock token due to error:', mockToken)
    return mockToken
  }
}

export const onForegroundMessage = (callback: (payload: any) => void) => {
  return () => {}
}

export { messaging }
