import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className='min-h-screen bg-slate-50'>
        <nav className='bg-slate-900 text-white p-4'>
          <div className='container mx-auto flex justify-between items-center'>
            <span className='font-bold text-xl'>ZYNA ADMIN</span>
            <span className='text-sm opacity-70'>Administrator Access</span>
          </div>
        </nav>
        <main className='container mx-auto'>{children}</main>
      </div>
    </RoleGuard>
  )
}
