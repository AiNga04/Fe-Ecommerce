import Image from 'next/image'

import loginHero from '@/assets/images/login-hero.png'

export function RegisterHero() {
  return (
    <div className='hidden lg:flex flex-1 items-center justify-center relative overflow-hidden'>
      <div className='w-full max-w-md space-y-4'>
        <div className='space-y-2'>
          <h1 className='text-4xl font-bold tracking-tight'>Create an account</h1>
          <p className='text-lg text-muted-foreground'>Let&apos;s create your account</p>
        </div>
        <Image src={loginHero} alt='Register illustration' className='w-full h-auto' priority />
      </div>
    </div>
  )
}
