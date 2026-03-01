'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Box, History, User, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/shipper/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Đơn đang giao',
    href: '/shipper/shipments',
    icon: Box,
  },
  {
    title: 'Lịch sử giao hàng',
    href: '/shipper/history',
    icon: History,
  },
  {
    title: 'Hồ sơ',
    href: '/shipper/profile',
    icon: User,
  },
]

interface ShipperSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ShipperSidebar({ isOpen, onClose }: ShipperSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className='fixed inset-0 z-40 bg-black/50 lg:hidden' onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform lg:translate-x-0 lg:static lg:inset-0',
          !isOpen && '-translate-x-full',
        )}
      >
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between h-16 px-6 border-b'>
            <Link href='/shipper/dashboard' className='flex items-center gap-2'>
              <span className='text-xl font-bold text-orange-600'>ZYNA SHIPPER</span>
            </Link>
            <Button variant='ghost' size='icon' className='lg:hidden' onClick={onClose}>
              <ChevronLeft className='w-5 h-5' />
            </Button>
          </div>

          <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                  onClick={() => onClose()}
                >
                  <item.icon
                    className={cn('w-5 h-5', isActive ? 'text-orange-600' : 'text-gray-400')}
                  />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          <div className='p-4 border-t'>
            <div className='flex items-center gap-3 px-3 py-2'>
              <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                <User className='w-4 h-4 text-orange-600' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>Shipper Partner</p>
                <p className='text-xs text-gray-500 truncate'>ZYNA Fashion</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
