'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { getImageUrl } from '@/lib/utils'

/**
 * Header cho khu vực Admin
 * @description Hiển thị Navbar trên cùng, chứa nút mở menu (mobile) và thông tin user đang đăng nhập
 */
export function AdminHeader() {
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
            <AdminSidebar
              className='border-none'
              onNavigate={() => setOpen(false)}
              forceExpanded={true}
            />
          </SheetContent>
        </Sheet>
        <div className='font-medium text-sm text-muted-foreground hidden md:block'>
          Khu vực quản trị
        </div>
        <div className='font-medium text-sm text-muted-foreground md:hidden'>Admin</div>
      </div>

      <div className='flex items-center gap-4'>
        {user ? (
          <Link
            href='/admin/profile'
            className='flex items-center gap-3 hover:bg-slate-50 p-1 rounded-lg transition-colors group'
          >
            <div className='text-right hidden md:block'>
              <p className='text-sm font-medium group-hover:text-purple-600 transition-colors'>
                {user.lastName} {user.firstName}
              </p>
              <p className='text-xs text-muted-foreground'>{user.email}</p>
            </div>
            <Avatar className='group-hover:ring-2 group-hover:ring-purple-100 transition-all'>
              <AvatarImage src={getImageUrl(user.avatarUrl)} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <div className='h-8 w-8 rounded-full bg-slate-100 animate-pulse' />
        )}
      </div>
    </header>
  )
}
