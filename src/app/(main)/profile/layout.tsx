import { Role } from '@/constants/enum/role'
import { RoleGuard } from '@/components/auth/role-guard'

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RoleGuard allowedRoles={[Role.USER]}>{children}</RoleGuard>
}
