'use client'

import { StaffSidebar } from '@/components/staff/staff-sidebar'
import { StaffHeader } from '@/components/staff/staff-header'
import { useSidebarStore } from '@/store/use-sidebar-store'
import { cn } from '@/lib/utils'

export function StaffLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore()

  return (
    <div className='fixed inset-0 flex h-screen w-screen bg-slate-50 overflow-hidden'>
      {/* Sidebar */}
      <aside
        className={cn(
          'hidden md:block h-full fixed inset-y-0 left-0 z-50 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
        )}
      >
        <StaffSidebar />
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300',
          isCollapsed ? 'md:pl-20' : 'md:pl-64',
        )}
      >
        <StaffHeader />
        <main className='flex-1 overflow-auto p-6 md:p-8'>{children}</main>
      </div>
    </div>
  )
}
