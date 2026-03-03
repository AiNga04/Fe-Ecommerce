'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { StaffSidebar } from './staff-sidebar'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { getImageUrl } from '@/lib/utils'

/**
 * Header cho khu vực Staff
 * @description Hiển thị Navbar trên cùng, chứa nút mở menu (mobile) và thông tin user đang đăng nhập
 */
export function StaffHeader() {
  const [open, setOpen] = useState(false)

  const { data: userResponse } = useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const user = userResponse?.data?.data

  return (
    <header className='h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10'>
      <div className='flex items-center gap-4'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>

          <SheetContent side='left' className='p-0 w-72 border-r-0 bg-slate-900 text-slate-100'>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
            <StaffSidebar
              className='border-none'
              onNavigate={() => setOpen(false)}
              forceExpanded={true}
            />
          </SheetContent>
        </Sheet>
        <div className='font-medium text-sm text-muted-foreground hidden md:block'>
          Khu vực nhân viên
        </div>
        <div className='font-medium text-sm text-muted-foreground md:hidden'>Staff</div>
      </div>

      <div className='flex items-center gap-4'>
        {user ? (
          <>
            <div className='text-right hidden md:block'>
              <p className='text-sm font-medium'>
                {user.lastName} {user.firstName}
              </p>
              <p className='text-xs text-muted-foreground'>{user.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={getImageUrl(user.avatarUrl)} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </>
        ) : (
          <div className='h-8 w-8 rounded-full bg-slate-100 animate-pulse' />
        )}
      </div>
    </header>
  )
}
