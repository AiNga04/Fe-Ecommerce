'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Đơn hàng',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Người dùng',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
  },
]

import { useRouter } from 'next/navigation'
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

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed', error)
      // Force redirect even if API fails
      router.push('/auth/login')
    }
  }

  return (
    <div className={cn('flex flex-col h-full border-r bg-slate-900 text-slate-100', className)}>
      <div className='p-6'>
        <h1 className='text-2xl font-bold tracking-tight text-white'>ZYNA ADMIN</h1>
      </div>
      <nav className='flex-1 px-4 space-y-2'>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800',
              )}
            >
              <item.icon className='h-5 w-5' />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className='p-4 border-t border-slate-800'>
        <div className='p-4 border-t border-slate-800'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors w-full text-left'>
                <LogOut className='h-5 w-5' />
                Đăng xuất
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn sẽ cần đăng nhập lại để truy cập vào hệ thống quản trị.
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
    </div>
  )
}
