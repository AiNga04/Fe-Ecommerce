import Image from 'next/image'
import loginHero from '@/assets/images/login-hero.png'

export function RegisterHero() {
  return (
    <div className='hidden lg:flex flex-col items-start justify-center relative pl-8'>
      <div className='space-y-4 mb-8'>
        <h1 className='text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]'>
          Tạo tài khoản
        </h1>
        <p className='text-2xl text-slate-500 font-medium'>Bắt đầu hành trình của bạn</p>
      </div>
      <div className='relative w-full max-w-lg'>
        <Image
          src={loginHero}
          alt='Register illustration'
          className='w-full h-auto object-contain scale-110'
          priority
        />
      </div>
    </div>
  )
}
