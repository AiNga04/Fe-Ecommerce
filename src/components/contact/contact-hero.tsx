'use client'

import { motion } from 'framer-motion'

export function ContactHero() {
  return (
    <section className='relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-950 to-black'>
      {/* Subtle Background Pattern/Effect */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]' />
      </div>

      <div className='container mx-auto max-w-10xl px-4 relative z-10 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='space-y-4'
        >
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white'>
            Liên Hệ Cùng <span className='text-orange-400'>Zyna</span>
          </h1>
          <p className='text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto tracking-wide'>
            Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng phong cách của bạn.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
