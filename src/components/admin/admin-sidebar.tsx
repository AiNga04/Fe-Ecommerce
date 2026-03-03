'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Proportions,
  Ruler,
  Settings,
  ShoppingCart,
  TicketPercent,
  Users,
  MessageSquare,
  Star,
} from 'lucide-react'
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
import { useSidebarStore } from '@/store/use-sidebar-store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: Layers,
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
    title: 'Tồn kho',
    href: '/admin/inventory',
    icon: Archive,
  },
  {
    title: 'Bảng Size',
    href: '/admin/size-guides',
    icon: Ruler,
  },
  {
    title: 'Kích thước',
    href: '/admin/sizes',
    icon: Proportions,
  },
  {
    title: 'Mã giảm giá',
    href: '/admin/vouchers',
    icon: TicketPercent,
  },
  {
    title: 'Hỗ trợ',
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    title: 'Đánh giá',
    href: '/admin/reviews',
    icon: Star,
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

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
  forceExpanded?: boolean
}

/**
 * Sidebar điều hướng cho khu vực Admin
 * @description Hiển thị danh sách các chức năng quản trị, hỗ trợ thu gọn/phóng to và đăng xuất
 * @param {string} className CSS class bổ sung để tùy chỉnh giao diện
 * @param {function} onNavigate Hàm callback chạy khi click vào link điều hướng (dùng cho điện thoại)
 * @param {boolean} forceExpanded Ép buộc Sidebar luôn mở rộng (Ví dụ khi hiển thị trong Drawer/Sheet)
 */
export function AdminSidebar({ className, onNavigate, forceExpanded = false }: AdminSidebarProps) {
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
            ZYNA <span className='text-purple-500'>ADMIN</span>
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
            const isActive = pathname === item.href

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
  )
}
