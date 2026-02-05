import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.STAFF]}>
      <div className='min-h-screen bg-blue-50'>
        <nav className='bg-blue-800 text-white p-4'>
          <div className='container mx-auto flex justify-between items-center'>
            <span className='font-bold text-xl'>ZYNA STAFF</span>
            <span className='text-sm opacity-70'>Staff Portal</span>
          </div>
        </nav>
        <main className='container mx-auto'>{children}</main>
      </div>
    </RoleGuard>
  )
}
