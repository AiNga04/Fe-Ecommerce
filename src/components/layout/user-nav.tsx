'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getImageUrl } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function UserNav() {
  const router = useRouter()
  const { data: userResponse } = useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 5,
  })

  const user = userResponse?.data?.data

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Đăng xuất thành công')
      router.push('/login')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất')
    }
  }

  if (!user) {
    return <div className='h-8 w-8 rounded-full bg-slate-100 animate-pulse' />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-10 w-10 rounded-full p-0 overflow-hidden border border-slate-200'
        >
          <Avatar className='h-10 w-10'>
            <AvatarImage src={getImageUrl(user.avatarUrl)} alt={user.firstName} />
            <AvatarFallback className='bg-blue-50 text-blue-600 font-bold'>
              {user.firstName ? user.firstName.substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user.lastName} {user.firstName}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <User className='mr-2 h-4 w-4' />
            <span>Hồ sơ</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className='mr-2 h-4 w-4' />
            <span>Cài đặt</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='text-rose-600 focus:text-rose-600' onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
