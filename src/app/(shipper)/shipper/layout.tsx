'use client'

import { useState } from 'react'
import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { ShipperSidebar } from '@/components/shipper/shipper-sidebar'
import { ShipperHeader } from '@/components/shipper/shipper-header'

export default function ShipperLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <RoleGuard allowedRoles={[Role.SHIPPER]}>
      <div className='flex min-h-screen bg-gray-50'>
        <ShipperSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className='flex-1 flex flex-col min-w-0'>
          <ShipperHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className='flex-1 p-4 lg:p-8 overflow-x-hidden'>
            <div className='w-full'>{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
