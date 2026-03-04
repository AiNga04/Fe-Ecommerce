'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactItems = [
  {
    icon: MapPin,
    title: 'Địa Chỉ',
    content: (
      <>
        Vincom Center, Quận 1 <br />
        TP. Hồ Chí Minh, Việt Nam
      </>
    ),
    delay: 0.1,
  },
  {
    icon: [Phone, Mail],
    title: 'Liên Hệ Nhanh',
    content: (
      <>
        0909 123 456 <br />
        support@zyna.vn
      </>
    ),
    delay: 0.2,
  },
  {
    icon: Clock,
    title: 'Giờ Hoạt Động',
    content: (
      <>
        Thứ 2 – Thứ 7 <br />
        09:00 – 21:00
      </>
    ),
    delay: 0.3,
  },
]

export function ContactInfo() {
  return (
    <section className='relative z-20 -mt-20'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {contactItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: item.delay }}
              whileHover={{ scale: 1.05 }}
              className='bg-white p-8 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-xl'
            >
              <div className='w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors'>
                {Array.isArray(item.icon) ? (
                  <div className='flex gap-1'>
                    {(() => {
                      const Icon1 = item.icon[0]
                      const Icon2 = item.icon[1]
                      return (
                        <>
                          <Icon1 className='w-5 h-5' />
                          <Icon2 className='w-5 h-5' />
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <item.icon className='w-6 h-6' />
                )}
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-3'>{item.title}</h3>
              <div className='text-slate-500 leading-relaxed font-normal'>{item.content}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
