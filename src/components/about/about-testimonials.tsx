'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Nguyễn Thanh Hằng',
    role: 'Nhà thiết kế nội thất',
    content:
      'Chất liệu vải của Zyna thực sự khác biệt, mặc rất thoải mái và giữ phom tốt. Phong cách tối giản nhưng cực kỳ sang trọng.',
    avatar: 'TH',
    rating: 5,
  },
  {
    name: 'Lê Minh Quân',
    role: 'Giám đốc sáng tạo',
    content:
      'Dịch vụ của Zyna rất chuyên nghiệp. Tôi ấn tượng với cách đóng gói sản phẩm, tinh tế và trân trọng khách hàng.',
    avatar: 'MQ',
    rating: 5,
  },
  {
    name: 'Trần Thu Thủy',
    role: 'Fashion Blogger',
    content:
      'Zyna Fashion là lựa chọn hàng đầu của tôi cho những bộ trang phục công sở hiện đại. Một thương hiệu Việt đầy triển vọng.',
    avatar: 'TT',
    rating: 5,
  },
]

export function AboutTestimonials() {
  return (
    <section className='py-24 bg-slate-50'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2'
          >
            Đánh giá từ khách hàng
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
          >
            Khách hàng nói gì về chúng tôi
          </motion.h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300'
            >
              <Quote className='absolute top-8 right-8 w-10 h-10 text-slate-50 group-hover:text-orange-50 transition-colors' />

              <div className='flex gap-1 mb-6'>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className='w-4 h-4 fill-orange-400 text-orange-400' />
                ))}
              </div>

              <p className='text-slate-600 mb-8 leading-relaxed italic relative z-10'>
                "{t.content}"
              </p>

              <div className='flex items-center gap-4 pt-6 border-t border-slate-50'>
                <Avatar className='h-12 w-12 border-2 border-white shadow-md'>
                  <AvatarFallback className='bg-orange-50 text-orange-700 font-bold'>
                    {t.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className='font-bold text-slate-900 leading-none mb-1'>{t.name}</h4>
                  <p className='text-xs text-slate-400'>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
