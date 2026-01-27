'use client'

import { useState, useEffect, useCallback } from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import images
import banner from '@/assets/images/banner.avif'
import women from '@/assets/images/women.avif'
import men from '@/assets/images/men.avif'
import accessories from '@/assets/images/accessories.avif'

interface SlideData {
  id: number
  title: string
  subtitle: string
  description: string
  cta: string
  ctaLink: string
  image: StaticImageData
  bgColor: string
  accentColor: string
}

const slides: SlideData[] = [
  {
    id: 1,
    title: 'LATEST NIKE SHOES',
    subtitle: 'Best Deal Online on smart watches', // Keeping text from reference or adapting? Let's adapt to "Summer Collection" etc.
    description: 'UP to 80% OFF',
    cta: 'Mua Ngay',
    ctaLink: '/products',
    image: banner, // Ideally this would be a transparent PNG of a shoe, but we'll use what we have.
    bgColor: 'bg-blue-600',
    accentColor: 'bg-yellow-400',
  },
  {
    id: 2,
    title: 'THỜI TRANG NAM',
    subtitle: 'Phong cách & Lịch lãm',
    description: 'Giảm giá 50% cho vest',
    cta: 'Khám Phá',
    ctaLink: '/products?category=men',
    image: men,
    bgColor: 'bg-slate-800',
    accentColor: 'bg-orange-500',
  },
  {
    id: 3,
    title: 'THỜI TRANG NỮ',
    subtitle: 'Quyến rũ & Cá tính',
    description: 'Bộ sưu tập mùa hè mới',
    cta: 'Xem Chi Tiết',
    ctaLink: '/products?category=women',
    image: women,
    bgColor: 'bg-pink-600',
    accentColor: 'bg-purple-900',
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <div
      className='relative w-full h-[600px] md:h-[600px] overflow-hidden'
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className='flex transition-transform duration-700 ease-out h-full'
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={cn(
              'w-full h-full flex-shrink-0 relative flex flex-col md:grid md:grid-cols-[40%_60%] justify-center md:items-center px-4 md:px-20',
              slide.bgColor,
            )}
          >
            {/* Decorative Circle */}
            <div
              className={cn(
                'absolute rounded-full w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-20 md:opacity-100',
                'right-[-100px] bottom-[-100px] md:right-10 md:bottom-[-100px]',
                slide.accentColor,
              )}
            />

            {/* Content Left */}
            <div className='relative z-10 text-white space-y-3 md:space-y-6 md:pl-12 pt-8 md:pt-0 max-w-[90%] md:max-w-none mx-auto md:mx-0 text-center md:text-left flex-none z-20'>
              <span className='text-sm md:text-xl font-medium tracking-wide opacity-90 block mb-1 md:mb-2'>
                {slide.subtitle}
              </span>
              <h1 className='text-3xl md:text-6xl lg:text-7xl font-bold leading-tight uppercase'>
                {slide.title}
              </h1>
              <p className='text-lg md:text-4xl font-light opacity-90'>{slide.description}</p>

              <div className='pt-2 md:pt-4'>
                <Button
                  size='lg'
                  className='bg-white text-black hover:bg-white/90 rounded-full px-8 h-10 md:h-12 text-sm md:text-base font-bold'
                  asChild
                >
                  <Link href={slide.ctaLink}>{slide.cta}</Link>
                </Button>
              </div>
            </div>

            {/* Image Right */}
            <div className='relative z-10 flex-1 w-full flex items-center justify-center p-4 md:p-4 overflow-visible'>
              {/* Added explicit min-height for mobile to guarantee visibility */}
              <div className='relative w-full h-full min-h-[260px] md:min-h-0 md:aspect-square max-w-[500px] md:max-w-[600px] animate-in slide-in-from-right duration-700'>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className='object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500'
                  priority={true}
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile for cleaner UI, kept on desktop */}
      <button
        onClick={prevSlide}
        className='hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 items-center justify-center backdrop-blur-sm transition-all text-white z-20'
      >
        <ChevronLeft className='w-6 h-6' />
      </button>

      <button
        onClick={nextSlide}
        className='hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 items-center justify-center backdrop-blur-sm transition-all text-white z-20'
      >
        <ChevronRight className='w-6 h-6' />
      </button>

      {/* Pagination Dots */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20'>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              current === idx ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80',
            )}
          />
        ))}
      </div>
    </div>
  )
}
