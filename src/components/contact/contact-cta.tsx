'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export function ContactCTA() {
  return (
    <section className='py-24 relative overflow-hidden bg-slate-50'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6 relative z-10'>
        <div className='bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center space-y-10 shadow-2xl overflow-hidden relative group'>
          {/* Decorative Gradient Blobs */}
          <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(255,165,0,0.1),transparent_50%)]' />
          <div className='absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(66,133,244,0.1),transparent_50%)]' />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='space-y-6 relative z-10'
          >
            <h2 className='text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight'>
              Zyna luôn đồng hành cùng <br />
              phong cách của bạn.
            </h2>
            <p className='text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto'>
              Bắt đầu hành trình nâng tầm phong cách cùng Zyna Fashion ngay hôm nay.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10'
          >
            <Button
              size='lg'
              className='bg-orange-600 hover:bg-orange-700 text-white min-w-[220px] h-16 text-lg font-black rounded-full shadow-lg shadow-orange-900/40 group transition-all'
              asChild
            >
              <Link href='/products' className='flex items-center gap-2'>
                <ShoppingBag className='w-5 h-5 group-hover:scale-110 transition-transform' />
                Khám phá bộ sưu tập
              </Link>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='border-white text-white hover:bg-white hover:text-slate-950 min-w-[220px] h-16 text-lg font-black rounded-full backdrop-blur-sm group transition-all'
              asChild
            >
              <Link href='/contact'>
                Tham gia cộng đồng Zyna
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
