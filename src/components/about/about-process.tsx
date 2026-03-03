'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Lựa chọn chất liệu',
    description:
      'Chúng tôi tuyển chọn gắt gao các loại vải cao cấp, đảm bảo độ bền, sự mềm mại và thân thiện với làn da.',
  },
  {
    number: '02',
    title: 'Phát triển thiết kế',
    description:
      'Mỗi bản vẽ được tinh chỉnh nhiều lần để đạt được sự cân bằng hoàn hảo giữa tính thẩm mỹ và ứng dụng.',
  },
  {
    number: '03',
    title: 'Sản xuất tinh xảo',
    description:
      'Đội ngũ nghệ nhân lành nghề hiện thực hóa thiết kế với kỹ thuật may tỉ mỉ, chính xác đến từng chi tiết.',
  },
  {
    number: '04',
    title: 'Kiểm soát chất lượng',
    description:
      'Mỗi sản phẩm đều trải qua quy trình kiểm tra 10 bước nghiêm ngặt trước khi đến tay khách hàng.',
  },
  {
    number: '05',
    title: 'Giao hàng tận tâm',
    description:
      'Đóng gói tinh tế và vận chuyển nhanh chóng, mang niềm vui thời trang đến ngưỡng cửa nhà bạn.',
  },
]

export function AboutProcess() {
  return (
    <section className='py-24 bg-white relative overflow-hidden'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='text-center max-w-3xl mx-auto space-y-4 mb-20'>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
          >
            Quy trình sản xuất
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg text-slate-500 font-light italic'
          >
            "Từ sợi vải đầu tiên đến nụ cười của khách hàng."
          </motion.p>
        </div>

        {/* Timeline Desktop */}
        <div className='hidden lg:grid grid-cols-5 gap-0 relative'>
          <div className='absolute top-[39px] left-0 right-0 h-0.5 bg-slate-100 z-0' />
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className='px-6 space-y-6 relative z-10 group'
            >
              <div className='w-20 h-20 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center text-2xl font-bold text-slate-900 shadow-sm mx-auto group-hover:border-orange-200 group-hover:scale-110 transition-all duration-300'>
                {step.number}
                <div className='absolute -inset-2 rounded-full border border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
              <div className='text-center'>
                <h3 className='font-bold text-slate-900 mb-2'>{step.title}</h3>
                <p className='text-xs text-slate-500 leading-relaxed px-2'>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Mobile */}
        <div className='lg:hidden space-y-12'>
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='flex gap-6 items-start'
            >
              <div className='flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200'>
                {step.number}
              </div>
              <div className='space-y-2'>
                <h3 className='text-xl font-bold text-slate-900'>{step.title}</h3>
                <p className='text-sm text-slate-500 leading-relaxed'>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
