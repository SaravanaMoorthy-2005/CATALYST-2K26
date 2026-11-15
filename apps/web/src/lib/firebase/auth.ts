import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { firebaseApp } from './config'

export const auth = getAuth(firebaseApp)

if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_PROJECT_ID?.includes('demo-')) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}
