'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ClipboardList,
  Users,
  Ticket,
  Star,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  {
    label: 'Bảng điều khiển',
    icon: LayoutDashboard,
    href: '/staff/dashboard',
    permission: 'DASHBOARD_READ',
  },
  { label: 'Đơn hàng', icon: ShoppingBag, href: '/staff/orders', permission: 'ORDER_READ' },
  { label: 'Sản phẩm', icon: Package, href: '/staff/products', permission: 'PRODUCT_READ' },
  {
    label: 'Kho hàng',
    icon: ClipboardList,
    href: '/staff/inventory',
    permission: 'INVENTORY_READ',
  },
  { label: 'Người dùng', icon: Users, href: '/staff/users', permission: 'USER_READ' },
  { label: 'Khuyến mãi', icon: Ticket, href: '/staff/vouchers', permission: 'VOUCHER_READ' },
  { label: 'Đánh giá', icon: Star, href: '/staff/reviews', permission: 'REVIEW_MANAGE' },
  { label: 'Hỗ trợ', icon: MessageSquare, href: '/staff/support', permission: 'SUPPORT_READ' },
]

export function StaffSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-slate-900 text-slate-300 transition-all duration-300 z-50 sticky top-0',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-slate-800 h-16'>
        {!isCollapsed && (
          <div className='flex items-center gap-2 px-2'>
            <div className='w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>Z</span>
            </div>
            <span className='font-bold text-white tracking-wider'>ZYNA STAFF</span>
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          className='p-1 hover:text-white hover:bg-slate-800'
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className='w-5 h-5' /> : <ChevronLeft className='w-5 h-5' />}
        </Button>
      </div>

      {/* Nav Items */}
      <nav className='flex-1 overflow-y-auto py-4 space-y-1 px-3'>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-slate-800 hover:text-white',
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 shrink-0',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400',
                )}
              />
              {!isCollapsed && <span className='text-sm font-medium'>{item.label}</span>}
              {isCollapsed && (
                <div className='absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50'>
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className='p-4 border-t border-slate-800 flex flex-col gap-2'>
        <Button
          variant='ghost'
          className={cn(
            'flex items-center gap-3 w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 px-3',
            isCollapsed && 'justify-center p-2',
          )}
          onClick={() => (window.location.href = '/')}
        >
          <LogOut className='w-5 h-5' />
          {!isCollapsed && <span className='text-sm font-medium'>Quay lại Web</span>}
        </Button>
      </div>
    </aside>
  )
}
