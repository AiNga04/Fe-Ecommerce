'use client'

import { motion } from 'framer-motion'
import { Cookie, Settings, BarChart3, Shield, ToggleRight } from 'lucide-react'
import Link from 'next/link'

const cookieTypes = [
  {
    icon: Settings,
    name: 'Cookie cần thiết',
    required: true,
    description:
      'Cookie bắt buộc để website hoạt động bình thường. Bao gồm: duy trì phiên đăng nhập, giỏ hàng, và cài đặt bảo mật. Không thể tắt loại cookie này.',
    examples: [
      'Phiên đăng nhập (session)',
      'Token xác thực',
      'Giỏ hàng tạm thời',
      'Cài đặt ngôn ngữ',
    ],
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    name: 'Cookie phân tích',
    required: false,
    description:
      'Giúp chúng tôi hiểu cách khách hàng sử dụng website, trang nào được truy cập nhiều nhất, và cải thiện trải nghiệm người dùng.',
    examples: [
      'Google Analytics',
      'Thống kê lượt truy cập',
      'Hành vi duyệt web',
      'Thời gian trên trang',
    ],
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: ToggleRight,
    name: 'Cookie tiếp thị',
    required: false,
    description:
      'Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn. Cookie này có thể được chia sẻ với các đối tác quảng cáo.',
    examples: ['Facebook Pixel', 'Google Ads', 'Quảng cáo cá nhân hóa', 'Remarketing'],
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
]

const browserLinks = [
  { name: 'Chrome', href: 'https://support.google.com/chrome/answer/95647' },
  {
    name: 'Firefox',
    href: 'https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer',
  },
  { name: 'Safari', href: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471' },
  {
    name: 'Edge',
    href: 'https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge',
  },
]

export default function CookiePolicyPage() {
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
            <Cookie className='w-4 h-4 text-orange-400' />
            <span className='text-sm font-medium text-white'>Cookie</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6'
          >
            Chính sách <span className='text-orange-400'>Cookie</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed'
          >
            ZYNA FASHION sử dụng cookie để cải thiện trải nghiệm mua sắm của bạn.
            Tìm hiểu các loại cookie và cách quản lý chúng.
          </motion.p>
        </div>
      </section>

      {/* What are cookies */}
      <section className='py-24 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='space-y-6'
            >
              <div className='space-y-4'>
                <h2 className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight'>
                  Cookie là gì?
                </h2>
                <div className='h-1 w-20 bg-orange-500 rounded-full' />
              </div>
              <p className='text-lg text-slate-600 leading-relaxed'>
                Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi truy cập
                website. Chúng giúp website ghi nhớ thông tin đăng nhập, sở thích cá nhân và cải
                thiện hiệu suất.
              </p>
              <p className='text-lg text-slate-800 leading-relaxed font-medium'>
                Cookie không chứa virus và không gây hại cho thiết bị của bạn. Chúng đóng vai trò
                quan trọng trong việc mang đến trải nghiệm mua sắm mượt mà.
              </p>
            </motion.div>

            {/* Browser management */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-100'
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 rounded-2xl bg-slate-900 text-white'>
                  <Shield className='w-6 h-6' />
                </div>
                <h3 className='text-xl font-bold text-slate-900'>Quản lý Cookie</h3>
              </div>
              <p className='text-slate-500 leading-relaxed mb-6'>
                Bạn có thể kiểm soát và xóa cookie thông qua cài đặt trình duyệt. Lưu ý rằng việc
                tắt cookie có thể ảnh hưởng đến trải nghiệm sử dụng website.
              </p>
              <div className='flex flex-wrap gap-3'>
                {browserLinks.map((browser) => (
                  <a
                    key={browser.name}
                    href={browser.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='px-5 py-2.5 bg-white rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300'
                  >
                    {browser.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className='py-24 bg-slate-50'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-3xl md:text-5xl font-bold tracking-tight text-slate-900'
            >
              Các loại Cookie
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='text-lg text-slate-500 font-light'
            >
              Chúng tôi sử dụng 3 loại cookie khác nhau
            </motion.p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className='bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group'
              >
                <div className='flex items-center justify-between mb-6'>
                  <div
                    className={`p-4 rounded-2xl ${cookie.bg} ${cookie.color} group-hover:scale-110 transition-transform`}
                  >
                    <cookie.icon className='w-8 h-8' />
                  </div>
                  {cookie.required && (
                    <span className='text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white px-3 py-1 rounded-full'>
                      Bắt buộc
                    </span>
                  )}
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-3'>{cookie.name}</h3>
                <p className='text-slate-500 leading-relaxed text-sm mb-6'>{cookie.description}</p>
                <div className='flex flex-wrap gap-2'>
                  {cookie.examples.map((ex, i) => (
                    <span
                      key={i}
                      className='text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg'
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto max-w-10xl px-4 md:px-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-slate-400'>Cập nhật lần cuối: Tháng 3, 2026</p>
            <div className='flex gap-6 text-sm'>
              <Link
                href='/terms'
                className='text-slate-500 hover:text-slate-900 font-medium transition-colors'
              >
                Điều khoản
              </Link>
              <Link
                href='/policies/privacy'
                className='text-slate-500 hover:text-slate-900 font-medium transition-colors'
              >
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
