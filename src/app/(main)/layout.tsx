import { AuthGuard } from '@/components/auth/auth-guard'
import { Header } from '@/components/common/header'
import { Footer } from '@/components/common/footer'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <AuthGuard>{children}</AuthGuard>
      </main>
      <Footer />
    </div>
  )
}
