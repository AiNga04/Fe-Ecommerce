import { AuthGuard } from '@/components/auth/auth-guard'

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthGuard>{children}</AuthGuard>
}
