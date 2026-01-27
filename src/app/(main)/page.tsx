import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { productService } from '@/services/product'
import { ArrowRight, ShoppingBag, Truck, RefreshCcw, ShieldCheck, Headphones } from 'lucide-react'
import { HeroCarousel } from '@/components/home/hero-carousel'
import women from '@/assets/images/women.avif'
import men from '@/assets/images/men.avif'
import accessories from '@/assets/images/accessories.avif'

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const { data } = await productService.getProducts({
    page: 0,
    size: 4,
    sort: 'createdAt,desc',
  })
  const latestProducts = data?.data || []

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Categories Review (Optional - Static for now) */}
      <section className='py-16 bg-slate-50'>
        <div className='container max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              {
                title: 'Thời Trang Nữ',
                img: women,
              },
              {
                title: 'Thời Trang Nam',
                img: men,
              },
              {
                title: 'Phụ Kiện',
                img: accessories,
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href='/products'
                className='group relative h-64 md:h-80 overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300'
              >
                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10' />
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                  placeholder='blur'
                />
                <div className='absolute inset-0 z-20 flex items-center justify-center'>
                  <h3 className='text-xl lg:text-2xl font-bold text-white tracking-wider lg:tracking-widest uppercase border-2 border-white/80 px-4 lg:px-6 py-2 bg-black/30 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300 text-center whitespace-nowrap md:whitespace-normal xl:whitespace-nowrap'>
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className='py-10 bg-white'>
        <div className='container max-w-7xl mx-auto px-4'>
          <h2 className='text-3xl font-bold tracking-tight mb-8 '>Mua Sắm Theo Thương Hiệu</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {[
              { name: 'ZARA', style: 'font-serif transform scale-y-110 tracking-widest' },
              { name: 'D&G', style: 'font-sans font-black tracking-tighter' },
              { name: 'H&M', style: 'font-sans font-bold text-red-600 italic tracking-tight' },
              { name: 'CHANEL', style: 'font-sans font-bold tracking-[0.2em]' },
              { name: 'PRADA', style: 'font-serif font-bold tracking-widest' },
              { name: 'BIBA', style: 'font-serif font-medium tracking-wide text-red-800' },
            ].map((brand, idx) => (
              <div
                key={idx}
                className='flex items-center justify-center p-8 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer group'
              >
                <span
                  className={`text-2xl text-gray-800 group-hover:text-black transition-colors ${brand.style}`}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='pt-10 pb-20'>
        <div className='container max-w-7xl mx-auto px-4'>
          <div className='flex items-center justify-between mb-10'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>Sản Phẩm Mới Nhất</h2>
              <p className='text-muted-foreground mt-2'>
                Những mẫu thiết kế vừa cập bến tại cửa hàng
              </p>
            </div>
            <Button variant='ghost' asChild className='hidden sm:flex'>
              <Link
                href='/products'
                className='flex items-center text-primary font-semibold hover:text-primary/80'
              >
                Xem tất cả <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className='mt-8 flex justify-center sm:hidden'>
            <Button variant='outline' asChild className='w-full'>
              <Link href='/products'>Xem tất cả sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Highlights Section */}
      <section className='py-12 border-t border-gray-100 bg-white'>
        <div className='container max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group'>
              <div className='flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'>
                <Truck className='w-6 h-6' />
              </div>
              <div>
                <h3 className='font-bold text-gray-900 group-hover:text-blue-700 transition-colors'>
                  Giao Hàng Nhanh
                </h3>
                <p className='text-sm text-gray-500'>Vận chuyển trong 24h</p>
              </div>
            </div>

            <div className='flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group'>
              <div className='flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300'>
                <RefreshCcw className='w-6 h-6' />
              </div>
              <div>
                <h3 className='font-bold text-gray-900 group-hover:text-green-700 transition-colors'>
                  Đổi Trả 24h
                </h3>
                <p className='text-sm text-gray-500'>Hoàn tiền 100%</p>
              </div>
            </div>

            <div className='flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group'>
              <div className='flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300'>
                <ShieldCheck className='w-6 h-6' />
              </div>
              <div>
                <h3 className='font-bold text-gray-900 group-hover:text-purple-700 transition-colors'>
                  Thanh Toán An Toàn
                </h3>
                <p className='text-sm text-gray-500'>Bảo mật thông tin</p>
              </div>
            </div>

            <div className='flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group'>
              <div className='flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300'>
                <Headphones className='w-6 h-6' />
              </div>
              <div>
                <h3 className='font-bold text-gray-900 group-hover:text-orange-700 transition-colors'>
                  Hỗ Trợ 24/7
                </h3>
                <p className='text-sm text-gray-500'>Luôn sẵn sàng tư vấn</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Badge({ children, className, ...props }: any) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
