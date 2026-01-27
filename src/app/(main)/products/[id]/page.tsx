import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { productService } from '@/services/product'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { ChevronRight, Home, Star } from 'lucide-react'

// ISR: Revalidate every 60 seconds
export const revalidate = 60

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params
  try {
    const res = await productService.getProductById(id)
    const product = res.data?.data
    return {
      title: product ? `${product.name} | E-Commerce` : 'Sản phẩm',
      description: product?.description || 'Chi tiết sản phẩm',
    }
  } catch (error) {
    return {
      title: 'Sản phẩm không tìm thấy',
    }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  let product = null
  try {
    const res = await productService.getProductById(id)
    product = res.data?.data
  } catch (error) {
    console.error('Error fetching product detail:', error)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-8'>
        <Link href='/' className='hover:text-primary transition-colors'>
          <Home className='size-4' />
        </Link>
        <ChevronRight className='size-4' />
        <Link href='/products' className='hover:text-primary transition-colors'>
          Sản phẩm
        </Link>
        <ChevronRight className='size-4' />
        <span className='font-medium text-foreground'>{product.name}</span>
      </nav>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Product Images */}
        <div className='relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border'>
          {product.imageUrl ? (
            <Image
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              className='object-cover'
              priority
              sizes='(max-width: 768px) 100vw, 50vw'
              unoptimized
            />
          ) : (
            <div className='flex h-full items-center justify-center text-gray-400'>No image</div>
          )}
        </div>

        {/* Product Info */}
        <div className='space-y-8'>
          <div className='space-y-4'>
            <Badge variant='secondary' className='text-sm px-3 py-1'>
              {product.category}
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900'>{product.name}</h1>

            <div className='flex items-center gap-4'>
              <div className='text-3xl font-bold text-primary'>{formatCurrency(product.price)}</div>
              {product.stock > 0 ? (
                <Badge variant='outline' className='text-green-600 border-green-200 bg-green-50'>
                  Còn hàng ({product.stock})
                </Badge>
              ) : (
                <Badge variant='destructive'>Hết hàng</Badge>
              )}
            </div>
          </div>

          <div className='border-t border-b py-6 space-y-4'>
            <h3 className='font-semibold text-lg'>Mô tả sản phẩm</h3>
            <p className='text-muted-foreground leading-relaxed'>
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              {/* Add to Cart Button Placeholder */}
              <Button size='lg' className='w-full md:w-auto px-12 text-lg h-12'>
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>

          {/* Additional Metadata */}
          <div className='grid grid-cols-2 gap-4 text-sm text-gray-500 pt-4'>
            <div>
              <span className='font-medium text-gray-900'>Ngày đăng:</span>{' '}
              {new Date(product.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
