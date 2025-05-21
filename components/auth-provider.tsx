"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User, Session, AuthError } from "@supabase/supabase-js"
import { syncUserProfile, type AppUser } from "@/services/user-service"

type AuthContextType = {
  user: User | null
  session: Session | null
  appUser: AppUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data?: any }>
  signUp: (
    email: string,
    password: string,
    userData?: Partial<AppUser>,
  ) => Promise<{ error: AuthError | null; data?: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  updateProfile: (profileData: Partial<AppUser>) => Promise<{ error: any; data?: AppUser | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const redirectInProgress = useRef(false)
  const authChangeHandled = useRef(false)

  const safeRedirect = (path: string) => {
    if (redirectInProgress.current) return
    redirectInProgress.current = true
    console.log(`🚀 Redirigiendo a ${path}`)
    setTimeout(() => {
      router.push(path)
      setTimeout(() => {
        redirectInProgress.current = false
      }, 1000)
    }, 100)
  }

  const syncUserWithDatabase = async (authUser: User) => {
    try {
      console.log("🔄 Syncing auth user with database")
      const dbUser = await syncUserProfile(authUser)
      if (dbUser) {
        setAppUser(dbUser)
        console.log("✅ User synced with database successfully")
      } else {
        console.error("❌ Failed to sync user with database")
      }
      return dbUser
    } catch (error) {
      console.error("❌ Error syncing user with database:", error)
      return null
    }
  }

  useEffect(() => {
    if (authChangeHandled.current) return

    const initialize = async () => {
      try {
        authChangeHandled.current = true
        setIsLoading(true)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          await syncUserWithDatabase(session.user)
        }

        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("🔔 Estado de autenticación cambiado:", event)

          if (session) {
            setSession(session)
            setUser(session.user)
            const dbUser = await syncUserWithDatabase(session.user)

            if (event === "SIGNED_IN") {
              const userRole = dbUser?.role || "colaborador"
              console.log("👤 Rol desde tabla users:", userRole)

              if (userRole === "admin") {
                safeRedirect("/admin/dashboard")
              } else {
                safeRedirect("/colaborador/tareas")
              }
            }
          } else {
            setSession(null)
            setUser(null)
            setAppUser(null)
            if (event === "SIGNED_OUT") {
              safeRedirect("/login")
            }
          }

          setIsLoading(false)
        })

        return () => {
          subscription.unsubscribe()
          authChangeHandled.current = false
        }
      } catch (error) {
        console.error("❌ Error al inicializar autenticación:", error)
        setIsLoading(false)
        authChangeHandled.current = false
      }
    }

    initialize()
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      return { error: null, data }
    } catch (error) {
      setIsLoading(false)
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, userData?: Partial<AppUser>) => {
    try {
      setIsLoading(true)

      const userMetadata = {
        name: userData?.name || email.split("@")[0],
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setIsLoading(false)
        return { error }
      }

      if (data.user) {
        await syncUserWithDatabase(data.user)
      }

      setIsLoading(false)
      return { error: null, data }
    } catch (error) {
      setIsLoading(false)
      return { error: error as AuthError, data: null }
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
    } catch (error) {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const updateProfile = async (profileData: Partial<AppUser>) => {
    try {
      if (!appUser) return { error: new Error("No user logged in") }

      const { data: updatedUser, error: dbError } = await supabase
        .from("users")
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq("id", appUser.id)
        .select()
        .single()

      if (dbError) return { error: dbError }

      setAppUser(updatedUser)
      return { error: null, data: updatedUser }
    } catch (error) {
      return { error, data: null }
    }
  }

  const value = {
    user,
    appUser,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
