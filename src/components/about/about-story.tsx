'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function AboutStory() {
  return (
    <section className='py-24 bg-white overflow-hidden'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto lg:mx-0 w-full'
          >
            <Image
              src='/images/about/story.png'
              alt='Our Story Still'
              fill
              className='object-cover hover:scale-105 transition-transform duration-700'
            />
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='space-y-8'
          >
            <div className='space-y-4'>
              <h2 className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight'>
                Hành trình khởi nguồn <br />
                <span className='text-slate-400 font-light italic'>Zyna Fashion</span>
              </h2>
              <div className='h-1 w-20 bg-orange-500 rounded-full' />
            </div>

            <div className='space-y-6 text-slate-600'>
              <p className='text-lg leading-relaxed'>
                Được thành lập vào năm 2026, Zyna Fashion ra đời từ khát vọng mang đến một làn gió
                mới cho thị trường thời trang Việt Nam. Chúng tôi tin rằng, phong cách thật sự không
                nằm ở sự cầu kỳ, mà ở sự tinh tế và tối giản.
              </p>
              <p className='text-lg leading-relaxed font-medium text-slate-800'>
                Mỗi thiết kế tại Zyna là lời cam kết về chất lượng và sự tận tâm. Chúng tôi tập
                trung vào những phom dáng hiện đại, dễ ứng dụng nhưng vẫn mang đậm dấu ấn cá nhân.
              </p>
              <div className='grid grid-cols-2 gap-6 pt-4 border-t border-slate-100'>
                <div>
                  <h4 className='text-2xl font-bold text-slate-900'>2026</h4>
                  <p className='text-sm text-slate-500'>Năm thành lập</p>
                </div>
                <div>
                  <h4 className='text-2xl font-bold text-slate-900'>Việt Nam</h4>
                  <p className='text-sm text-slate-500'>Nguồn gốc thương hiệu</p>
                </div>
              </div>
            </div>

            <div className='bg-slate-50 p-8 rounded-2xl border-l-4 border-orange-500 italic text-slate-700 shadow-sm'>
              "Chúng tôi không chỉ bán quần áo, chúng tôi mang tới những giá trị bền vững và sự tự
              tin cho mỗi khách hàng khi diện trang phục Zyna."
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
