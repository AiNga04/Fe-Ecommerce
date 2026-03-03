'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Product, ProductVariant } from '@/types/product'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { cartService } from '@/services/cart'
import { useCartStore } from '@/store/cart'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuthSession } from '@/hooks/use-auth-session'
import Routers from '@/constants/routers'
import { ProductReviewsList } from '@/components/reviews/product-reviews-list'

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.imageUrl)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const fetchCartCount = useCartStore((state) => state.fetchCount)

  // Ensure gallery includes the main image if not present
  const allImages = [{ id: 0, url: product.imageUrl }, ...(product.gallery || [])]

  const { isAuthenticated } = useAuthSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleLoginConfirm = () => {
    router.push(`${Routers.LOGIN}?redirect=${encodeURIComponent(pathname)}`)
  }

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    if (!selectedVariant && product.variants && product.variants.length > 0) {
      toast.error('Vui lòng chọn phân loại hàng (Size)')
      return
    }

    try {
      const response = await cartService.addToCart({
        productId: product.id,
        quantity,
        sizeId: selectedVariant!.sizeId,
      })

      if (response.data.success) {
        toast.success(response.data.message || 'Đã thêm vào giỏ hàng thành công')
        fetchCartCount()
      } else {
        toast.error(response.data.message || 'Thêm vào giỏ hàng thất bại')
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoginDialogOpen(true)
      } else {
        console.error('Add to cart error:', error)
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng')
      }
    }
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true)
      return
    }

    if (!selectedVariant && product.variants && product.variants.length > 0) {
      toast.error('Vui lòng chọn phân loại hàng (Size)')
      return
    }

    try {
      setIsBuyingNow(true)
      const response = await cartService.addToCart({
        productId: product.id,
        quantity,
        sizeId: selectedVariant!.sizeId,
      })

      if (response.data.success && response.data.data) {
        // Redirect to checkout with the specific item
        const itemId = response.data.data.id
        fetchCartCount()

        window.location.href = `/checkout?items=${itemId}`
        // Keep loading true while redirecting...
      } else {
        toast.error(response.data.message || 'Thêm vào giỏ hàng thất bại')
        setIsBuyingNow(false)
      }
    } catch (error: any) {
      setIsBuyingNow(false)
      if (error.response?.status === 401) {
        setIsLoginDialogOpen(true)
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
      }
    }
  }

  const maxStock = selectedVariant ? selectedVariant.quantity : product.stock || 0

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
      <LoadingOverlay visible={isBuyingNow} />

      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chưa đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng đăng nhập để tiếp tục mua sắm và thanh toán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginConfirm}>Đăng nhập ngay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Left: Product Images */}
      <div className='space-y-4'>
        <div className='relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border shadow-sm'>
          {selectedImage ? (
            <Image
              src={getImageUrl(selectedImage)}
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
        {/* Gallery Thumbnails */}
        {allImages.length > 1 && (
          <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
            {allImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={cn(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition-all',
                  selectedImage === img.url
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100',
                )}
              >
                <Image
                  src={getImageUrl(img.url)}
                  alt='Product thumbnail'
                  fill
                  className='object-cover'
                  sizes='80px'
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info & Actions */}
      <div className='space-y-8'>
        <div>
          <Badge variant='secondary' className='mb-3'>
            {typeof product.category === 'object' ? product.category?.name : product.category}
          </Badge>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>{product.name}</h1>
          <div className='flex items-center gap-4 mt-4'>
            <span className='text-3xl font-bold text-primary'>{formatCurrency(product.price)}</span>
            {maxStock > 0 ? (
              <Badge variant='outline' className='text-green-600 border-green-200 bg-green-50'>
                Còn hàng
              </Badge>
            ) : (
              <Badge variant='destructive'>Hết hàng</Badge>
            )}
          </div>
        </div>

        {/* Variants (Size) */}
        {product.variants && product.variants.length > 0 && (
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='font-semibold text-gray-900'>Kích thước (Size):</span>
              {product.sizeGuide && (
                <Button
                  variant='link'
                  className='text-primary px-0 h-auto'
                  onClick={() => window.open(getImageUrl(product.sizeGuide!.imageUrl), '_blank')}
                >
                  Hướng dẫn chọn size
                </Button>
              )}
            </div>
            <div className='flex flex-wrap gap-3'>
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant)
                    setQuantity(1) // Reset quantity when changing variant
                  }}
                  disabled={variant.quantity === 0}
                  className={cn(
                    'px-4 py-2 rounded-lg border font-medium transition-all relative',
                    selectedVariant?.id === variant.id
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-gray-200 hover:border-black text-gray-700',
                    variant.quantity === 0 &&
                      'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 hover:border-gray-200',
                  )}
                >
                  {variant.sizeName}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <p className='text-sm text-muted-foreground'>
                Kho: {selectedVariant.quantity} sản phẩm
              </p>
            )}
          </div>
        )}

        {/* Quantity */}
        <div className='space-y-4'>
          <span className='font-semibold text-gray-900'>Số lượng:</span>
          <div className='flex items-center gap-4'>
            <div className='flex items-center border rounded-lg'>
              <Button
                variant='ghost'
                size='icon'
                className='h-10 w-10 text-gray-600'
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className='h-4 w-4' />
              </Button>
              <span className='w-12 text-center font-medium'>{quantity}</span>
              <Button
                variant='ghost'
                size='icon'
                className='h-10 w-10 text-gray-600'
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                disabled={quantity >= maxStock}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          <Button
            className='flex-1 h-10 text-base font-semibold'
            onClick={handleAddToCart}
            disabled={maxStock === 0}
          >
            <ShoppingCart className='mr-2 h-5 w-5' />
            Thêm vào giỏ
          </Button>
          <Button
            variant='destructive' // or a custom 'buy' variant
            className='flex-1 h-10 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white'
            onClick={handleBuyNow}
            disabled={maxStock === 0}
          >
            Mua Ngay
          </Button>
        </div>

        {/* Description */}
        <div className='border-t pt-8'>
          <h3 className='font-semibold text-lg mb-4'>Mô tả chi tiết</h3>
          <div className='prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line'>
            {product.description}
          </div>
        </div>
      </div>

      {/* Reviews Section - Full Width Below */}
      <div className='md:col-span-2'>
        <ProductReviewsList productId={product.id} productName={product.name} />
      </div>
    </div>
  )
}
