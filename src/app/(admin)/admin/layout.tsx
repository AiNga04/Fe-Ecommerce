import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { AdminLayoutContent } from '@/components/admin/admin-layout-content'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </RoleGuard>
  )
}
