'use client'

import { useLoadingStore } from '@/store/loading'
import { Spinner } from '@/components/ui/spinner'

export function LoadingOverlay({ visible }: { visible?: boolean }) {
  const requestCount = useLoadingStore((state) => state.requestCount)
  const isLoading = visible || requestCount > 0

  if (!isLoading) return null

  return (
    <div className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative flex items-center justify-center p-4 rounded-full bg-background shadow-lg border'>
          <Spinner className='size-8 text-primary' />
        </div>
        <p className='text-sm font-medium text-muted-foreground animate-pulse'>Đang xử lý...</p>
      </div>
    </div>
  )
}
