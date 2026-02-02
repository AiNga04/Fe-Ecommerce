import { AuthGuard } from '@/components/auth/auth-guard'

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthGuard>{children}</AuthGuard>
}
