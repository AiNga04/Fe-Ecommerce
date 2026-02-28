'use client'

import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Loader2, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function InventoryAuditLogs() {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory-audit-logs'],
    queryFn: () => productService.getInventoryAuditLogs({ page: 0, size: 10 }),
  })

  const logs = data?.data?.data || []

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <CardTitle>Lịch sử kho hàng</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-6 pt-4'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between border-b pb-4 last:border-0 last:pb-0'
              >
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-8 w-8 rounded-full shrink-0' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-[160px]' />
                    <Skeleton className='h-3 w-[120px]' />
                  </div>
                </div>
                <div className='text-right space-y-2'>
                  <Skeleton className='h-4 w-[60px] ml-auto' />
                  <Skeleton className='h-3 w-[40px] ml-auto' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className='h-[350px] pr-4'>
            <div className='space-y-6'>
              {logs.length === 0 ? (
                <p className='text-center text-sm text-muted-foreground'>
                  Chưa có hoạt động kho nào.
                </p>
              ) : (
                logs.map((log) => {
                  const isIncrease = log.newStock > log.oldStock
                  const diff = log.newStock - log.oldStock

                  return (
                    <div
                      key={log.id}
                      className='flex items-center justify-between border-b pb-4 last:border-0 last:pb-0'
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`p-2 rounded-full ${isIncrease ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                        >
                          {isIncrease ? (
                            <ArrowUpRight className='h-4 w-4' />
                          ) : (
                            <ArrowDownRight className='h-4 w-4' />
                          )}
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium leading-none flex items-center gap-2'>
                            {log.productName}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {log.reason} •{' '}
                            <span className='text-slate-500'>bởi {log.changedByUserName}</span>
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div
                          className={`font-bold text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {isIncrease ? '+' : ''}
                          {diff}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {log.oldStock} → {log.newStock}
                        </div>
                        <div className='text-[10px] text-slate-400 mt-1'>
                          {format(new Date(log.changedAt), 'dd/MM/yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
