'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, Heart, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useAuthSession } from '@/hooks/use-auth-session'
import { Role } from '@/constants/enum/role'
import Routers from '@/constants/routers'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cartCount = useCartStore((state) => state.count)
  const fetchCartCount = useCartStore((state) => state.fetchCount)
  const { isAuthenticated, user } = useAuthSession()

  const getProfileLink = () => {
    const roles = user?.roles || []
    if (roles.includes(Role.ADMIN)) return Routers.ADMIN
    if (roles.includes(Role.STAFF)) return Routers.STAFF
    if (roles.includes(Role.SHIPPER)) return Routers.SHIPPER
    return Routers.PROFILE
  }

  useEffect(() => {
    fetchCartCount()
  }, [])

  const navItems = [
    'Thời trang nữ',
    'Thời trang nam',
    'Giày & Túi xách',
    'Phụ kiện',
    'Áo khoác',
    'Quần jean',
    'Đồ mùa đông',
    'Bộ sưu tập mới',
  ]

  return (
    <>
      {/* Top bar - Promotion / Welcome */}
      <div className='bg-primary text-primary-foreground text-[10px] sm:text-xs py-1.5 text-center font-medium tracking-wide relative z-50'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <span className='hidden sm:inline'>Hotline: 1900 1234</span>
          <span className='mx-auto sm:mx-0'>MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 500K</span>
          <span className='hidden sm:inline'>Giao Hàng Toàn Quốc</span>
        </div>
      </div>

      <header className='sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>
        <div className='container max-w-7xl mx-auto px-4'>
          <div className='flex h-16 items-center justify-between gap-4'>
            {/* Left: Mobile Menu & Logo */}
            <div className='flex items-center gap-2 md:gap-4'>
              {/* Mobile Menu Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='ghost' size='icon' className='md:hidden -ml-2'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='w-[300px] sm:w-[400px] p-0 flex flex-col'>
                  <SheetHeader className='p-6 border-b text-left'>
                    <SheetTitle className='sr-only'>Menu</SheetTitle>
                    <Link
                      href='/'
                      className='flex items-center gap-3 w-fit'
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg tracking-tighter shadow-md'>
                        ZF
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-bold text-xl leading-none tracking-tight'>ZYNA</span>
                        <span className='text-[10px] text-muted-foreground tracking-[0.2em] font-medium'>
                          FASHION
                        </span>
                      </div>
                    </Link>
                  </SheetHeader>

                  <div className='flex-1 overflow-y-auto py-6 px-6'>
                    <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 block'>
                      Danh Mục Sản Phẩm
                    </span>
                    <nav className='flex flex-col space-y-1'>
                      {navItems.map((item) => (
                        <Link
                          key={item}
                          href='#'
                          className='flex items-center justify-between text-base font-medium py-3 px-2 rounded-lg hover:bg-muted/50 hover:text-primary transition-all group'
                        >
                          {item}
                          <ArrowRight className='w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary' />
                        </Link>
                      ))}
                    </nav>

                    <div className='mt-8 pt-8 border-t space-y-6'>
                      {/* Account Section in Mobile Menu */}
                      <div>
                        <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 block'>
                          Tài Khoản
                        </span>
                        {isAuthenticated ? (
                          <Link
                            href={getProfileLink()}
                            className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50'
                          >
                            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                              <User className='w-4 h-4' />
                            </div>
                            <div className='flex flex-col'>
                              <span className='font-medium text-sm'>Thông tin tài khoản</span>
                              <span className='text-xs text-muted-foreground'>
                                Quản lý đơn hàng & hồ sơ
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <Link
                            href='/auth/login'
                            className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50'
                          >
                            <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground'>
                              <User className='w-4 h-4' />
                            </div>
                            <div className='flex flex-col'>
                              <span className='font-medium text-sm'>Đăng nhập / Đăng ký</span>
                              <span className='text-xs text-muted-foreground'>
                                Nhận ưu đãi thành viên
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>

                      {/* Contact Section */}
                      <div>
                        <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 block'>
                          Hỗ Trợ
                        </span>
                        <div className='flex flex-col gap-3 text-sm text-muted-foreground px-2'>
                          <span className='flex items-center gap-2'>
                            Hotline: <span className='text-foreground font-medium'>1900 1234</span>
                          </span>
                          <span className='flex items-center gap-2'>
                            Email:{' '}
                            <span className='text-foreground font-medium'>support@zyna.com</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link href='/' className='flex items-center gap-2 group'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-sm sm:text-base tracking-tighter shadow-sm group-hover:shadow-md transition-all'>
                  ZF
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold text-lg sm:text-xl leading-none tracking-tight'>
                    ZYNA
                  </span>
                  <span className='text-[10px] sm:text-xs text-muted-foreground tracking-[0.2em] font-medium'>
                    FASHION
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className='hidden md:flex items-center gap-1'>
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item}
                  href='#'
                  className='px-3 py-2 text-sm font-medium hover:text-primary relative group transition-colors'
                >
                  {item}
                  <span className='absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full' />
                </Link>
              ))}
              {/* More dropdown could go here if needed */}
            </nav>

            {/* Right: Actions & Search */}
            <div className='flex items-center gap-1 sm:gap-2'>
              {/* Search Desktop */}
              <div className='hidden lg:block relative w-64 mr-2'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  className='w-full h-9 pl-9 pr-4 rounded-full border border-input bg-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-colors'
                  placeholder='Tìm kiếm...'
                />
              </div>

              {/* Mobile Search Toggle */}
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden'
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className='h-5 w-5' />
              </Button>

              <Button variant='ghost' size='icon' className='hidden sm:flex hover:text-primary'>
                <Heart className='h-5 w-5' />
              </Button>

              {isAuthenticated ? (
                <Button variant='ghost' size='icon' className='hover:text-primary' asChild>
                  <Link href={getProfileLink()}>
                    <User className='h-5 w-5' />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:text-primary font-medium gap-2'
                  asChild
                >
                  <Link href='/auth/login'>
                    <User className='h-5 w-5' />
                    <span className='hidden md:inline'>Đăng nhập / Đăng ký</span>
                  </Link>
                </Button>
              )}

              <Button variant='ghost' size='icon' className='relative hover:text-primary' asChild>
                <Link href='/carts'>
                  <ShoppingCart className='h-5 w-5' />
                  {cartCount > 0 && (
                    <Badge className='absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 p-0 flex items-center justify-center rounded-full text-[10px] lg:text-xs bg-primary text-primary-foreground border-2 border-background'>
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar Expand */}
          {isSearchOpen && (
            <div className='lg:hidden py-3 px-1 pb-4 animate-in slide-in-from-top-2'>
              <div className='relative w-full'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                <input
                  className='w-full h-10 pl-10 pr-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm'
                  placeholder='Tìm kiếm sản phẩm...'
                  autoFocus
                />
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8'
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
