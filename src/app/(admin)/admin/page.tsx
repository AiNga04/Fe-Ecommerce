'use client'

import { DashboardStats } from './components/dashboard-stats'
import { RevenueChart } from './components/revenue-chart'
import { OrderStatusChart } from './components/order-status-chart'
import { TopProducts } from './components/top-products'
import { LowStockAlerts } from './components/low-stock-alerts'
import { PriceChanges } from './components/price-changes'
import { UserAuditLogs } from './components/user-audit-logs'
import { InventoryAuditLogs } from './components/inventory-audit-logs'

export default function AdminDashboard() {
  return (
    <div className='flex flex-col gap-6 pb-10'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Tổng quan về tình hình kinh doanh và hoạt động của hệ thống.
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <DashboardStats />

      {/* Row 2: Revenue Chart (Full Width) */}
      <div className='grid grid-cols-1'>
        <RevenueChart />
      </div>

      {/* Row 3: Order Pie Chart + Top Products */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <OrderStatusChart />
        <TopProducts />
      </div>

      {/* Row 4: Low Stock + Price Changes */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <LowStockAlerts />
        <PriceChanges />
      </div>

      {/* Row 5: Audit Logs */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <InventoryAuditLogs />
        <UserAuditLogs />
      </div>
    </div>
  )
}
