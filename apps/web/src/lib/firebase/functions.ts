import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { firebaseApp, functionsRegion } from './config'

export const functions = getFunctions(firebaseApp, functionsRegion)

if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_PROJECT_ID?.includes('demo-')) {
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}
