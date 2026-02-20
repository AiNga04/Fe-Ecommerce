import Link from 'next/link'
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className='bg-zinc-950 text-zinc-200 pt-16 pb-8 border-t border-zinc-800'>
      <div className='container max-w-10xl mx-auto px-4'>
        {/* Main Footer Content: 4 Columns */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>
          {/* Column 1: Brand */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center gap-2 mb-4'>
              <div className='w-9 h-9 bg-white rounded-lg flex items-center justify-center text-zinc-950 font-bold text-sm'>
                ZF
              </div>
              <span className='font-bold text-xl tracking-tight text-white'>ZYNA FASHION</span>
            </Link>
            <p className='text-sm text-zinc-400 leading-relaxed font-medium'>
              Thương hiệu thời trang mang đến phong cách hiện đại và sự tự tin cho bạn.
            </p>
            <div className='flex items-center gap-4 pt-2'>
              {[Facebook, Instagram, Github, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href='#'
                  className='w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-white hover:text-zinc-950 transition-all duration-300'
                >
                  <Icon className='h-5 w-5' />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Mua sắm */}
          <div className='space-y-5'>
            <h4 className='font-bold text-sm uppercase tracking-wider text-white'>Mua sắm</h4>
            <ul className='space-y-3 text-sm text-zinc-300'>
              {[
                'Thời trang nữ',
                'Thời trang nam',
                'Phụ kiện nổi bật',
                'Sale Off',
                'Bộ sưu tập mới',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='hover:text-white hover:translate-x-1 transition-all duration-200 inline-block font-medium'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hỗ trợ */}
          <div className='space-y-5'>
            <h4 className='font-bold text-sm uppercase tracking-wider text-white'>Hỗ trợ</h4>
            <ul className='space-y-3 text-sm text-zinc-300'>
              {[
                'Hướng dẫn mua hàng',
                'Chính sách đổi trả',
                'Vận chuyển & Giao nhận',
                'Bảo mật thông tin',
                'Câu hỏi thường gặp',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='hover:text-white hover:translate-x-1 transition-all duration-200 inline-block font-medium'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Liên hệ */}
          <div className='space-y-5'>
            <h4 className='font-bold text-sm uppercase tracking-wider text-white'>Liên hệ</h4>
            <ul className='space-y-4 text-sm text-zinc-300 font-medium'>
              <li className='flex items-start gap-3'>
                <MapPin className='h-5 w-5 text-white shrink-0' />
                <span>123 Đường Fashion, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='h-5 w-5 text-white shrink-0' />
                <span>1900 1234 - (028) 3838 3838</span>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-white shrink-0' />
                <span>support@zynafashion.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className='mb-8 bg-zinc-800' />

        {/* Bottom */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400 font-medium'>
          <p>© 2026 ZYNA FASHION. All rights reserved.</p>
          <div className='flex gap-6'>
            <Link href='#' className='hover:text-white transition-colors'>
              Điều khoản
            </Link>
            <Link href='#' className='hover:text-white transition-colors'>
              Bảo mật
            </Link>
            <Link href='#' className='hover:text-white transition-colors'>
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
