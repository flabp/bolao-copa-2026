"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { AuthSession } from "@/lib/types"
import { authenticateParticipant } from "@/lib/supabase-store"

const AUTH_STORAGE_KEY = "bolao-auth-session"

interface AuthContextType {
  session: AuthSession | null
  isAuthenticated: boolean
  isAdmin: boolean
  currentParticipantId: string | null
  currentParticipantName: string | null
  login: (name: string, code: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        setSession(JSON.parse(stored))
      }
    } catch {}
    setLoaded(true)
  }, [])

  const login = useCallback(async (name: string, code: string) => {
    try {
      const participant = await authenticateParticipant(name, code)
      if (!participant) {
        return { success: false, error: "Nome ou codigo invalido" }
      }
      const newSession: AuthSession = {
        participantId: participant.id,
        participantName: participant.name,
        isAdmin: participant.isAdmin,
        loginAt: new Date().toISOString(),
      }
      setSession(newSession)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession))
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || "Erro ao fazer login" }
    }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  if (!loaded) return null // avoid hydration mismatch

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: session !== null,
        isAdmin: session?.isAdmin ?? false,
        currentParticipantId: session?.participantId ?? null,
        currentParticipantName: session?.participantName ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
