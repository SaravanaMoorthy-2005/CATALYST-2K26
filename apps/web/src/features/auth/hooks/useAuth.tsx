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
  signInAsDemo: (role: Role) => void
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
    let isMounted = true
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (isMounted) {
          setUser(firebaseUser)
          setLoading(false)
        }
      })
      const timer = setTimeout(() => {
        if (isMounted) {
          setLoading(false)
        }
      }, 300)

      return () => {
        isMounted = false
        clearTimeout(timer)
        unsubscribe()
      }
    } catch {
      if (isMounted) {
        setLoading(false)
      }
    }
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

  const signInAsDemo = (role: Role) => {
    setCurrentRole(role)
    const demoEmails: Record<Role, string> = {
      owner: 'elder@carecircle.app',
      caregiver: 'caregiver@carecircle.app',
      family: 'family@carecircle.app',
    }
    const demoNames: Record<Role, string> = {
      owner: 'Eleanor Vance (Patient)',
      caregiver: 'Sarah Jenkins, RN (Caretaker)',
      family: 'Marcus Vance (Family Member)',
    }
    setUser({
      uid: `demo_${role}_uid`,
      email: demoEmails[role],
      displayName: demoNames[role],
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User)
  }

  const signOut = async () => {
    setUser(null)
    try {
      await fbSignOut(auth)
    } catch {
      // ignore in offline/preview
    }
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
        signInAsDemo,
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
