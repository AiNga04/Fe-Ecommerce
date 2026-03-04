'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Sản phẩm có được đổi trả không?',
    answer:
      'Zyna Fashion hỗ trợ đổi hàng trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác, chưa qua sử dụng và giặt là.',
  },
  {
    question: 'Thời gian giao hàng bao lâu?',
    answer:
      'Thời gian giao hàng dự kiến từ 2-4 ngày làm việc đối với khu vực trung tâm và 3-7 ngày làm việc đối với các khu vực khác trên toàn quốc.',
  },
  {
    question: 'Tôi có thể đến cửa hàng trực tiếp không?',
    answer:
      'Hiện tại Zyna tập trung phát triển hệ thống showroom tại các trung tâm thương mại lớn như Vincom Center. Bạn có thể ghé thăm cửa hàng của chúng tôi để trải nghiệm sản phẩm trực tiếp.',
  },
  {
    question: 'Hỗ trợ thanh toán COD không?',
    answer:
      'Chúng tôi hỗ trợ đa dạng hình thức thanh toán bao gồm: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng, và Thanh toán qua thẻ tín dụng/ví điện tử.',
  },
]

export function ContactFAQ() {
  return (
    <section className='py-24 bg-slate-50 overflow-hidden'>
      <div className='container mx-auto max-w-10xl px-4 md:px-6'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='space-y-6'
          >
            <div className='inline-block px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-2'>
              Giải đáp thắc mắc
            </div>
            <h2 className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight'>
              Câu hỏi thường gặp <br />
              <span className='text-slate-400 font-light italic'>về Zyna Fashion</span>
            </h2>
            <p className='text-lg text-slate-500 font-light max-w-md'>
              Những thông tin cơ bản giúp bạn hiểu rõ hơn về quy trình phục vụ và cam kết của chúng
              tôi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Accordion type='single' collapsible className='w-full space-y-4'>
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className='bg-white border-none rounded-2xl px-6 shadow-sm overflow-hidden'
                >
                  <AccordionTrigger className='text-left text-lg font-bold py-6 hover:no-underline hover:text-orange-600 transition-colors'>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className='text-slate-500 text-base leading-relaxed pb-6'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
