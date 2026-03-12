'use client'

import { motion } from 'framer-motion'
import { Scale, FileText } from 'lucide-react'
import Link from 'next/link'

const termsSections = [
  {
    title: 'Giới thiệu',
    content:
      'Chào mừng bạn đến với ZYNA FASHION. Khi truy cập và sử dụng website của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.',
  },
  {
    title: 'Tài khoản người dùng',
    content:
      'Bạn cần đăng ký tài khoản để mua hàng. Bạn có trách nhiệm bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động dưới tài khoản của mình. ZYNA FASHION có quyền khóa hoặc xóa tài khoản vi phạm điều khoản.',
  },
  {
    title: 'Đặt hàng & Thanh toán',
    content:
      'Khi đặt hàng, bạn cam kết cung cấp thông tin chính xác. Đơn hàng chỉ được xác nhận khi chúng tôi gửi email xác nhận. Giá sản phẩm có thể thay đổi mà không cần thông báo trước. Chúng tôi hỗ trợ thanh toán COD và VNPay.',
  },
  {
    title: 'Giao hàng',
    content:
      'Thời gian giao hàng dự kiến từ 2-5 ngày làm việc tùy khu vực. ZYNA FASHION không chịu trách nhiệm cho sự chậm trễ do nguyên nhân bất khả kháng như thiên tai, dịch bệnh hoặc sự cố giao thông.',
  },
  {
    title: 'Đổi trả & Hoàn tiền',
    content:
      'Sản phẩm được đổi trả trong vòng 7 ngày kể từ ngày nhận hàng, với điều kiện còn nguyên tem mác và chưa qua sử dụng. Chi tiết vui lòng xem tại trang Chính sách đổi trả.',
  },
  {
    title: 'Sở hữu trí tuệ',
    content:
      'Toàn bộ nội dung trên website bao gồm hình ảnh, logo, thiết kế, văn bản và phần mềm thuộc quyền sở hữu của ZYNA FASHION. Nghiêm cấm sao chép, phân phối hoặc sử dụng nội dung mà không có sự cho phép bằng văn bản.',
  },
  {
    title: 'Giới hạn trách nhiệm',
    content:
      'ZYNA FASHION cung cấp dịch vụ trên cơ sở "nguyên trạng". Chúng tôi không đảm bảo website hoạt động liên tục, không lỗi. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp nào phát sinh từ việc sử dụng dịch vụ.',
  },
  {
    title: 'Thay đổi điều khoản',
    content:
      'ZYNA FASHION có quyền cập nhật hoặc sửa đổi điều khoản bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi đăng tải trên website. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các thay đổi.',
  },
]

export default function TermsPage() {
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
            <Scale className='w-4 h-4 text-orange-400' />
            <span className='text-sm font-medium text-white'>Pháp lý</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6'
          >
            Điều khoản <span className='text-orange-400'>sử dụng</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed'
          >
            Các điều khoản và điều kiện áp dụng khi sử dụng dịch vụ của ZYNA FASHION.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {termsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group'
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-300'>
                    0{index + 1}
                  </div>
                  <h3 className='text-xl font-bold text-slate-900'>{section.title}</h3>
                </div>
                <p className='text-slate-500 leading-relaxed text-sm'>{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer links */}
      <section className='py-16 bg-slate-50'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-slate-400'>Cập nhật lần cuối: Tháng 3, 2026</p>
            <div className='flex gap-6 text-sm'>
              <Link
                href='/policies/privacy'
                className='text-slate-500 hover:text-slate-900 font-medium transition-colors'
              >
                Bảo mật thông tin
              </Link>
              <Link
                href='/cookie-policy'
                className='text-slate-500 hover:text-slate-900 font-medium transition-colors'
              >
                Chính sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
