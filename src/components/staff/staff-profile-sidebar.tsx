'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Camera, Settings, User as UserIcon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { User } from '@/types/user'
import { cn } from '@/lib/utils'
import { authService } from '@/services/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

interface StaffProfileSidebarProps {
  user: User | null
  activeTab?: string
  onAvatarUpload: (file: File) => void
  isUploading: boolean
}

export function StaffProfileSidebar({
  user,
  activeTab = 'account',
  onAvatarUpload,
  isUploading,
}: StaffProfileSidebarProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = async () => {
    try {
      await authService.logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/auth/login')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarUpload(file)
    }
  }

  const menuItems = [
    {
      id: 'account',
      label: 'HỒ SƠ NHÂN VIÊN',
      icon: UserIcon,
      href: '/staff/profile',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'logout',
      label: 'ĐĂNG XUẤT',
      icon: LogOut,
      href: '#',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ]

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Staff'

  const avatarSrc = user?.avatarUrl
    ? user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8080'}${user.avatarUrl.startsWith('/') ? '' : '/'}${user.avatarUrl}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`

  return (
    <div className='space-y-6'>
      <div className='flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100'>
        <div className='relative group'>
          <div className='w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative'>
            <Image src={avatarSrc} alt={displayName} fill className='object-cover' unoptimized />
          </div>

          <button
            className='absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md z-10'
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className='w-4 h-4' />
          </button>
          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>

        <h2 className='mt-4 text-xl font-bold text-gray-900'>{displayName}</h2>
        <div className='mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200'>
          Staff Member
        </div>
        {isUploading && <p className='text-xs text-blue-500 mt-2'>Đang tải lên...</p>}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          if (item.id === 'logout') {
            return (
              <button
                key={item.id}
                onClick={handleLogout}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md aspect-square text-center gap-3',
                  `border-transparent ${item.bgColor} hover:border-gray-200`,
                )}
              >
                <div className={cn('p-3 rounded-full bg-white shadow-sm', item.color)}>
                  <Icon className='w-6 h-6' />
                </div>
                <span className='text-[10px] font-bold tracking-wider text-gray-700 uppercase'>
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md aspect-square text-center gap-3',
                isActive
                  ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-100'
                  : `border-transparent ${item.bgColor} hover:border-gray-200`,
              )}
            >
              <div className={cn('p-3 rounded-full bg-white shadow-sm', item.color)}>
                <Icon className='w-6 h-6' />
              </div>
              <span className='text-[10px] font-bold tracking-wider text-gray-700 uppercase'>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Hủy
              </Button>
            </DialogClose>
            <Button type='button' variant='destructive' onClick={confirmLogout}>
              Đăng xuất
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
