import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, getImageUrl } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className='h-full overflow-hidden flex flex-col transition-all hover:shadow-lg'>
      <div className='relative aspect-square overflow-hidden bg-gray-100'>
        {product.imageUrl ? (
          <Image
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            fill
            className='object-cover transition-transform hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            unoptimized
          />
        ) : (
          <div className='flex h-full items-center justify-center text-gray-400'>No image</div>
        )}
        {!product.isActive && (
          <div className='absolute inset-0 bg-white/60 flex items-center justify-center'>
            <Badge variant='destructive'>Hết hàng</Badge>
          </div>
        )}
      </div>
      <CardContent className='flex-1 p-4'>
        <div className='space-y-2'>
          <p className='text-xs text-muted-foreground uppercase tracking-wider'>
            {product.category}
          </p>
          <Link href={`/products/${product.id}`}>
            <h3 className='font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2'>
              {product.name}
            </h3>
          </Link>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-lg text-primary'>{formatCurrency(product.price)}</span>
          </div>
          {product.description && (
            <p className='text-sm text-muted-foreground line-clamp-2'>{product.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button className='w-full' asChild variant='outline'>
          <Link href={`/products/${product.id}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
