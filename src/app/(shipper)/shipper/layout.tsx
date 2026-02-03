import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'

export default function ShipperLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.SHIPPER, Role.ADMIN]}>
      <div className='min-h-screen bg-orange-50'>
        <nav className='bg-orange-700 text-white p-4'>
          <div className='container mx-auto flex justify-between items-center'>
            <span className='font-bold text-xl'>ZYNA SHIPPER</span>
            <span className='text-sm opacity-70'>Delivery Partner</span>
          </div>
        </nav>
        <main className='container mx-auto'>{children}</main>
      </div>
    </RoleGuard>
  )
}
