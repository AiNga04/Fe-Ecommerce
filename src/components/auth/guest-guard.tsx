'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'
import Routers from '@/constants/routers'
import { useAuthSession } from '@/hooks/use-auth-session'

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthSession({ redirectToLogin: false })

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(Routers.HOME)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
    return (
      <div className='min-h-screen grid place-items-center'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Spinner className='size-5' />
          <span>Đang kiểm tra trạng thái...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
