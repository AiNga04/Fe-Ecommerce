'use client'

import { useAuthSession } from '@/hooks/use-auth-session'
import { Spinner } from '@/components/ui/spinner'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthSession({ redirectToLogin: true })

  if (isLoading) {
    return (
      <div className='min-h-screen grid place-items-center'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Spinner className='size-5' />
          <span>Đang xác thực phiên...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}
