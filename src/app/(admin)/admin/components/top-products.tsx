'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardService } from '@/services/dashboard'
import { Loader2, PackageOpen } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

export function TopProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-top-products'],
    queryFn: () => dashboardService.getTopSellingProducts(5),
  })

  // Theo kiểu dữ liệu đã định nghĩa trong service: totalSold đổi lại thành cấu trúc backend trả về nếu cần, tạm thời dùng như cũ
  const products = data?.data?.data || []

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <CardTitle>Top sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : products.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-lg'>
            <PackageOpen className='h-12 w-12 mb-3 text-slate-300' strokeWidth={1.5} />
            <p className='text-sm font-medium'>Chưa có thống kê sản phẩm</p>
            <p className='text-xs mt-1 text-slate-400 max-w-[250px] text-center'>
              Hệ thống sẽ cập nhật danh sách này khi có các đơn hàng được giao thành công.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {products.map((product, index) => (
              <div
                key={product.productId}
                className='flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0'
              >
                <div className='text-sm font-bold w-6 text-center shrink-0'>
                  {index === 0 ? (
                    <span className='text-amber-500 text-lg'>#1</span>
                  ) : index === 1 ? (
                    <span className='text-slate-400 text-lg'>#2</span>
                  ) : index === 2 ? (
                    <span className='text-amber-700 text-lg'>#3</span>
                  ) : (
                    <span className='text-slate-300'>#{index + 1}</span>
                  )}
                </div>
                <div className='h-10 w-10 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200'>
                  {product.imageUrl && (
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name || product.productName}
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>
                <div className='flex-1 space-y-1 min-w-0'>
                  <p
                    className='text-sm font-semibold leading-none truncate text-slate-800'
                    title={product.name || product.productName}
                  >
                    {product.name || product.productName}
                  </p>
                  <p className='text-xs text-slate-500'>
                    Đã bán:{' '}
                    <span className='font-medium text-slate-900'>
                      {product.soldQuantity || product.totalSold || 0}
                    </span>
                  </p>
                </div>
                <div className='text-right shrink-0'>
                  <div className='font-bold text-sm text-slate-800'>
                    {((product.totalRevenue as unknown as number) || 0).toLocaleString('vi-VN')} ₫
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
