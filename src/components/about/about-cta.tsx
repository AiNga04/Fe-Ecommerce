'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export function AboutCTA() {
  return (
    <section className='py-24 relative overflow-hidden'>
      {/* Background with decorative elements */}
      <div className='absolute inset-0 bg-slate-950 z-0' />
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2' />
      <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2' />

      <div className='container mx-auto max-w-10xl relative z-10 px-4 md:px-6'>
        <div className='max-w-4xl mx-auto text-center space-y-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='space-y-6'
          >
            <h2 className='text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight'>
              Sẵn sàng nâng tầm <br />
              phong cách của bạn?
            </h2>
            <p className='text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed'>
              Khám phá những thiết kế mới nhất và trải nghiệm sự khác biệt từ Zyna Fashion ngay hôm
              nay.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-6'
          >
            <Button
              size='lg'
              className='bg-orange-600 hover:bg-orange-700 text-white min-w-[220px] h-16 text-lg font-bold rounded-full shadow-lg shadow-orange-900/20 group transition-all'
              asChild
            >
              <Link href='/products' className='flex items-center gap-2'>
                <ShoppingBag className='w-5 h-5 group-hover:scale-110 transition-transform' />
                Mua sắm ngay
              </Link>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='border border-white/70 bg-transparent min-w-[220px] h-16 text-lg font-semibold rounded-full backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900'
              asChild
            >
              <Link
                href='/contact'
                className='group flex items-center justify-center gap-2 text-white'
              >
                Tham gia cộng đồng Zyna
                <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className='pt-10 flex flex-wrap justify-center gap-8 items-center border-t border-white/5'
          >
            <div className='text-xs text-white/40 uppercase tracking-[0.2em] font-medium italic'>
              Premium Vietnamese Brand
            </div>
            <div className='w-1 h-1 bg-white/20 rounded-full' />
            <div className='text-xs text-white/40 uppercase tracking-[0.2em] font-medium italic'>
              Since 2026
            </div>
            <div className='w-1 h-1 bg-white/20 rounded-full' />
            <div className='text-xs text-white/40 uppercase tracking-[0.2em] font-medium italic'>
              Handcrafted with Love
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
