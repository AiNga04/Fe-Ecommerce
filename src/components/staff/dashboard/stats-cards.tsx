import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

function StatsCard({ title, value, icon, description, trend, className }: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden shadow-sm border-slate-100', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 bg-white/50'>
        <CardTitle className='text-sm font-medium text-slate-500'>{title}</CardTitle>
        <div className='p-2 rounded-lg bg-slate-50 text-slate-600'>{icon}</div>
      </CardHeader>
      <CardContent className='pt-2'>
        <div className='text-2xl font-bold text-slate-900'>{value}</div>
        {(description || trend) && (
          <p className='text-xs text-slate-400 mt-1 flex items-center gap-1'>
            {trend && (
              <span
                className={cn(
                  'flex items-center gap-0.5 font-medium',
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600',
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className='w-3 h-3' />
                ) : (
                  <TrendingDown className='w-3 h-3' />
                )}
                {trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  revenue: number
  growthRate: number
  totalOrders: number
  totalUsers: number
  newUsersToday: number
  lowStockCount: number
}

export function DashboardStats({
  revenue,
  growthRate,
  totalOrders,
  totalUsers,
  newUsersToday,
  lowStockCount,
}: DashboardStatsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <StatsCard
        title='Tổng doanh thu'
        value={formatCurrency(revenue)}
        icon={<DollarSign className='w-4 h-4' />}
        trend={{
          value: Math.abs(growthRate),
          isPositive: growthRate >= 0,
        }}
        description='so với tháng trước'
        className='bg-linear-to-br from-white to-blue-50/30'
      />
      <StatsCard
        title='Tổng đơn hàng'
        value={totalOrders}
        icon={<ShoppingBag className='w-4 h-4' />}
        description='Toàn bộ thời gian'
        className='bg-linear-to-br from-white to-orange-50/30'
      />
      <StatsCard
        title='Khách hàng'
        value={totalUsers}
        icon={<Users className='w-4 h-4' />}
        trend={{
          value: newUsersToday,
          isPositive: true,
        }}
        description='người dùng mới hôm nay'
        className='bg-linear-to-br from-white to-emerald-50/30'
      />
      <StatsCard
        title='Sắp hết hàng'
        value={lowStockCount}
        icon={<AlertTriangle className='w-4 h-4' />}
        description='Cần nhập kho ngay'
        className={cn(
          'bg-linear-to-br from-white to-rose-50/30',
          lowStockCount > 0 && 'border-rose-100 ring-1 ring-rose-50',
        )}
      />
    </div>
  )
}
