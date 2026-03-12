import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { Star, MessageSquare, Package } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className='flex items-center gap-1.5'>
      <div className='flex items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className='text-xs text-slate-500 font-medium'>
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
      <span className='text-xs text-slate-400'>({count})</span>
    </div>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const hasRating = (product.ratingAverage ?? 0) > 0
  const reviewCount = product.reviewCount ?? 0
  const stock = product.stock ?? 0

  return (
    <Link href={`/products/${product.id}`} className='block h-full group'>
      <Card className='h-full overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl border-slate-200 group-hover:border-primary/30 bg-white'>
        {/* Image */}
        <div className='relative aspect-square overflow-hidden bg-slate-100'>
          {product.imageUrl ? (
            <Image
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-110'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              unoptimized
            />
          ) : (
            <div className='flex h-full items-center justify-center text-slate-300'>No image</div>
          )}

          {/* Out of stock overlay */}
          {!product.isActive && (
            <div className='absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10'>
              <Badge variant='destructive' className='px-4 py-1 text-sm font-bold shadow-lg'>
                Hết hàng
              </Badge>
            </div>
          )}

          {/* Stock badge (top-right) */}
          {product.isActive && stock > 0 && stock <= 10 && (
            <div className='absolute top-2 right-2 z-10'>
              <Badge className='bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-md border-0'>
                Chỉ còn {stock}
              </Badge>
            </div>
          )}

          {/* Rating badge (bottom-left, on image) */}
          {hasRating && (
            <div className='absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md'>
              <Star className='w-3 h-3 fill-amber-400 text-amber-400' />
              <span className='text-xs font-bold'>{product.ratingAverage?.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className='flex-1 p-4 flex flex-col gap-2.5'>
          {/* Category */}
          <p className='text-[10px] font-bold text-primary uppercase tracking-[0.15em] opacity-70'>
            {typeof product.category === 'string' ? product.category : product.category?.name}
          </p>

          {/* Name */}
          <h3 className='font-bold text-base leading-snug text-slate-900 group-hover:text-primary transition-colors line-clamp-2'>
            {product.name}
          </h3>

          {/* Star rating row */}
          <StarRating rating={product.ratingAverage ?? 0} count={reviewCount} />

          {/* Info chips */}
          <div className='flex items-center gap-3 text-xs text-slate-400'>
            {reviewCount > 0 && (
              <span className='flex items-center gap-1'>
                <MessageSquare className='w-3 h-3' />
                {reviewCount} đánh giá
              </span>
            )}
            {stock > 0 && (
              <span className='flex items-center gap-1'>
                <Package className='w-3 h-3' />
                Kho: {stock}
              </span>
            )}
          </div>

          {/* Price — pushed to bottom */}
          <div className='mt-auto pt-3 border-t border-slate-100 flex items-center justify-between'>
            <span className='font-black text-xl text-slate-900'>
              {formatCurrency(product.price)}
            </span>
            <span className='text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              Xem →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
