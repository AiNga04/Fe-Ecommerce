'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, Twitter, Chrome } from 'lucide-react'
import Link from 'next/link'

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: Chrome, href: '#', label: 'TikTok', color: 'hover:text-black' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
]

export function ContactSocial() {
  return (
    <section className='py-24 bg-white border-t border-slate-50'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6 text-center space-y-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='space-y-4'
        >
          <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-slate-900'>
            Theo dõi <span className='text-orange-600'>Zyna</span> để cập nhật bộ sưu tập mới nhất
          </h2>
          <div className='h-1 w-20 bg-orange-500 mx-auto rounded-full' />
        </motion.div>

        <div className='flex flex-wrap justify-center gap-8'>
          {socials.map((social, index) => (
            <motion.div
              key={social.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={social.href}
                className={`flex flex-col items-center gap-3 text-slate-400 ${social.color} transition-all duration-300 group`}
              >
                <div className='p-5 rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-transparent transition-all'>
                  <social.icon className='w-8 h-8' />
                </div>
                <span className='text-xs font-bold uppercase tracking-widest'>{social.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
