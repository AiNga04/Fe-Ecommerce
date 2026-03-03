'use client'

import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { ShipperSidebar } from '@/components/shipper/shipper-sidebar'
import { ShipperHeader } from '@/components/shipper/shipper-header'
import { useSidebarStore } from '@/store/use-sidebar-store'
import { cn } from '@/lib/utils'

export default function ShipperLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore()

  return (
    <RoleGuard allowedRoles={[Role.SHIPPER]}>
      <div className='flex min-h-screen bg-slate-50/50 uppercase-none'>
        {/* Desktop Sidebar */}
        <div className='hidden md:block h-screen sticky top-0'>
          <ShipperSidebar />
        </div>

        <div className='flex-1 flex flex-col min-w-0'>
          <ShipperHeader />
          <main
            className={cn(
              'flex-1 p-4 lg:p-8 overflow-x-hidden transition-all duration-300',
              // Add any specific main area adjustments if needed
            )}
          >
            <div className='w-full mx-auto'>{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
