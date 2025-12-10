import { ShoppingCart, User, Search, Menu, Heart } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className='border-b border-border bg-background'>
      {/* Top bar */}
      <div className='bg-primary text-primary-foreground px-4 py-2 text-center text-sm'>
        Chào mừng bạn đến với ZYNA FASHION – Thời trang hiện đại & phong cách
      </div>

      {/* Main header */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between gap-8'>
          {/* Logo and brand */}
          <div className='flex items-center gap-2 min-w-fit'>
            <Menu className='w-6 h-6 md:hidden' />
            <Link href='/' className='flex items-center gap-2 font-bold text-xl'>
              <div className='w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs'>
                AN
              </div>
              <span>ZYNA FASHION</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className='hidden md:flex flex-1 max-w-md'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
              <input
                type='text'
                placeholder='Tìm kiếm sản phẩm thời trang...'
                className='w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground'
              />
            </div>
          </div>

          {/* Right actions */}
          <div className='flex items-center gap-6'>
            <button className='hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition'>
              <Heart className='w-5 h-5' />
              <span>Yêu thích</span>
            </button>

            <button className='hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition'>
              <User className='w-5 h-5' />
              <span>Đăng nhập / Đăng ký</span>
            </button>

            <button className='relative'>
              <ShoppingCart className='w-6 h-6' />
              <span className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                0
              </span>
            </button>
          </div>
        </div>

        {/* Category navigation */}
        <div className='hidden md:flex gap-6 mt-4 text-sm border-t border-border pt-4'>
          {[
            'Thời trang nữ',
            'Thời trang nam',
            'Giày & Túi xách',
            'Phụ kiện',
            'Áo khoác',
            'Quần jean',
            'Đồ mùa đông',
            'Bộ sưu tập mới',
          ].map((cat) => (
            <button
              key={cat}
              className='hover:underline hover:text-shadow-2xs transition font-medium'
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
