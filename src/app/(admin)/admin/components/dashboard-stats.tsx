'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, Users, AlertTriangle, Loader2 } from 'lucide-react'
import { dashboardService } from '@/services/dashboard'

interface DashboardStatsProps {
  from?: string
  to?: string
}

/**
 * Các thẻ thống kê số liệu tổng quan (KPI)
 * @description Hiển thị tổng doanh thu, số đơn hàng, người dùng và tồn kho
 * @param {string} from Ngày bắt đầu định dạng YYYY-MM-DD
 * @param {string} to Ngày kết thúc định dạng YYYY-MM-DD
 */
export function DashboardStats({ from, to }: DashboardStatsProps) {
  // Lấy dữ liệu doanh thu (có lọc theo ngày)
  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ['dashboard-revenue-stats', from, to],
    queryFn: () => dashboardService.getRevenueStats(from, to),
  })

  // Lấy thống kê đơn hàng
  const { data: orderData, isLoading: loadingOrder } = useQuery({
    queryKey: ['dashboard-order-stats'],
    queryFn: dashboardService.getOrderStats,
  })

  // Lấy thống kê người dùng
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['dashboard-user-stats'],
    queryFn: dashboardService.getUserStats,
  })

  // Lấy danh sách sản phẩm sắp hết hàng (stock <= 10)
  const { data: lowStockData, isLoading: loadingLowStock } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => dashboardService.getLowStockProducts(10),
  })

  const revenue = revenueData?.data?.data
  const orders = orderData?.data?.data
  const users = userData?.data?.data
  const lowStockCount = lowStockData?.data?.data?.length || 0

  // Ánh xạ dữ liệu vào cấu trúc stats để hiển thị
  const stats = [
    {
      title: 'Tổng Doanh Thu',
      value: revenue?.totalRevenue?.toLocaleString('vi-VN') + ' ₫',
      icon: DollarSign,
      description: revenue?.growthRate
        ? `${revenue.growthRate > 0 ? '+' : ''}${revenue.growthRate}% so với kỳ trước`
        : 'Chưa có đủ dữ liệu so sánh',
      trend: revenue?.growthRate,
    },
    {
      title: 'Tổng Đơn Hàng',
      value: orders?.totalOrders.toString(),
      icon: ShoppingCart,
      description: 'Tổng số lượng đơn trên hệ thống',
    },
    {
      title: 'Tổng User',
      value: users?.totalUsers.toString(),
      icon: Users,
      description: `${users?.newUsersToday || 0} user đăng ký mới hôm nay`,
    },
    {
      title: 'Sắp Hết Hàng',
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      description: 'Số lượng sản phẩm cần bổ sung tồn kho',
      warning: lowStockCount > 0,
    },
  ]

  // Render Skeleton/Spinner khi đang tải dữ liệu
  if (loadingRevenue || loadingOrder || loadingUser || loadingLowStock) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='h-32 flex items-center justify-center border-none shadow-sm'>
            <Loader2 className='h-6 w-6 animate-spin text-slate-300' />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <Card key={index} className={`border-none shadow-sm ${stat.warning ? 'bg-red-50/50' : ''}`}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.warning ? 'bg-red-100' : 'bg-slate-100'}`}>
              <stat.icon
                className={`h-4 w-4 ${stat.warning ? 'text-red-500' : 'text-slate-500'}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stat.warning ? 'text-red-600' : 'text-slate-800'}`}
            >
              {stat.value || '0'}
            </div>
            <p
              className={`text-xs mt-1 ${
                stat.trend && stat.trend > 0
                  ? 'text-emerald-500 font-medium'
                  : stat.trend && stat.trend < 0
                    ? 'text-red-500 font-medium'
                    : 'text-slate-400'
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
