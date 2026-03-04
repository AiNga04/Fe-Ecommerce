import { Metadata } from 'next'
import { ContactHero } from '@/components/contact/contact-hero'
import { ContactInfo } from '@/components/contact/contact-info'
import { ContactFormMap } from '@/components/contact/contact-form-map'
import { ContactFAQ } from '@/components/contact/contact-faq'
import { ContactSocial } from '@/components/contact/contact-social'
import { ContactCTA } from '@/components/contact/contact-cta'

/**
 * Metadata for SEO
 */
export const metadata: Metadata = {
  title: 'Liên Hệ | Zyna Fashion',
  description:
    'Liên hệ với Zyna Fashion để được tư vấn về sản phẩm, hỗ trợ đơn hàng hoặc hợp tác. Chúng tôi luôn sẵn sàng lắng nghe bạn.',
  openGraph: {
    title: 'Liên Hệ | Zyna Fashion',
    description: 'Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng phong cách của bạn.',
    type: 'website',
    images: ['/images/about/hero.png'], // Reusing about hero for OG
  },
}

/**
 * Contact Page Component
 * @description Trang liên hệ thương hiệu Zyna Fashion với thiết kế hiện đại, tinh tế.
 */
export default function ContactPage() {
  return (
    <main className='flex flex-col w-full min-h-screen bg-white'>
      {/* Hero Section */}
      <ContactHero />

      {/* Overlapping Info Cards */}
      <ContactInfo />

      {/* Main Form & Map Section */}
      <ContactFormMap />

      {/* FAQ Section */}
      <ContactFAQ />

      {/* Social Follow Section */}
      <ContactSocial />

      {/* Final Soft CTA */}
      <ContactCTA />
    </main>
  )
}
