'use client'

import { useAuthSession } from '@/hooks/use-auth-session'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Initialize auth session but do not redirect to login
  useAuthSession({ redirectToLogin: false })

  // Always render children
  return <>{children}</>
}
