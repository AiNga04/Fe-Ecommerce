'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardService } from '@/services/dashboard'
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getImageUrl } from '@/lib/utils'

export function TopProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-top-products'],
    queryFn: () => dashboardService.getTopProducts(5),
  })

  const products = data?.data?.data || []

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <CardTitle>Top sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-6 pt-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-10 w-10 rounded-md shrink-0' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-[200px]' />
                  <Skeleton className='h-3 w-[100px]' />
                </div>
                <div className='text-right shrink-0'>
                  <Skeleton className='h-4 w-[80px]' />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className='text-center text-sm text-muted-foreground py-8'>
            Chưa có dữ liệu bán hàng.
          </p>
        ) : (
          <div className='space-y-6'>
            {products.map((product, index) => (
              <div key={product.productId} className='flex items-center gap-4'>
                <div className='text-sm font-bold text-slate-400 w-4 text-center'>#{index + 1}</div>
                <div className='h-10 w-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200'>
                  {product.imageUrl && (
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>
                <div className='flex-1 space-y-1 min-w-0'>
                  <p className='text-sm font-medium leading-none truncate' title={product.name}>
                    {product.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Đã bán:{' '}
                    <span className='font-medium text-slate-900'>{product.soldQuantity}</span>
                  </p>
                </div>
                <div className='text-right shrink-0'>
                  <div className='font-bold text-sm'>
                    {product.totalRevenue.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
