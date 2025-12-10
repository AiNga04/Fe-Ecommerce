import { AuthGuard } from '@/components/auth/auth-guard'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='min-h-screen'>
      <AuthGuard>{children}</AuthGuard>
    </main>
  )
}
