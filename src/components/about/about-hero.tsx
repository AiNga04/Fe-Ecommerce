'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function AboutHero() {
  return (
    <section className='relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/about/hero.avif'
          alt='Zyna Fashion Hero'
          fill
          className='opacity-70'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60' />
      </div>

      {/* Content */}
      <div className='container mx-auto max-w-10xl relative z-10 px-4 md:px-6 text-center'>
        <div className='max-w-3xl mx-auto space-y-6'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white'
          >
            Câu Chuyện Của <span className='text-orange-400'>Zyna Fashion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className='text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed'
          >
            Thời trang không chỉ để mặc – đó là cách bạn thể hiện bản thân. Tại Zyna, chúng tôi kiến
            tạo phong cách từ sự tối giản và tinh tế.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'
          >
            <Button
              size='lg'
              className='bg-white text-black hover:bg-slate-100 min-w-[200px] h-14 text-base font-semibold rounded-full group transition-all'
              asChild
            >
              <Link href='/products' className='flex items-center gap-2'>
                Khám phá bộ sưu tập
                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </Link>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 min-w-[200px] h-14 text-base rounded-full backdrop-blur-sm'
              asChild
            >
              <Link href='/contact'>Liên hệ với chúng tôi</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className='absolute bottom-10 left-1/2 -translate-x-1/2'
      >
        <div className='w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1'>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className='w-1.5 h-1.5 bg-white rounded-full'
          />
        </div>
      </motion.div>
    </section>
  )
}
