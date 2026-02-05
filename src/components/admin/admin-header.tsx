'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AdminHeader() {
  return (
    <header className='h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10'>
      <div className='font-medium text-sm text-muted-foreground'>Khu vực quản trị</div>
      <div className='flex items-center gap-4'>
        <div className='text-right hidden md:block'>
          <p className='text-sm font-medium'>Admin User</p>
          <p className='text-xs text-muted-foreground'>admin@example.com</p>
        </div>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
