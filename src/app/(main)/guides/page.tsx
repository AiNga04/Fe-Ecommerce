'use client'

import { motion } from 'framer-motion'
import { BookOpen, Search, ShoppingBag, CreditCard, Truck, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Search,
    title: 'Tìm sản phẩm yêu thích',
    description:
      'Duyệt qua bộ sưu tập hoặc sử dụng thanh tìm kiếm để tìm sản phẩm bạn muốn. Bạn có thể lọc theo danh mục, giá, hoặc đánh giá.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: ShoppingBag,
    title: 'Chọn kích thước & thêm vào giỏ',
    description:
      'Chọn kích thước phù hợp bằng cách tham khảo bảng size. Nhấn "Thêm vào giỏ" để đưa sản phẩm vào giỏ hàng của bạn.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán đơn hàng',
    description:
      'Kiểm tra giỏ hàng, nhập mã giảm giá nếu có, chọn địa chỉ giao hàng và phương thức thanh toán (COD hoặc VNPay).',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: Truck,
    title: 'Giao hàng tận nơi',
    description:
      'Đơn hàng được xác nhận sẽ giao trong 2-5 ngày làm việc. Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi".',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: CheckCircle,
    title: 'Nhận hàng & xác nhận',
    description:
      'Kiểm tra sản phẩm khi nhận. Nếu hài lòng, xác nhận đã nhận hàng. Nếu có vấn đề, yêu cầu đổi trả trong 7 ngày.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

export default function GuidesPage() {
  return (
    <main className='flex flex-col w-full min-h-screen'>
      {/* Hero Section */}
      <section className='relative w-full py-28 bg-slate-900 overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black' />
        <div className='container mx-auto max-w-10xl relative z-10 px-4 md:px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8'
          >
            <BookOpen className='w-4 h-4 text-orange-400' />
            <span className='text-sm font-medium text-white'>Hướng dẫn</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6'
          >
            Hướng dẫn <span className='text-orange-400'>mua hàng</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed'
          >
            Mua sắm tại ZYNA FASHION chỉ với 5 bước đơn giản.
            Trải nghiệm mua sắm dễ dàng, nhanh chóng và an toàn.
          </motion.p>
        </div>
      </section>

      {/* Steps Grid */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
            >
              5 bước đơn giản
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='text-lg text-slate-500 font-light'
            >
              Từ lúc tìm sản phẩm đến khi nhận hàng tận tay
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-center'
              >
                <div className='text-5xl font-bold text-slate-100 mb-4 group-hover:text-slate-200 transition-colors'>
                  0{index + 1}
                </div>
                <div className={`p-4 rounded-2xl ${step.bg} ${step.color} mb-5 inline-block group-hover:scale-110 transition-transform`}>
                  <step.icon className='w-7 h-7' />
                </div>
                <h3 className='text-lg font-bold text-slate-900 mb-3'>{step.title}</h3>
                <p className='text-slate-500 leading-relaxed text-sm'>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 bg-slate-50'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6 text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl font-bold text-slate-900 mb-4'
          >
            Sẵn sàng mua sắm?
          </motion.h2>
          <p className='text-lg text-slate-500 mb-10 max-w-xl mx-auto font-light'>
            Khám phá hàng ngàn sản phẩm thời trang chất lượng cao với giá tốt nhất.
          </p>
          <Button
            size='lg'
            className='bg-slate-900 hover:bg-black text-white min-w-[200px] h-14 text-base font-semibold rounded-full group'
            asChild
          >
            <Link href='/products' className='flex items-center gap-2'>
              Mua sắm ngay
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
