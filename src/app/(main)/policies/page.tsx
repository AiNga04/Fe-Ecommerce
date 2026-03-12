import { Metadata } from 'next'
import { RotateCcw, ShieldCheck, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chính sách đổi trả | ZYNA FASHION',
  description: 'Chính sách đổi trả hàng hóa tại ZYNA FASHION',
}

const policies = [
  {
    icon: Clock,
    title: 'Thời gian đổi trả',
    content: 'Khách hàng có thể yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Quá thời hạn trên, yêu cầu đổi trả sẽ không được chấp nhận.',
  },
  {
    icon: CheckCircle2,
    title: 'Điều kiện đổi trả',
    content: 'Sản phẩm còn nguyên tem mác, chưa qua sử dụng, chưa giặt. Kèm đầy đủ hóa đơn mua hàng hoặc mã đơn hàng.',
  },
  {
    icon: XCircle,
    title: 'Không áp dụng đổi trả',
    content: 'Sản phẩm mua trong chương trình sale/khuyến mãi, sản phẩm đã qua sử dụng, giặt tẩy, hoặc bị hư hỏng do lỗi từ phía khách hàng.',
  },
  {
    icon: RotateCcw,
    title: 'Quy trình đổi trả',
    content: 'Vào mục "Đơn hàng của tôi" → chọn đơn hàng cần đổi trả → Nhấn "Yêu cầu hoàn hàng" → Nhập lý do → Đợi Admin/Staff xác nhận → Shipper đến lấy hàng.',
  },
  {
    icon: ShieldCheck,
    title: 'Hoàn tiền',
    content: 'Sau khi nhận và kiểm tra sản phẩm đổi trả, chúng tôi sẽ hoàn tiền trong vòng 3-5 ngày làm việc qua phương thức thanh toán ban đầu.',
  },
]

export default function PoliciesPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='bg-slate-950 text-white py-20'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6'>
            <RotateCcw className='w-4 h-4' />
            <span className='text-sm font-medium'>Chính sách</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
            Chính sách đổi trả
          </h1>
          <p className='text-lg text-slate-300 max-w-2xl mx-auto'>
            ZYNA FASHION cam kết mang đến trải nghiệm mua sắm an tâm.
            Tìm hiểu chi tiết chính sách đổi trả hàng hóa.
          </p>
        </div>
      </section>

      {/* Policy Cards */}
      <section className='py-20'>
        <div className='container max-w-4xl mx-auto px-4'>
          <div className='space-y-6'>
            {policies.map((policy, index) => (
              <div
                key={index}
                className='group border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300'
              >
                <div className='flex items-start gap-5'>
                  <div className='shrink-0 w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300'>
                    <policy.icon className='w-6 h-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-slate-900 mb-2'>{policy.title}</h3>
                    <p className='text-slate-500 leading-relaxed'>{policy.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className='py-16 bg-slate-50'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <h2 className='text-2xl font-bold text-slate-900 mb-4'>Cần hỗ trợ thêm?</h2>
          <p className='text-slate-500 mb-8 max-w-lg mx-auto'>
            Nếu bạn có bất kỳ thắc mắc nào về chính sách đổi trả, đừng ngần ngại liên hệ với chúng tôi.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/contact'
              className='inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
            >
              Liên hệ hỗ trợ
            </Link>
            <Link
              href='/faq'
              className='inline-flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all'
            >
              Câu hỏi thường gặp
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
