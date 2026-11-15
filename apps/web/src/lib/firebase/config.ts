import { initializeApp, getApps, getApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoFakeKeyForLocalPreview12345',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'carecircle-preview.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'carecircle-preview',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:demo',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'carecircle-preview.appspot.com',
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const functionsRegion = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION ?? 'us-central1'
