'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Server, UserCheck, Bell, Mail } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    title: 'Thu thập thông tin',
    content:
      'Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đặt hàng hoặc liên hệ hỗ trợ. Thông tin bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Lock,
    title: 'Sử dụng thông tin',
    content:
      'Thông tin cá nhân được sử dụng để xử lý đơn hàng, giao hàng, cung cấp hỗ trợ khách hàng, và cải thiện trải nghiệm mua sắm. Chúng tôi không bán thông tin cho bên thứ ba.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Server,
    title: 'Bảo vệ dữ liệu',
    content:
      'Dữ liệu được mã hóa SSL và lưu trữ trên máy chủ bảo mật. Mật khẩu được mã hóa một chiều (bcrypt) và không thể truy xuất bởi bất kỳ ai, kể cả nhân viên.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: UserCheck,
    title: 'Quyền của bạn',
    content:
      'Bạn có quyền xem, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào thông qua trang Hồ sơ. Bạn cũng có quyền yêu cầu xóa tài khoản vĩnh viễn.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Bell,
    title: 'Thông báo & Marketing',
    content:
      'Chúng tôi chỉ gửi email thông báo đơn hàng và khuyến mãi khi bạn đồng ý nhận. Bạn có thể hủy đăng ký bất cứ lúc nào.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Mail,
    title: 'Liên hệ về bảo mật',
    content:
      'Nếu bạn phát hiện bất kỳ vấn đề bảo mật nào hoặc có thắc mắc về chính sách này, vui lòng liên hệ: support@zynafashion.com',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
]

export default function PrivacyPolicyPage() {
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
            <Shield className='w-4 h-4 text-orange-400' />
            <span className='text-sm font-medium text-white'>Bảo mật</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6'
          >
            Bảo mật <span className='text-orange-400'>thông tin</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed'
          >
            ZYNA FASHION cam kết bảo vệ thông tin cá nhân của bạn.
            Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
            >
              Chính sách bảo mật
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='text-lg text-slate-500 font-light'
            >
              Cách chúng tôi bảo vệ quyền riêng tư của bạn
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group'
              >
                <div className={`p-4 rounded-2xl ${section.bg} ${section.color} mb-6 inline-block group-hover:scale-110 transition-transform`}>
                  <section.icon className='w-8 h-8' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-3'>{section.title}</h3>
                <p className='text-slate-500 leading-relaxed text-sm'>{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className='py-16 bg-slate-50'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6 text-center'>
          <p className='text-sm text-slate-400'>Cập nhật lần cuối: Tháng 3, 2026</p>
        </div>
      </section>
    </main>
  )
}
