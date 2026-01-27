import { AuthGuard } from '@/components/auth/auth-guard'
import { Header } from '@/components/common/header'
import { Footer } from '@/components/common/footer'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='min-h-screen'>
      <Header />
      <AuthGuard>{children}</AuthGuard>
      <Footer />
    </main>
  )
}
