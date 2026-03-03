'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, Bell } from 'lucide-react'
import { ShipperSidebar } from './shipper-sidebar'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { getImageUrl } from '@/lib/utils'

/**
 * Header cho khu vực Shipper
 * @description Hiển thị Navbar trên cùng, chứa nút mở menu (mobile) và thông tin user đang đăng nhập
 */
export function ShipperHeader() {
  const [open, setOpen] = useState(false)

  const { data: userResponse } = useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 5,
  })

  const user = userResponse?.data?.data

  return (
    <header className='h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30'>
      <div className='flex items-center gap-4'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>

          <SheetContent side='left' className='p-0 w-72 border-r-0 bg-slate-900 text-slate-100'>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
            <ShipperSidebar
              className='border-none'
              onNavigate={() => setOpen(false)}
              forceExpanded={true}
            />
          </SheetContent>
        </Sheet>
        <div className='font-medium text-sm text-muted-foreground hidden md:block italic'>
          Khu vực giao hàng
        </div>
        <div className='text-sm text-orange-600 md:hidden font-bold italic'>ZYNA SHIPPER</div>
      </div>

      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          className='relative text-slate-500 hover:text-orange-600 hover:bg-orange-50'
        >
          <Bell className='w-5 h-5' />
          <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white' />
        </Button>

        {user ? (
          <Link
            href='/shipper/profile'
            className='flex items-center gap-3 hover:bg-orange-50 p-1.5 rounded-xl transition-colors group'
          >
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors'>
                {user.lastName} {user.firstName}
              </p>
              <span className='text-xs text-slate-400 font-bold'>{user?.email}</span>
            </div>
            <Avatar className='border-2 border-slate-100 h-9 w-9 group-hover:ring-2 group-hover:ring-orange-100 transition-all'>
              <AvatarImage src={getImageUrl(user.avatarUrl)} alt={user.firstName} />
              <AvatarFallback className='bg-orange-100 text-orange-600 font-bold'>
                {user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'S'}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <div className='h-9 w-9 rounded-full bg-slate-100 animate-pulse' />
        )}
      </div>
    </header>
  )
}
