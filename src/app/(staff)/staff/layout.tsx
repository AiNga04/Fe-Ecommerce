import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'
import { StaffLayoutContent } from '@/components/staff/staff-layout-content'

/**
 * Layout bảo vệ cho toàn bộ khu vực Staff
 * @description Bao bọc các trang con bằng RoleGuard để đảm bảo chỉ user có role STAFF/ADMIN mới được truy cập
 * @param children Nội dung trang con (các module nhân viên)
 */
export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.STAFF, Role.ADMIN]}>
      <StaffLayoutContent>{children}</StaffLayoutContent>
    </RoleGuard>
  )
}
