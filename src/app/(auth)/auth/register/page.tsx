import { Header } from '@/components/common/header'
import { Footer } from '@/components/common/footer'
import { RegisterForm } from '@/components/auth/register-form'
import { RegisterHero } from '@/components/auth/register-hero'
import Link from 'next/link'
import Routers from '@/constants/routers'

const Register = () => {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Header />
      {/* Main Content */}
      <main className='max-w-7xl mx-auto w-full px-4 py-12'>
        {/* Back Button */}
        <Link
          href={Routers.LOGIN}
          className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8 w-fit'
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

        {/* Register Section */}
        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          <RegisterHero />
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Register
