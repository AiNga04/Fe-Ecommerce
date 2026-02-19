'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, Users, AlertTriangle, Loader2 } from 'lucide-react'
import { dashboardService } from '@/services/dashboard'

export function DashboardStats() {
  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ['dashboard-revenue-stats'],
    queryFn: () => dashboardService.getRevenueStats(),
  })

  const { data: orderData, isLoading: loadingOrder } = useQuery({
    queryKey: ['dashboard-order-stats'],
    queryFn: dashboardService.getOrderStats,
  })

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['dashboard-user-stats'],
    queryFn: dashboardService.getUserStats,
  })

  const { data: lowStockData, isLoading: loadingLowStock } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => dashboardService.getLowStockProducts(10),
  })

  const revenue = revenueData?.data?.data
  const orders = orderData?.data?.data
  const users = userData?.data?.data
  const lowStockCount = lowStockData?.data?.data?.length || 0

  const stats = [
    {
      title: 'Tổng Doanh Thu',
      value: revenue?.totalRevenue?.toLocaleString('vi-VN') + ' ₫',
      icon: DollarSign,
      description: revenue?.growthRate
        ? `${revenue.growthRate > 0 ? '+' : ''}${revenue.growthRate}% so với kỳ trước`
        : 'Chưa có dữ liệu so sánh',
      trend: revenue?.growthRate,
    },
    {
      title: 'Tổng Đơn Hàng',
      value: orders?.totalOrders.toString(),
      icon: ShoppingCart,
      description: 'Đơn hàng trong hệ thống',
    },
    {
      title: 'Tổng User',
      value: users?.totalUsers.toString(),
      icon: Users,
      description: `${users?.newUsersToday || 0} user mới hôm nay`,
    },
    {
      title: 'Sắp Hết Hàng',
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      description: 'Sản phẩm cần nhập thêm',
      warning: lowStockCount > 0,
    },
  ]

  if (loadingRevenue || loadingOrder || loadingUser || loadingLowStock) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='h-32 flex items-center justify-center'>
            <Loader2 className='h-6 w-6 animate-spin text-slate-300' />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <Card key={index} className={stat.warning ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 ${stat.warning ? 'text-red-500' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.warning ? 'text-red-600' : ''}`}>
              {stat.value || '0'}
            </div>
            <p
              className={`text-xs ${
                stat.trend && stat.trend > 0
                  ? 'text-green-600'
                  : stat.trend && stat.trend < 0
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              }`}
            >
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
