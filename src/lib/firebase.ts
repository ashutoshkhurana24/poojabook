import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyBcv7anIkkK6nBdJ7YFuqjUze_CGc83ztM",
  authDomain: "poojabook-8ba7f.firebaseapp.com",
  projectId: "poojabook-8ba7f",
  storageBucket: "poojabook-8ba7f.firebasestorage.app",
  messagingSenderId: "656611524011",
  appId: "1:656611524011:web:c4a722b2516e61ea6de6ee"
}

const vapidKey = "BHxiMVVhBVkUrmQOhvSFworCWYkWF8c_p751iJ9GTne0DmPjdhWziN13EHxtewqvm8MfOQkc1oBX6pOX-YrXNqw"

let messaging: ReturnType<typeof getMessaging> | null = null

export const initializeFirebase = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const supported = await isSupported()
    if (!supported) {
      console.error('Firebase Messaging not supported')
      return null
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
  
  if (!('Notification' in window)) {
    alert('This browser does not support notifications')
    return null
  }
  
  try {
    const permission = await Notification.requestPermission()
    
    if (permission !== 'granted') {
      alert('Notification permission denied')
      return null
    }

    const supported = await isSupported()
    if (!supported) {
      alert('Firebase not supported in this browser')
      return null
    }
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const msg = getMessaging(app)

    const token = await getToken(msg, { vapidKey })
    console.log('FCM Token:', token)
    return token
  } catch (error: any) {
    console.error('Error:', error?.message || error)
    alert('Error: ' + (error?.message || 'Failed to get token'))
    return null
  }
}

export { messaging }
