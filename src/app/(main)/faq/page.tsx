'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, ChevronDown, Search, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const faqCategories = [
  {
    name: 'Đặt hàng & Thanh toán',
    questions: [
      {
        q: 'Tôi có thể đặt hàng qua điện thoại không?',
        a: 'Hiện tại bạn chỉ có thể đặt hàng trực tiếp trên website. Chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán online hoặc COD.',
      },
      {
        q: 'Có những phương thức thanh toán nào?',
        a: 'ZYNA FASHION hỗ trợ thanh toán bằng COD (thanh toán khi nhận hàng) và VNPay (thanh toán trực tuyến qua thẻ ngân hàng, ví điện tử).',
      },
      {
        q: 'Tôi có thể sử dụng mã giảm giá không?',
        a: 'Có! Tại bước thanh toán, nhập mã giảm giá vào ô "Mã giảm giá" và nhấn áp dụng. Mỗi đơn hàng chỉ được sử dụng 1 mã giảm giá.',
      },
      {
        q: 'Tôi có thể hủy đơn hàng không?',
        a: 'Bạn có thể hủy đơn hàng khi đơn hàng ở trạng thái "Chờ xác nhận". Sau khi đơn hàng đã được xác nhận, vui lòng liên hệ hỗ trợ để được giúp đỡ.',
      },
    ],
  },
  {
    name: 'Giao hàng',
    questions: [
      {
        q: 'Thời gian giao hàng là bao lâu?',
        a: 'Đơn hàng thông thường được giao trong 2-5 ngày làm việc tùy khu vực. Nội thành TP.HCM và Hà Nội thường nhận hàng trong 1-2 ngày.',
      },
      {
        q: 'Phí giao hàng là bao nhiêu?',
        a: 'Phí giao hàng được tính tự động dựa trên khu vực giao hàng. Đơn hàng trên 500.000₫ được miễn phí giao hàng toàn quốc.',
      },
      {
        q: 'Tôi có thể theo dõi đơn hàng không?',
        a: 'Có! Vào mục "Đơn hàng của tôi" trong trang cá nhân để theo dõi trạng thái giao hàng chi tiết theo thời gian thực.',
      },
    ],
  },
  {
    name: 'Đổi trả & Hoàn tiền',
    questions: [
      {
        q: 'Điều kiện đổi trả hàng?',
        a: 'Sản phẩm còn nguyên tem mác, chưa qua sử dụng, chưa giặt và đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Kèm mã đơn hàng.',
      },
      {
        q: 'Thời gian hoàn tiền là bao lâu?',
        a: 'Sau khi kiểm tra sản phẩm đổi trả, chúng tôi hoàn tiền trong 3-5 ngày làm việc qua phương thức thanh toán ban đầu.',
      },
      {
        q: 'Sản phẩm sale có được đổi trả không?',
        a: 'Sản phẩm mua trong chương trình khuyến mãi/sale không được đổi trả trừ trường hợp lỗi do nhà sản xuất.',
      },
    ],
  },
  {
    name: 'Tài khoản',
    questions: [
      {
        q: 'Làm sao để đăng ký tài khoản?',
        a: 'Nhấn "Đăng ký" trên thanh navigation, điền đầy đủ thông tin: họ tên, email, mật khẩu. Kiểm tra email để kích hoạt tài khoản.',
      },
      {
        q: 'Quên mật khẩu phải làm sao?',
        a: 'Nhấn "Quên mật khẩu?" tại trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi mã OTP qua email để bạn đặt lại mật khẩu mới.',
      },
      {
        q: 'Tôi có thể đổi email không?',
        a: 'Có! Vào phần "Hồ sơ cá nhân", sử dụng form "Đổi email" để cập nhật. Sau khi đổi, bạn cần xác nhận email mới để kích hoạt lại tài khoản.',
      },
    ],
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'border-slate-300 shadow-md bg-white' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between gap-4 p-6 text-left'
      >
        <span className='font-bold text-slate-900'>{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6' : 'max-h-0'}`}
      >
        <p className='px-6 text-sm text-slate-500 leading-relaxed'>{answer}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0)

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
            <HelpCircle className='w-4 h-4 text-orange-400' />
            <span className='text-sm font-medium text-white'>FAQ</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6'
          >
            Câu hỏi <span className='text-orange-400'>thường gặp</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mb-10'
          >
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='max-w-lg mx-auto relative'
          >
            <Search className='absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
            <Input
              placeholder='Tìm kiếm câu hỏi...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-14 bg-white/10 border-white/20 rounded-full text-white placeholder:text-slate-400 pl-14 text-base backdrop-blur-sm focus-visible:ring-white/30'
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          {filteredCategories.length === 0 ? (
            <div className='text-center py-20'>
              <HelpCircle className='w-16 h-16 text-slate-200 mx-auto mb-6' />
              <p className='text-2xl font-bold text-slate-900'>Không tìm thấy kết quả</p>
              <p className='text-slate-500 mt-2 text-lg font-light'>Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
              {filteredCategories.map((category, catIndex) => (
                <motion.div
                  key={catIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3'>
                    <div className='h-8 w-1.5 bg-orange-500 rounded-full' />
                    {category.name}
                  </h2>
                  <div className='space-y-3'>
                    {category.questions.map((q, qIndex) => (
                      <FaqItem key={qIndex} question={q.q} answer={q.a} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
            Chưa tìm thấy câu trả lời?
          </motion.h2>
          <p className='text-lg text-slate-500 mb-10 max-w-xl mx-auto font-light'>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn.
          </p>
          <Button
            size='lg'
            className='bg-slate-900 hover:bg-black text-white min-w-[200px] h-14 text-base font-semibold rounded-full group'
            asChild
          >
            <Link href='/contact' className='flex items-center gap-2'>
              Liên hệ hỗ trợ
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
