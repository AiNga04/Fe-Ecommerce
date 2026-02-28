'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

interface StaticPageLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  lastUpdated?: string
}

export function StaticPageLayout({
  title,
  subtitle,
  children,
  lastUpdated,
}: StaticPageLayoutProps) {
  return (
    <div className='bg-white min-h-screen pb-20'>
      {/* Hero Header */}
      <section className='bg-slate-900 py-24 text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070")] opacity-10 bg-cover bg-center' />
        <div className='container max-w-5xl mx-auto px-4 relative z-10 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-4xl md:text-5xl font-bold mb-6 tracking-tight'>{title}</h1>
            {subtitle && (
              <p className='text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto'>
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className='container max-w-4xl mx-auto px-4 -mt-10 relative z-20'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100'
        >
          <div className='prose prose-slate max-w-none'>{children}</div>

          {lastUpdated && (
            <div className='mt-16'>
              <Separator className='mb-6 bg-slate-100' />
              <p className='text-sm text-slate-400 font-medium italic text-right'>
                Cập nhật lần cuối: {lastUpdated}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
