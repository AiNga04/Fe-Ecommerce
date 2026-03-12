import { Metadata } from 'next'
import { Shield, Eye, Lock, Server, UserCheck, Bell, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bảo mật thông tin | ZYNA FASHION',
  description: 'Chính sách bảo mật thông tin cá nhân tại ZYNA FASHION',
}

const sections = [
  {
    icon: Eye,
    title: 'Thu thập thông tin',
    content:
      'Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đặt hàng hoặc liên hệ hỗ trợ. Thông tin bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng.',
  },
  {
    icon: Lock,
    title: 'Sử dụng thông tin',
    content:
      'Thông tin cá nhân được sử dụng để xử lý đơn hàng, giao hàng, cung cấp hỗ trợ khách hàng, và cải thiện trải nghiệm mua sắm. Chúng tôi không bán thông tin cho bên thứ ba.',
  },
  {
    icon: Server,
    title: 'Bảo vệ dữ liệu',
    content:
      'Dữ liệu được mã hóa SSL và lưu trữ trên máy chủ bảo mật. Mật khẩu được mã hóa một chiều (bcrypt) và không thể truy xuất bởi bất kỳ ai, kể cả nhân viên.',
  },
  {
    icon: UserCheck,
    title: 'Quyền của bạn',
    content:
      'Bạn có quyền xem, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào thông qua trang Hồ sơ. Bạn cũng có quyền yêu cầu xóa tài khoản vĩnh viễn.',
  },
  {
    icon: Bell,
    title: 'Thông báo & Marketing',
    content:
      'Chúng tôi chỉ gửi email thông báo đơn hàng và khuyến mãi khi bạn đồng ý nhận. Bạn có thể hủy đăng ký bất cứ lúc nào.',
  },
  {
    icon: Mail,
    title: 'Liên hệ về bảo mật',
    content:
      'Nếu bạn phát hiện bất kỳ vấn đề bảo mật nào hoặc có thắc mắc về chính sách này, vui lòng liên hệ: support@zynafashion.com',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='bg-slate-950 text-white py-20'>
        <div className='container max-w-10xl mx-auto px-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6'>
            <Shield className='w-4 h-4' />
            <span className='text-sm font-medium'>Bảo mật</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
            Bảo mật thông tin
          </h1>
          <p className='text-lg text-slate-300 max-w-2xl mx-auto'>
            ZYNA FASHION cam kết bảo vệ thông tin cá nhân của bạn.
            Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className='py-20'>
        <div className='container max-w-4xl mx-auto px-4'>
          <div className='grid gap-8 md:grid-cols-2'>
            {sections.map((section, index) => (
              <div
                key={index}
                className='border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-300'
              >
                <div className='w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4'>
                  <section.icon className='w-5 h-5 text-slate-700' />
                </div>
                <h3 className='text-lg font-bold text-slate-900 mb-2'>{section.title}</h3>
                <p className='text-sm text-slate-500 leading-relaxed'>{section.content}</p>
              </div>
            ))}
          </div>

          {/* Last updated */}
          <div className='mt-16 pt-8 border-t border-slate-200 text-center'>
            <p className='text-sm text-slate-400'>
              Cập nhật lần cuối: Tháng 3, 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
