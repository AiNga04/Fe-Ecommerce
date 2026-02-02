import { AuthGuard } from '@/components/auth/auth-guard'

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthGuard>{children}</AuthGuard>
}
