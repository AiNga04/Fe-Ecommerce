'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthSession } from '@/hooks/use-auth-session'
import { Role } from '@/constants/enum/role'
import Routers from '@/constants/routers'
import { LoadingOverlay } from '@/components/common/loading-overlay'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthSession()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace(Routers.LOGIN)
      return
    }

    if (user && user.roles) {
      const hasPermission = user.roles.some((role) => allowedRoles.includes(role))
      if (!hasPermission) {
        router.replace(Routers.FORBIDDEN)
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router])

  if (isLoading) {
    return <LoadingOverlay visible={true} />
  }

  if (!isAuthenticated || !user || !user.roles.some((role) => allowedRoles.includes(role))) {
    return null // Don't render anything while redirecting
  }

  return <>{children}</>
}
