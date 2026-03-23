"use client"

import { useAuth, AuthProvider } from "@/hooks/use-auth"
import { LoginPage } from "./login-page"
import { Sidebar } from "@/components/layout/sidebar"

function AuthGateInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <>
      <Sidebar />
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-6xl p-4 pt-16 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
    </>
  )
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGateInner>{children}</AuthGateInner>
    </AuthProvider>
  )
}
