import { Metadata } from 'next'
import { BookOpen, Search, ShoppingBag, CreditCard, Truck, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hướng dẫn mua hàng | ZYNA FASHION',
  description: 'Hướng dẫn chi tiết cách mua sắm trên ZYNA FASHION',
}

const steps = [
  {
    icon: Search,
    title: 'Tìm sản phẩm yêu thích',
    description:
      'Duyệt qua bộ sưu tập hoặc sử dụng thanh tìm kiếm để tìm sản phẩm bạn muốn. Bạn có thể lọc theo danh mục, giá, hoặc đánh giá.',
  },
  {
    icon: ShoppingBag,
    title: 'Chọn kích thước & thêm vào giỏ',
    description:
      'Chọn kích thước phù hợp bằng cách tham khảo bảng size. Nhấn "Thêm vào giỏ" để đưa sản phẩm vào giỏ hàng của bạn.',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán đơn hàng',
    description:
      'Kiểm tra giỏ hàng, nhập mã giảm giá nếu có, chọn địa chỉ giao hàng và phương thức thanh toán (COD hoặc VNPay).',
  },
  {
    icon: Truck,
    title: 'Giao hàng tận nơi',
    description:
      'Đơn hàng được xác nhận sẽ giao trong 2-5 ngày làm việc. Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi".',
  },
  {
    icon: CheckCircle,
    title: 'Nhận hàng & xác nhận',
    description:
      'Kiểm tra sản phẩm khi nhận. Nếu hài lòng, xác nhận đã nhận hàng. Nếu có vấn đề, yêu cầu đổi trả trong 7 ngày.',
  },
]

export default function GuidesPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='bg-slate-950 text-white py-20'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6'>
            <BookOpen className='w-4 h-4' />
            <span className='text-sm font-medium'>Hướng dẫn</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
            Hướng dẫn mua hàng
          </h1>
          <p className='text-lg text-slate-300 max-w-2xl mx-auto'>
            Mua sắm tại ZYNA FASHION chỉ với 5 bước đơn giản.
            Trải nghiệm mua sắm dễ dàng và an toàn.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className='py-20'>
        <div className='container max-w-4xl mx-auto px-4'>
          <div className='space-y-0'>
            {steps.map((step, index) => (
              <div key={index} className='relative flex gap-6 md:gap-8 pb-12 last:pb-0'>
                {/* Vertical line */}
                {index < steps.length - 1 && (
                  <div className='absolute left-6 top-14 w-0.5 h-[calc(100%-3.5rem)] bg-slate-200' />
                )}
                {/* Step number */}
                <div className='shrink-0 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg relative z-10'>
                  {index + 1}
                </div>
                {/* Content */}
                <div className='flex-1 pt-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <step.icon className='w-5 h-5 text-primary' />
                    <h3 className='text-xl font-bold text-slate-900'>{step.title}</h3>
                  </div>
                  <p className='text-slate-500 leading-relaxed'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-16 bg-slate-50'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <h2 className='text-2xl font-bold text-slate-900 mb-4'>Sẵn sàng mua sắm?</h2>
          <p className='text-slate-500 mb-8 max-w-lg mx-auto'>
            Khám phá hàng ngàn sản phẩm thời trang chất lượng cao với giá tốt nhất.
          </p>
          <Link
            href='/products'
            className='inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
          >
            Mua sắm ngay
            <ArrowRight className='w-5 h-5' />
          </Link>
        </div>
      </section>
    </div>
  )
}
