import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { AdminLayoutContent } from '@/components/admin/admin-layout-content'

/**
 * Layout bảo vệ cho toàn bộ khu vực Admin
 * @description Bao bọc các trang con bằng RoleGuard để đảm bảo chỉ user có role ADMIN mới được truy cập
 * @param children Nội dung trang con (các module quản trị)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </RoleGuard>
  )
}
