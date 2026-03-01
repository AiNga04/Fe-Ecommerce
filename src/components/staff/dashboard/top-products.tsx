import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { TopProductResponse } from '@/services/dashboard'

interface TopProductsTableProps {
  products: TopProductResponse[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <Card className='shadow-sm border-slate-100'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold text-slate-700'>Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {products.map((product) => (
            <div key={product.productId} className='flex items-center justify-between group'>
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
                  <div className='text-xs text-slate-500'>Đã bán: {product.totalSold}</div>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-bold text-slate-900'>
                  {formatCurrency(product.totalRevenue)}
                </div>
                <div className='text-[10px] uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded'>
                  Doanh thu
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className='py-8 text-center text-sm text-slate-400'>Chưa có dữ liệu thống kê</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
