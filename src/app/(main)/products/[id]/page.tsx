import { notFound } from 'next/navigation'
import Link from 'next/link'
import { productService } from '@/services/product'
import { ChevronRight, Home } from 'lucide-react'
import { ProductDetailClient } from './product-detail-client'

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
    <div className='container max-w-10xl mx-auto px-4 py-8'>
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

      <ProductDetailClient product={product} />
    </div>
  )
}
