import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className='flex h-screen bg-slate-50'>
        {/* Sidebar */}
        <aside className='hidden md:block w-64 h-full fixed inset-y-0 left-0 z-50'>
          <AdminSidebar />
        </aside>

        {/* Main Content */}
        <div className='flex-1 flex flex-col md:pl-64 h-screen overflow-hidden'>
          <AdminHeader />
          <main className='flex-1 overflow-auto p-6 md:p-8'>{children}</main>
        </div>
      </div>
    </RoleGuard>
  )
}
