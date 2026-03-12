'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
    <div className='border border-slate-200 rounded-xl overflow-hidden transition-all hover:border-slate-300'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between gap-4 p-5 text-left'
      >
        <span className='font-semibold text-slate-900'>{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-5' : 'max-h-0'}`}
      >
        <p className='px-5 text-sm text-slate-500 leading-relaxed'>{answer}</p>
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
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='bg-slate-950 text-white py-20'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6'>
            <HelpCircle className='w-4 h-4' />
            <span className='text-sm font-medium'>FAQ</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
            Câu hỏi thường gặp
          </h1>
          <p className='text-lg text-slate-300 max-w-2xl mx-auto mb-8'>
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến.
          </p>

          {/* Search */}
          <div className='max-w-md mx-auto relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
            <Input
              placeholder='Tìm kiếm câu hỏi...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-14 bg-white/10 border-white/20 rounded-xl text-white placeholder:text-slate-400 pl-12 text-base backdrop-blur-sm focus-visible:ring-white/30'
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className='py-20'>
        <div className='container max-w-3xl mx-auto px-4'>
          {filteredCategories.length === 0 ? (
            <div className='text-center py-16'>
              <HelpCircle className='w-12 h-12 text-slate-300 mx-auto mb-4' />
              <p className='text-lg font-semibold text-slate-900'>Không tìm thấy kết quả</p>
              <p className='text-slate-500 mt-1'>Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className='space-y-10'>
              {filteredCategories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className='text-xl font-bold text-slate-900 mb-4 flex items-center gap-2'>
                    <span className='w-1.5 h-6 bg-slate-900 rounded-full' />
                    {category.name}
                  </h2>
                  <div className='space-y-3'>
                    {category.questions.map((q, qIndex) => (
                      <FaqItem key={qIndex} question={q.q} answer={q.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className='py-16 bg-slate-50'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <h2 className='text-2xl font-bold text-slate-900 mb-4'>Chưa tìm thấy câu trả lời?</h2>
          <p className='text-slate-500 mb-8 max-w-lg mx-auto'>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn.
          </p>
          <Link
            href='/contact'
            className='inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </section>
    </div>
  )
}
