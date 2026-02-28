'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardService } from '@/services/dashboard'
import { Loader2, AlertTriangle } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function LowStockAlerts() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => dashboardService.getLowStockProducts(10),
  })

  const products = data?.data?.data || []

  return (
    <Card className='col-span-1 lg:col-span-3 border-red-100 shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-red-600 flex items-center gap-2'>
          <AlertTriangle className='h-5 w-5' />
          Cảnh báo sắp hết hàng
        </CardTitle>
        <Badge variant='outline' className='text-red-500 border-red-200 bg-red-50'>
          {products.length} sản phẩm
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : products.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-green-600 font-medium'>Kho hàng ổn định</p>
            <p className='text-xs text-muted-foreground'>Không có sản phẩm nào dưới định mức.</p>
          </div>
        ) : (
          <div className='space-y-4 max-h-[300px] overflow-y-auto pr-2'>
            {products.map((product, index) => (
              <div
                key={`${product.productId}-${product.sizeName}`}
                className='flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100'
              >
                <div className='h-10 w-10 rounded-md bg-white overflow-hidden shrink-0 border border-slate-200'>
                  {product.imageUrl && (
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.productName}
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p
                    className='text-sm font-medium text-slate-800 truncate'
                    title={product.productName}
                  >
                    {product.productName}
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    <Badge
                      variant='secondary'
                      className='text-[10px] h-5 px-1 bg-white border border-slate-200'
                    >
                      {product.sizeName}
                    </Badge>
                    <span className='text-xs text-red-600 font-medium'>Còn: {product.stock}</span>
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
