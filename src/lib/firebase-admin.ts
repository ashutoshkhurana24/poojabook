import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getMessaging, type MulticastMessage } from 'firebase-admin/messaging'

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin credentials not configured (FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY)')
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

export async function sendPushNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<{ successCount: number; failureCount: number }> {
  if (tokens.length === 0) return { successCount: 0, failureCount: 0 }

  getAdminApp()
  const messaging = getMessaging()

  const message: MulticastMessage = {
    tokens,
    notification: { title, body },
    webpush: {
      notification: {
        title,
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
          { action: 'view', title: 'View Details' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
      },
      fcmOptions: { link: data?.url ?? '/' },
    },
    data: data ?? {},
  }

  const response = await messaging.sendEachForMulticast(message)
  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
  }
}
