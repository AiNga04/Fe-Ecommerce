'use client'

import { motion } from 'framer-motion'
import { RotateCcw, ShieldCheck, Clock, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const policies = [
  {
    icon: Clock,
    title: 'Thời gian đổi trả',
    content: 'Khách hàng có thể yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Quá thời hạn trên, yêu cầu đổi trả sẽ không được chấp nhận.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: CheckCircle2,
    title: 'Điều kiện đổi trả',
    content: 'Sản phẩm còn nguyên tem mác, chưa qua sử dụng, chưa giặt. Kèm đầy đủ hóa đơn mua hàng hoặc mã đơn hàng.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: XCircle,
    title: 'Không áp dụng đổi trả',
    content: 'Sản phẩm mua trong chương trình sale/khuyến mãi, sản phẩm đã qua sử dụng, giặt tẩy, hoặc bị hư hỏng do lỗi từ phía khách hàng.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: RotateCcw,
    title: 'Quy trình đổi trả',
    content: 'Vào mục "Đơn hàng của tôi" → chọn đơn hàng cần đổi trả → Nhấn "Yêu cầu hoàn hàng" → Nhập lý do → Đợi Admin/Staff xác nhận → Shipper đến lấy hàng.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: ShieldCheck,
    title: 'Hoàn tiền',
    content: 'Sau khi nhận và kiểm tra sản phẩm đổi trả, chúng tôi sẽ hoàn tiền trong vòng 3-5 ngày làm việc qua phương thức thanh toán ban đầu.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export default function PoliciesPage() {
  return (
    <main className='flex flex-col w-full min-h-screen'>
      {/* Hero */}
      <section className='relative w-full py-28 bg-slate-900 overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black' />
        <div className='container mx-auto max-w-10xl relative z-10 px-4 md:px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8'
          >
            <RotateCcw className='w-4 h-4 text-orange-400' />
            <span className='text-sm font-medium text-white'>Chính sách</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6'
          >
            Chính sách <span className='text-orange-400'>đổi trả</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed'
          >
            ZYNA FASHION cam kết mang đến trải nghiệm mua sắm an tâm.
            Tìm hiểu chi tiết chính sách đổi trả hàng hóa.
          </motion.p>
        </div>
      </section>

      {/* Policy Cards */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
            >
              Quy định đổi trả
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='text-lg text-slate-500 font-light'
            >
              Mọi thông tin bạn cần biết về chính sách đổi trả tại ZYNA
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group'
              >
                <div className={`p-4 rounded-2xl ${policy.bg} ${policy.color} mb-6 inline-block group-hover:scale-110 transition-transform`}>
                  <policy.icon className='w-8 h-8' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-3'>{policy.title}</h3>
                <p className='text-slate-500 leading-relaxed text-sm'>{policy.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-24 bg-slate-50'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6 text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl font-bold text-slate-900 mb-4'
          >
            Cần hỗ trợ thêm?
          </motion.h2>
          <p className='text-lg text-slate-500 mb-10 max-w-xl mx-auto font-light'>
            Nếu bạn có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' className='bg-slate-900 hover:bg-black text-white min-w-[200px] h-14 text-base font-semibold rounded-full group' asChild>
              <Link href='/contact' className='flex items-center gap-2'>
                Liên hệ hỗ trợ
                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </Link>
            </Button>
            <Button variant='outline' size='lg' className='border-slate-300 hover:bg-slate-100 min-w-[200px] h-14 text-base rounded-full' asChild>
              <Link href='/faq'>Câu hỏi thường gặp</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
