'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { shipmentService } from '@/services/shipment'
import type { ShipmentInfoResponse } from '@/types/shipment'
import { SHIPMENT_STATUS_LABEL, SHIPMENT_STATUS_STYLE } from '@/types/shipment'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Package,
  Truck,
  PackageOpen,
  Navigation,
  Loader2,
  ArrowRight,
  Clock,
  Banknote,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts'

import { formatCurrency } from '@/lib/utils'

export default function ShipperDashboard() {
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['shipper-dashboard-stats'],
    queryFn: () => shipmentService.getMyDashboardStats(),
  })

  const { data: shipmentsData, isLoading: isLoadingShipments } = useQuery({
    queryKey: ['my-shipments', 0, 10], // Fetch recent 10 for dashboard
    queryFn: () => shipmentService.getMyShipments({ page: 0, size: 10 }),
  })

  const shipments: ShipmentInfoResponse[] = shipmentsData?.data?.data || []
  const stats = statsData?.data?.data

  const totalDelivered = stats?.totalDelivered || 0
  const totalFailed = stats?.totalFailed || 0
  const totalReturned = stats?.totalReturned || 0
  const totalCompleted = totalDelivered + totalFailed + totalReturned
  const failureRate =
    totalCompleted > 0 ? (((totalFailed + totalReturned) / totalCompleted) * 100).toFixed(1) : '0'

  // Format chart data dates
  const formattedChartData =
    stats?.chartData?.map((item) => {
      const dateObj = new Date(item.date)
      return {
        ...item,
        shortDate: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`,
      }
    }) || []

  const statCards = [
    {
      title: 'Chờ lấy hàng',
      value: stats?.pendingPickups || 0,
      icon: Clock,
      bg: 'bg-slate-50',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
    {
      title: 'Đang giao',
      value: stats?.inProgress || 0,
      icon: Navigation,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Tiền COD (Hôm nay)',
      value: formatCurrency(Number(stats?.codCollectedToday || 0)),
      icon: Banknote,
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Tổng Đã Giao (Bao gồm lịch sử)',
      value: totalDelivered,
      subValue: `Tỷ lệ giao không thành công: ${failureRate}%`,
      icon: CheckCircle2,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      colSpan: 2,
    },
  ]

  return (
    <div className='flex flex-col gap-6 relative pb-10'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>Tổng quan đơn hàng cần giao</p>
        </div>
      </div>

      {isLoadingStats || isLoadingShipments ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-slate-300' />
        </div>
      ) : (
        <>
          {/* Block 1: Overview Metrics */}
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {statCards.map((stat, idx) => (
              <Card
                key={stat.title}
                className={cn(
                  'rounded-xl shadow-sm border-slate-200',
                  stat.bg,
                  stat.colSpan && `lg:col-span-${stat.colSpan}`,
                )}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className={cn('p-2 rounded-lg shrink-0', stat.iconBg)}>
                      <stat.icon className={cn('w-5 h-5', stat.iconColor)} />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='text-xl xl:text-2xl font-bold text-slate-900 truncate'>
                        {stat.value}
                      </p>
                      <p className='text-xs text-slate-600 truncate' title={stat.title}>
                        {stat.title}
                      </p>
                      {stat.subValue && (
                        <p className='text-[10px] text-slate-500 mt-0.5 truncate flex items-center gap-1'>
                          <AlertTriangle className='w-3 h-3 text-orange-500' />
                          {stat.subValue}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
            {/* Block 2: Delivery Stats Chart (7 days) */}
            <Card className='xl:col-span-2 rounded-xl shadow-sm border-slate-200'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-base font-semibold'>Thống Kê Giao Hàng</CardTitle>
                <p className='text-xs text-muted-foreground'>7 ngày gần nhất</p>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] w-full mt-4'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={formattedChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' />
                      <XAxis
                        dataKey='shortDate'
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <RechartsTooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Legend
                        iconType='circle'
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                      />
                      <Bar
                        name='Giao thành công'
                        dataKey='deliveredCount'
                        stackId='a'
                        fill='#10b981'
                        radius={[0, 0, 4, 4]}
                      />
                      <Bar name='Thất bại' dataKey='failedCount' stackId='a' fill='#ef4444' />
                      <Bar
                        name='Hoàn về kho'
                        dataKey='returnedCount'
                        stackId='a'
                        fill='#64748b'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Deliveries List Overlay */}
            <Card className='rounded-xl shadow-sm border-slate-200 flex flex-col h-full'>
              <CardHeader className='pb-4 flex flex-row items-center justify-between'>
                <CardTitle className='text-base font-semibold flex items-center gap-2'>
                  <Truck className='w-5 h-5 text-slate-400' />
                  Đơn cần xử lý
                </CardTitle>
                <Button
                  variant='ghost'
                  size='sm'
                  asChild
                  className='text-orange-600 hover:text-orange-700 -mr-2'
                >
                  <Link href='/shipper/deliveries'>
                    Tất cả <ArrowRight className='w-4 h-4 ml-1' />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className='flex-1 overflow-y-auto'>
                {shipments.length === 0 ? (
                  <div className='text-center py-12'>
                    <div className='bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100'>
                      <Package className='w-8 h-8 text-slate-300' />
                    </div>
                    <p className='text-sm text-slate-500'>Không có đơn nào cần xử lý</p>
                  </div>
                ) : (
                  <div className='divide-y divide-slate-100'>
                    {shipments.slice(0, 5).map((shipment) => {
                      const style = SHIPMENT_STATUS_STYLE[shipment.status]
                      const label = SHIPMENT_STATUS_LABEL[shipment.status]

                      return (
                        <div
                          key={shipment.shipmentId}
                          className='py-3 flex items-center justify-between gap-4 group'
                        >
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2'>
                              <span className='font-semibold text-sm text-slate-900 group-hover:text-orange-600 transition-colors'>
                                <Link href={`/shipper/deliveries/${shipment.shipmentId}`}>
                                  #{shipment.orderCode}
                                </Link>
                              </span>
                              <Badge
                                variant='outline'
                                className={cn(
                                  'text-[10px] font-medium px-1.5 py-0 h-5',
                                  style?.bg,
                                  style?.text,
                                  style?.border,
                                )}
                              >
                                {label}
                              </Badge>
                            </div>
                            <p className='text-xs text-slate-500 mt-1 truncate'>
                              {shipment.shippingName} • {shipment.shippingAddress}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Block 3: COD Revenue Chart */}
          <Card className='rounded-xl shadow-sm border-slate-200'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base font-semibold text-amber-600 flex items-center gap-2'>
                <Banknote className='w-5 h-5' />
                Doanh Thu Thu Hộ (COD)
              </CardTitle>
              <p className='text-xs text-muted-foreground'>7 ngày gần nhất</p>
            </CardHeader>
            <CardContent>
              <div className='h-[250px] w-full mt-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={formattedChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id='colorCod' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#f59e0b' stopOpacity={0.3} />
                        <stop offset='95%' stopColor='#f59e0b' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' />
                    <XAxis
                      dataKey='shortDate'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(value) => `${value / 1000000}tr`}
                    />
                    <RechartsTooltip
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Tiền COD']}
                      labelFormatter={(label) => `Ngày ${label}`}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='codCollected'
                      stroke='#f59e0b'
                      strokeWidth={3}
                      fillOpacity={1}
                      fill='url(#colorCod)'
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#d97706' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
