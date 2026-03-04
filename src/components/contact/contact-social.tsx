'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.83 4.83 0 0 1-1-.15z' />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='24' cy='24' r='24' fill='#1877F2' />
    <path
      d='M33.12 30.94l.93-6.09h-5.84v-3.95c0-1.67.81-3.29 3.43-3.29h2.66v-5.18s-2.41-.41-4.72-.41c-4.81 0-7.96 2.92-7.96 8.2v4.63h-5.35v6.09h5.35V47.7a21.14 21.14 0 006.58 0V30.94h4.92z'
      fill='#fff'
    />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <radialGradient id='ig1' cx='20%' cy='100%' r='130%'>
        <stop offset='0%' stopColor='#fdf497' />
        <stop offset='5%' stopColor='#fdf497' />
        <stop offset='45%' stopColor='#fd5949' />
        <stop offset='60%' stopColor='#d6249f' />
        <stop offset='90%' stopColor='#285AEB' />
      </radialGradient>
    </defs>
    <rect width='48' height='48' rx='12' fill='url(#ig1)' />
    <path
      d='M24 14.4c-3.1 0-3.49.01-4.71.07-1.21.06-2.04.25-2.77.53a5.56 5.56 0 00-2.02 1.31 5.56 5.56 0 00-1.31 2.02c-.28.73-.47 1.56-.53 2.77-.06 1.22-.07 1.61-.07 4.71s.01 3.49.07 4.71c.06 1.21.25 2.04.53 2.77.29.75.68 1.39 1.31 2.02a5.56 5.56 0 002.02 1.31c.73.28 1.56.47 2.77.53 1.22.06 1.61.07 4.71.07s3.49-.01 4.71-.07c1.21-.06 2.04-.25 2.77-.53a5.56 5.56 0 002.02-1.31 5.56 5.56 0 001.31-2.02c.28-.73.47-1.56.53-2.77.06-1.22.07-1.61.07-4.71s-.01-3.49-.07-4.71c-.06-1.21-.25-2.04-.53-2.77a5.56 5.56 0 00-1.31-2.02 5.56 5.56 0 00-2.02-1.31c-.73-.28-1.56-.47-2.77-.53-1.22-.06-1.61-.07-4.71-.07zm0 1.73c3.05 0 3.41.01 4.61.07 1.11.05 1.72.24 2.12.39.53.21.91.45 1.31.85.4.4.64.78.85 1.31.15.4.34 1.01.39 2.12.06 1.2.07 1.56.07 4.61s-.01 3.41-.07 4.61c-.05 1.11-.24 1.72-.39 2.12-.21.53-.45.91-.85 1.31-.4.4-.78.64-1.31.85-.4.15-1.01.34-2.12.39-1.2.06-1.56.07-4.61.07s-3.41-.01-4.61-.07c-1.11-.05-1.72-.24-2.12-.39a3.53 3.53 0 01-1.31-.85 3.53 3.53 0 01-.85-1.31c-.15-.4-.34-1.01-.39-2.12-.06-1.2-.07-1.56-.07-4.61s.01-3.41.07-4.61c.05-1.11.24-1.72.39-2.12.21-.53.45-.91.85-1.31.4-.4.78-.64 1.31-.85.4-.15 1.01-.34 2.12-.39 1.2-.06 1.56-.07 4.61-.07z'
      fill='#fff'
    />
    <path
      d='M24 28.94a4.94 4.94 0 110-9.88 4.94 4.94 0 010 9.88zm0-12.55a7.61 7.61 0 100 15.22 7.61 7.61 0 000-15.22zm9.7-.3a1.78 1.78 0 11-3.56 0 1.78 1.78 0 013.56 0z'
      fill='#fff'
    />
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect width='48' height='48' rx='8' fill='#0A66C2' />
    <path
      d='M17.34 19.61h-3.57v11.47h3.57V19.61zm-1.79-5.69a2.07 2.07 0 100 4.14 2.07 2.07 0 000-4.14zm14.04 5.38c-1.88 0-3.06.87-3.56 1.87h-.05v-1.56h-3.42v11.47h3.56v-5.67c0-1.5.28-2.94 2.13-2.94 1.83 0 1.85 1.71 1.85 3.04v5.57h3.57v-6.27c0-3.08-.66-5.51-4.08-5.51z'
      fill='#fff'
    />
  </svg>
)

const socials = [
  {
    icon: FacebookIcon,
    href: 'https://www.facebook.com/truong.ai.nga.2025/',
    label: 'Facebook',
    labelColor: 'text-[#1877F2]',
    desc: 'Kết nối và tương tác cùng Zyna trên Facebook!',
  },
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/ainga_76',
    label: 'Instagram',
    labelColor: 'text-[#E4405F]',
    desc: 'Theo dõi các cập nhật mới nhất và kết nối qua Instagram!',
  },
  {
    icon: LinkedInIcon,
    href: 'https://www.linkedin.com/in/nga-tr%C6%B0%C6%A1ng-bb62202ab/',
    label: 'LinkedIn',
    labelColor: 'text-[#0A66C2]',
    desc: 'Kết nối chuyên nghiệp cùng Zyna trên LinkedIn!',
  },
  {
    icon: TikTokIcon,
    href: 'https://www.tiktok.com/@zyna2k4',
    label: 'TikTok',
    labelColor: 'text-slate-900',
    desc: 'Xem hậu trường và mẹo phong cách trên TikTok!',
    isTikTok: true,
  },
]

export function ContactSocial() {
  return (
    <section className='py-24 relative overflow-hidden'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: "url('/images/social-bg.png')" }}
      />
      {/* White overlay for readability */}
      <div className='absolute inset-0 bg-white/85' />

      <div className='container mx-auto max-w-10xl px-4 md:px-6 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center space-y-4 mb-16'
        >
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold italic tracking-tight text-slate-900'>
            Kết nối với <span className='text-orange-600'>Zyna</span> qua mạng xã hội
          </h2>
          <div className='h-1 w-20 bg-orange-500 mx-auto rounded-full' />
        </motion.div>

        {/* Social Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {socials.map((social, index) => (
            <motion.div
              key={social.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6 }}
              className='group'
            >
              <Link
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'
              >
                {/* Icon Area */}
                <div className='flex flex-col items-center pt-12 pb-8 px-8'>
                  <div className='w-28 h-28 mb-6 group-hover:scale-110 transition-transform duration-300'>
                    {'isTikTok' in social && social.isTikTok ? (
                      <div className='w-28 h-28 bg-slate-900 rounded-2xl flex items-center justify-center'>
                        <TikTokIcon className='w-16 h-16 text-white' />
                      </div>
                    ) : (
                      <social.icon className='w-28 h-28' />
                    )}
                  </div>
                  <h3 className={`text-2xl font-bold ${social.labelColor}`}>{social.label}</h3>
                </div>

                {/* Description Area */}
                <div className='bg-slate-50 border-t border-slate-100 px-8 py-5'>
                  <p className='text-base text-slate-500 text-center leading-relaxed'>
                    {social.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
