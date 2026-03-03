'use client'

import { motion } from 'framer-motion'
import { Gem, Leaf, Heart, ShieldCheck } from 'lucide-react'

const values = [
  {
    icon: Gem,
    title: 'Chất lượng Thượng hạng',
    description:
      'Chúng tôi tỉ mỉ trong từng đường kim mũi chỉ, lựa chọn chất liệu cao cấp nhất để mang lại sự thoải mái tuyệt đối.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Leaf,
    title: 'Phát triển Bền vững',
    description:
      'Cam kết sử dụng quy trình sản xuất thân thiện với môi trường và ưu tiên các chất liệu tự nhiên, bền vững.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Heart,
    title: 'Khách hàng là Tâm điểm',
    description:
      'Sự hài lòng của bạn là tôn chỉ hoạt động. Chúng tôi luôn lắng nghe và cải thiện dịch vụ mỗi ngày.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: ShieldCheck,
    title: 'Minh bạch & Tin cậy',
    description:
      'Xây dựng niềm tin thông qua sự minh bạch trong nguồn gốc xuất xứ và quy trình chăm sóc khách hàng chuyên nghiệp.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export function AboutValues() {
  return (
    <section className='py-24 bg-slate-50'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
          >
            Giá trị cốt lõi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg text-slate-500 font-light'
          >
            Những nguyên tắc định hình nền tảng vững chắc của Zyna Fashion.
          </motion.p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group'
            >
              <div
                className={`p-4 rounded-2xl ${value.bg} ${value.color} mb-6 inline-block group-hover:scale-110 transition-transform`}
              >
                <value.icon className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-3'>{value.title}</h3>
              <p className='text-slate-500 leading-relaxed text-sm'>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
