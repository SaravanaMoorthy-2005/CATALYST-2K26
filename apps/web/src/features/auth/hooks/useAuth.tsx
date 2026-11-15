import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification as fbSendEmailVerification,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth } from '../../../lib/firebase/auth'
import { Role } from '@carecircle/shared'

interface AuthContextValue {
  user: User | null
  loading: boolean
  currentRole: Role
  setCurrentRole: (role: Role) => void
  activeCircleId: string | null
  setActiveCircleId: (id: string | null) => void
  signIn: (email: string, pass: string) => Promise<void>
  signUp: (email: string, pass: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  sendEmailVerification: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentRole, setCurrentRole] = useState<Role>('owner')
  const [activeCircleId, setActiveCircleId] = useState<string | null>('circle_demo_1')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const signUp = async (email: string, pass: string, displayName: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass)
    if (res.user) {
      await updateProfile(res.user, { displayName })
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOut = async () => {
    await fbSignOut(auth)
  }

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const sendEmailVerification = async () => {
    if (auth.currentUser) {
      await fbSendEmailVerification(auth.currentUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        currentRole,
        setCurrentRole,
        activeCircleId,
        setActiveCircleId,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        sendPasswordReset,
        sendEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
