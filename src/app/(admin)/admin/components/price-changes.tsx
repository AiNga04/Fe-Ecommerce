'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { productService } from '@/services/product'
import { Loader2, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import { format } from 'date-fns'

export function PriceChanges() {
  const { data, isLoading } = useQuery({
    queryKey: ['global-price-history'],
    queryFn: () => productService.getGlobalPriceHistory({ page: 0, size: 5 }),
  })

  const history = data?.data?.data || []

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <CardTitle>Biến động giá gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : history.length === 0 ? (
          <p className='text-center text-sm text-muted-foreground py-8'>
            Chưa có thay đổi giá nào.
          </p>
        ) : (
          <div className='space-y-4'>
            {history.map((record, index) => {
              const isIncrease = record.newPrice > record.oldPrice
              return (
                <div
                  key={index}
                  className='flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0'
                >
                  <div className='h-10 w-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200'>
                    {record.productImage && (
                      <img
                        src={getImageUrl(record.productImage)}
                        alt={record.productName}
                        className='h-full w-full object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate' title={record.productName}>
                      {record.productName}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <Clock className='h-3 w-3' />
                      {format(new Date(record.changedAt), 'dd/MM HH:mm')}
                      <span>•</span>
                      <span>{record.changedBy}</span>
                    </div>
                  </div>

                  <div className='text-right'>
                    <div
                      className={`flex items-center justify-end font-bold text-sm ${isIncrease ? 'text-green-600' : 'text-blue-600'}`}
                    >
                      {isIncrease ? (
                        <TrendingUp className='h-3 w-3 mr-1' />
                      ) : (
                        <TrendingDown className='h-3 w-3 mr-1' />
                      )}
                      {record.newPrice.toLocaleString()} ₫
                    </div>
                    <div className='text-xs text-muted-foreground line-through'>
                      {record.oldPrice.toLocaleString()} ₫
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
