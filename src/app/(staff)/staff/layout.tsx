import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { StaffSidebar } from '@/components/staff/staff-sidebar'
import { UserNav } from '@/components/layout/user-nav'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.STAFF, Role.ADMIN]}>
      <div className='flex min-h-screen bg-slate-50/50'>
        <StaffSidebar />
        <div className='flex-1 flex flex-col min-w-0'>
          <header className='h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-6 flex items-center justify-between'>
            <div className='flex items-center gap-4 lg:hidden'>
              {/* Mobile menu toggle would go here */}
              <span className='font-bold text-blue-800 text-lg'>ZYNA STAFF</span>
            </div>
            <div className='flex-1' />
            <div className='flex items-center gap-4'>
              <div className='hidden md:flex flex-col items-right text-right mr-2'>
                <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                  Nhân viên
                </span>
                <span className='text-xs text-slate-400'>Hệ thống quản trị Zyna</span>
              </div>
              <UserNav />
            </div>
          </header>
          <main className='flex-1 overflow-y-auto bg-slate-50/50'>{children}</main>
        </div>
      </div>
    </RoleGuard>
  )
}
