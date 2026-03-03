'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
  Archive,
  Ruler,
  Proportions,
  TicketPercent,
  MessageSquare,
  Users,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/store/use-sidebar-store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { authService } from '@/services/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/staff/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Danh mục',
    href: '/staff/categories',
    icon: Layers,
  },
  {
    title: 'Sản phẩm',
    href: '/staff/products',
    icon: Package,
  },
  {
    title: 'Đơn hàng',
    href: '/staff/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Tồn kho',
    href: '/staff/inventory',
    icon: Archive,
  },
  {
    title: 'Bảng Size',
    href: '/staff/size-guides',
    icon: Ruler,
  },
  {
    title: 'Kích thước',
    href: '/staff/sizes',
    icon: Proportions,
  },
  {
    title: 'Mã giảm giá',
    href: '/staff/vouchers',
    icon: TicketPercent,
  },
  {
    title: 'Hỗ trợ',
    href: '/staff/support',
    icon: MessageSquare,
  },
  {
    title: 'Đánh giá',
    href: '/staff/reviews',
    icon: Star,
  },
  {
    title: 'Người dùng',
    href: '/staff/users',
    icon: Users,
  },
  {
    title: 'Hồ sơ',
    href: '/staff/profile',
    icon: Users,
  },
  {
    title: 'Cài đặt',
    href: '/staff/settings',
    icon: Settings,
  },
]

interface StaffSidebarProps {
  className?: string
  onNavigate?: () => void
  forceExpanded?: boolean
}

export function StaffSidebar({ className, onNavigate, forceExpanded = false }: StaffSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed: storeCollapsed, toggleSidebar } = useSidebarStore()

  // If forceExpanded is true, always treat as expanded (not collapsed)
  const isCollapsed = forceExpanded ? false : storeCollapsed

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed', error)
      router.push('/auth/login')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full border-r bg-slate-900 text-slate-100 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        forceExpanded ? 'w-full' : '', // Ensure full width if forced (e.g. in Sheet)
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center h-16 px-4',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && (
          <h1 className='text-xl font-bold tracking-tight text-white whitespace-nowrap'>
            ZYNA <span className='text-blue-500'>STAFF</span>
          </h1>
        )}
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleSidebar}
          className='text-slate-400 hover:text-white hover:bg-slate-800 hidden md:flex'
        >
          {isCollapsed ? <ChevronRight className='h-5 w-5' /> : <ChevronLeft className='h-5 w-5' />}
        </Button>
      </div>

      <nav className='flex-1 px-3 space-y-2 overflow-y-auto py-4'>
        <TooltipProvider delayDuration={0}>
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            const LinkContent = (
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800',
                  isCollapsed && 'justify-center px-0',
                )}
              >
                <item.icon className='h-5 w-5 shrink-0' />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                  <TooltipContent side='right' className='bg-slate-900 text-white border-slate-700'>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{LinkContent}</div>
          })}
        </TooltipProvider>
      </nav>

      <div className='p-4 border-t border-slate-800'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors w-full',
                isCollapsed ? 'justify-center' : 'text-left',
              )}
            >
              <LogOut className='h-5 w-5 shrink-0' />
              {!isCollapsed && <span>Đăng xuất</span>}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn sẽ cần đăng nhập lại để truy cập vào hệ thống dành cho nhân viên.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
