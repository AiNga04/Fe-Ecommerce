'use client'

import React, { useEffect, useState } from 'react'
import {
  dashboardService,
  RevenueDashboardResponse,
  OrderStatResponse,
  UserStatResponse,
  TopProductResponse,
  LowStockResponse,
  DailyOrderStatResponse,
} from '@/services/dashboard'
import { DashboardStats } from '@/components/staff/dashboard/stats-cards'
import { RevenueChart } from '@/components/staff/dashboard/revenue-chart'
import { OrdersChart } from '@/components/staff/dashboard/orders-chart'
import { TopProductsTable } from '@/components/staff/dashboard/top-products'
import { LowStockTable } from '@/components/staff/dashboard/low-stock'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { toast } from 'sonner'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StaffDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [revenueData, setRevenueData] = useState<RevenueDashboardResponse | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStatResponse | null>(null)
  const [userStats, setUserStats] = useState<UserStatResponse | null>(null)
  const [topProducts, setTopProducts] = useState<TopProductResponse[]>([])
  const [lowStock, setLowStock] = useState<LowStockResponse[]>([])
  const [dailyOrders, setDailyOrders] = useState<DailyOrderStatResponse[]>([])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [revRes, orderRes, userRes, topRes, lowRes, dailyRes] = await Promise.all([
        dashboardService.getRevenueStats(),
        dashboardService.getOrderStats(),
        dashboardService.getUserStats(),
        dashboardService.getTopSellingProducts(5),
        dashboardService.getLowStockProducts(10),
        dashboardService.getDailyOrderStats(),
      ])

      if (revRes.data.success) setRevenueData(revRes.data.data || null)
      if (orderRes.data.success) setOrderStats(orderRes.data.data || null)
      if (userRes.data.success) setUserStats(userRes.data.data || null)
      if (topRes.data.success) setTopProducts(topRes.data.data || [])
      if (lowRes.data.success) setLowStock(lowRes.data.data || [])
      if (dailyRes.data.success) setDailyOrders(dailyRes.data.data || [])
    } catch (error) {
      console.error('Fetch dashboard error:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu thống kê')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading && !revenueData) {
    return <LoadingOverlay visible={true} />
  }

  return (
    <div className='p-6 space-y-8 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Bảng điều khiển</h1>
          <p className='text-slate-500 text-sm'>Tổng quan về hoạt động kinh doanh hôm nay</p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='text-slate-500 border-slate-200'
          onClick={fetchDashboardData}
          disabled={isLoading}
        >
          <RefreshCcw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Làm mới
        </Button>
      </div>

      <DashboardStats
        revenue={revenueData?.totalRevenue || 0}
        growthRate={revenueData?.growthRate || 0}
        totalOrders={orderStats?.totalOrders || 0}
        totalUsers={userStats?.totalUsers || 0}
        newUsersToday={userStats?.newUsersToday || 0}
        lowStockCount={lowStock.length}
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        <RevenueChart data={revenueData?.dailyStats || []} />
        <OrdersChart data={dailyOrders} />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <TopProductsTable products={topProducts} />
        <LowStockTable products={lowStock} />
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
