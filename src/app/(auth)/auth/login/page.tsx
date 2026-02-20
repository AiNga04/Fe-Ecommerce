import { Header } from '@/components/common/header'
import { LoginForm } from '@/components/auth/login-form'
import { LoginHero } from '@/components/auth/login-hero'
import { Footer } from '@/components/common/footer'
import Link from 'next/link'
import Routers from '@/constants/routers'

export default function LoginPage() {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Header />

      {/* Main Content */}
      <main className='flex-1 max-w-10xl mx-auto w-full px-4 py-12'>
        {/* Back Button */}
        <Link
          href={Routers.HOME}
          className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          <span>Trở lại</span>
        </Link>

        {/* Login Section */}
        <div className='flex gap-12 items-center'>
          <LoginHero />
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
