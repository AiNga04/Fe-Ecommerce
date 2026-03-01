'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Banknote,
  TrendingUp,
  RotateCcw,
} from 'lucide-react'
import { shipmentService } from '@/services/shipment'
import { StatsCard } from '@/components/shipper/stats-card'
import { DashboardChart } from '@/components/shipper/dashboard-chart'
import { DateRangeFilter } from '@/components/shipper/date-range-filter'
import { Skeleton } from '@/components/ui/skeleton'

export default function ShipperDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  })

  const { data: statsRes, isLoading } = useQuery({
    queryKey: ['shipper-stats', dateRange?.from, dateRange?.to],
    queryFn: () =>
      shipmentService.getMyDashboardStats({
        from: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        to: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
  })

  const stats = statsRes?.data?.data

  if (isLoading) {
    return (
      <div className='space-y-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-10 w-full sm:w-64' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className='h-32 w-full' />
          ))}
        </div>
        <Skeleton className='h-[400px] w-full' />
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Thống kê của tôi</h2>
          <p className='text-sm text-muted-foreground'>
            Tổng quan hiệu suất giao hàng và thu nhập COD.
          </p>
        </div>
        <DateRangeFilter date={dateRange} setDate={setDateRange} />
      </div>

      {/* Hôm nay */}
      <section className='space-y-4'>
        <h3 className='text-xs font-bold uppercase tracking-widest text-orange-600 flex items-center gap-2'>
          <TrendingUp className='w-4 h-4' />
          Hôm nay
        </h3>
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 transition-all'>
          <StatsCard
            title='Đợi lấy'
            value={stats?.pendingPickups || 0}
            icon={Package}
            className='border-l-4 border-l-yellow-400'
            iconClassName='text-yellow-600'
          />
          <StatsCard
            title='Đang giao'
            value={stats?.inProgress || 0}
            icon={Truck}
            className='border-l-4 border-l-blue-400'
            iconClassName='text-blue-600'
          />
          <StatsCard
            title='Thành công'
            value={stats?.deliveredToday || 0}
            icon={CheckCircle2}
            className='border-l-4 border-l-green-400'
            iconClassName='text-green-600'
          />
          <StatsCard
            title='Thất bại'
            value={stats?.failedToday || 0}
            icon={XCircle}
            className='border-l-4 border-l-red-400'
            iconClassName='text-red-600'
          />
          <StatsCard
            title='COD'
            value={(stats?.codCollectedToday || 0).toLocaleString('vi-VN')}
            icon={Banknote}
            description='vùng tiền thu hộ'
            className='border-l-4 border-l-emerald-400 col-span-2 lg:col-span-1'
            iconClassName='text-emerald-600'
          />
        </div>
      </section>

      {/* Tổng quan & Biểu đồ */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          {stats?.chartData && <DashboardChart data={stats.chartData} />}
        </div>

        <div className='space-y-4'>
          <h3 className='text-xs font-bold uppercase tracking-widest text-slate-500'>
            Tổng từ trước đến nay
          </h3>
          <div className='grid grid-cols-1 gap-4'>
            <StatsCard
              title='Tổng thành công'
              value={stats?.totalDelivered || 0}
              icon={CheckCircle2}
              iconClassName='text-green-600'
            />
            <StatsCard
              title='Tổng thất bại'
              value={stats?.totalFailed || 0}
              icon={XCircle}
              iconClassName='text-red-600'
            />
            <StatsCard
              title='Tổng hoàn hàng'
              value={stats?.totalReturned || 0}
              icon={RotateCcw}
              iconClassName='text-slate-600'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
