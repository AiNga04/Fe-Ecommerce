'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, Heart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
                <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
                  <SheetHeader>
                    <SheetTitle className='text-left font-bold text-xl'>DANH MỤC</SheetTitle>
                  </SheetHeader>
                  <nav className='flex flex-col gap-4 mt-8 px-4'>
                    {navItems.map((item) => (
                      <Link
                        key={item}
                        href='#'
                        className='text-lg font-medium hover:text-primary transition-colors'
                      >
                        {item}
                      </Link>
                    ))}
                  </nav>
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

              <Button variant='ghost' size='icon' className='hover:text-primary'>
                <User className='h-5 w-5' />
              </Button>

              <Button variant='ghost' size='icon' className='relative hover:text-primary'>
                <ShoppingCart className='h-5 w-5' />
                <Badge className='absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 p-0 flex items-center justify-center rounded-full text-[10px] lg:text-xs bg-primary text-primary-foreground border-2 border-background'>
                  2
                </Badge>
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
