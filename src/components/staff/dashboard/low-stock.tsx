import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getImageUrl, cn } from '@/lib/utils'
import { LowStockResponse } from '@/services/dashboard'
import { Badge } from '@/components/ui/badge'

interface LowStockTableProps {
  products: LowStockResponse[]
}

export function LowStockTable({ products }: LowStockTableProps) {
  return (
    <Card className='shadow-sm border-slate-100 h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base text-slate-700 font-bold flex items-center gap-2'>
          ⚡ Sản phẩm sắp hết hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {products.map((product, idx) => (
            <div
              key={`${product.productId}-${product.sizeName}-${idx}`}
              className='flex items-center justify-between group p-2 hover:bg-slate-50/50 rounded-lg transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div className='relative w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0'>
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.productName}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform'
                  />
                </div>
                <div className='min-w-0'>
                  <div className='text-sm font-medium text-slate-900 truncate max-w-[150px]'>
                    {product.productName}
                  </div>
                  <div className='text-[11px] text-slate-500 font-medium'>
                    Kích thước: {product.sizeName}
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div
                  className={cn(
                    'text-sm font-bold',
                    product.stock <= 5 ? 'text-rose-600' : 'text-orange-600',
                  )}
                >
                  {product.stock}{' '}
                  <span className='text-[10px] font-normal text-slate-400 uppercase'>Tồn</span>
                </div>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-[10px] h-4 px-1',
                    product.stock <= 5
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-orange-50 text-orange-600 border-orange-100',
                  )}
                >
                  {product.stock <= 5 ? 'Cảnh báo' : 'Thấp'}
                </Badge>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className='py-8 text-center text-sm text-slate-400'>Tồn kho ổn định</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
