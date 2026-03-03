import { Metadata } from 'next'
import { AboutHero } from '@/components/about/about-hero'
import { AboutStory } from '@/components/about/about-story'
import { AboutValues } from '@/components/about/about-values'
import { AboutProcess } from '@/components/about/about-process'
import { AboutStats } from '@/components/about/about-stats'
import { AboutTestimonials } from '@/components/about/about-testimonials'
import { AboutCTA } from '@/components/about/about-cta'

/**
 * Metadata for SEO
 */
export const metadata: Metadata = {
  title: 'Về Zyna Fashion | Câu Chuyện Thương Hiệu',
  description:
    'Khám phá hành trình kiến tạo phong cách tối giản và tinh tế tại Zyna Fashion. Chúng tôi cam kết mang lại giá trị bền vững và sự tự tin cho mỗi khách hàng.',
  openGraph: {
    title: 'Về Zyna Fashion | Câu Chuyện Thương Hiệu',
    description: 'Thời trang không chỉ để mặc – đó là cách bạn thể hiện bản thân.',
    type: 'website',
    images: ['/images/about/hero.png'],
  },
}

/**
 * About Page Component
 * @description Trang giới thiệu thương hiệu Zyna Fashion với thiết kế premium và minimal.
 */
export default function AboutPage() {
  return (
    <main className='flex flex-col w-full min-h-screen'>
      {/* Hero Section */}
      <AboutHero />

      {/* Brand Story Section */}
      <AboutStory />

      {/* Brand Stats - Dark Divider */}
      <AboutStats />

      {/* Core Values Section */}
      <AboutValues />

      {/* Production Process Section */}
      <AboutProcess />

      {/* Testimonials Section */}
      <AboutTestimonials />

      {/* Final Call to Action Section */}
      <AboutCTA />
    </main>
  )
}
