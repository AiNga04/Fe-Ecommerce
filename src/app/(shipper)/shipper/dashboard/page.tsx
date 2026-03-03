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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Skeleton className='h-[400px] w-full' />
          <Skeleton className='h-[400px] w-full' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8 pb-10'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Dashboard</h2>
          <p className='text-sm text-slate-500 font-medium'>
            Tổng quan hiệu suất giao hàng và thu nhập COD cá nhân.
          </p>
        </div>
        <DateRangeFilter date={dateRange} setDate={setDateRange} />
      </div>

      {/* Hôm nay */}
      <section className='space-y-4'>
        <h3 className='text-xs font-bold uppercase tracking-widest text-orange-600 flex items-center gap-2 px-1'>
          <TrendingUp className='w-4 h-4' />
          Thống kê hôm nay
        </h3>
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 transition-all'>
          <StatsCard
            title='Đợi lấy'
            value={stats?.pendingPickups || 0}
            icon={Package}
            className='border-l-4 border-l-yellow-400'
            iconClassName='text-yellow-600 bg-yellow-50'
          />
          <StatsCard
            title='Đang giao'
            value={stats?.inProgress || 0}
            icon={Truck}
            className='border-l-4 border-l-blue-400'
            iconClassName='text-blue-600 bg-blue-50'
          />
          <StatsCard
            title='Thành công'
            value={stats?.deliveredToday || 0}
            icon={CheckCircle2}
            className='border-l-4 border-l-green-400'
            iconClassName='text-green-600 bg-green-50'
          />
          <StatsCard
            title='Thất bại'
            value={stats?.failedToday || 0}
            icon={XCircle}
            className='border-l-4 border-l-red-400'
            iconClassName='text-red-600 bg-red-50'
          />
          <StatsCard
            title='COD Hôm nay'
            value={(stats?.codCollectedToday || 0).toLocaleString('vi-VN') + ' đ'}
            icon={Banknote}
            description='Tiền thu hộ trong ngày'
            className='border-l-4 border-l-emerald-400 col-span-2 lg:col-span-1'
            iconClassName='text-emerald-600 bg-emerald-50'
          />
        </div>
      </section>

      {/* Biểu đồ cá nhân */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {stats?.chartData && (
          <>
            <DashboardChart
              title='Hiệu suất giao hàng'
              data={stats.chartData}
              type='bar'
              series={[
                { key: 'deliveredCount', name: 'Thành công', color: '#22c55e' },
                { key: 'failedCount', name: 'Thất bại', color: '#ef4444' },
                { key: 'returnedCount', name: 'Hoàn hàng', color: '#94a3b8' },
              ]}
            />
            <DashboardChart
              title='Tiền thu hộ (COD)'
              data={stats.chartData}
              type='area'
              series={[{ key: 'codCollected', name: 'Số tiền thu hộ', color: '#f59e0b' }]}
              valueFormatter={(val) => val.toLocaleString('vi-VN') + ' đ'}
            />
          </>
        )}
      </div>

      {/* Tổng quan dài hạn */}
      <section className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatsCard
          title='Tổng giao thành công'
          value={stats?.totalDelivered || 0}
          icon={CheckCircle2}
          iconClassName='text-green-600 bg-green-50'
          className='bg-slate-50/50'
        />
        <StatsCard
          title='Tổng giao thất bại'
          value={stats?.totalFailed || 0}
          icon={XCircle}
          iconClassName='text-red-600 bg-red-50'
          className='bg-slate-50/50'
        />
        <StatsCard
          title='Tổng đơn hoàn'
          value={stats?.totalReturned || 0}
          icon={RotateCcw}
          iconClassName='text-slate-600 bg-slate-100'
          className='bg-slate-50/50'
        />
      </section>
    </div>
  )
}
