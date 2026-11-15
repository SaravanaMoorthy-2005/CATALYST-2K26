import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { firebaseApp } from './config'

export const db = getFirestore(firebaseApp)

if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_PROJECT_ID?.includes('demo-')) {
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
  } catch {
    // already connected
  }
}
