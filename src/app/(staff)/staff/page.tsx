'use client'

import { DashboardStats } from './components/dashboard-stats'
import { OrderStatusChart } from './components/order-status-chart'
import { TopProducts } from './components/top-products'
import { LowStockAlerts } from './components/low-stock-alerts'
import { InventoryAuditLogs } from './components/inventory-audit-logs'

export default function StaffDashboard() {
  return (
    <div className='flex flex-col gap-6 pb-10 w-full'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>Tổng quan về hoạt động kho hàng và đơn hàng.</p>
      </div>

      <DashboardStats />

      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <OrderStatusChart />
        <TopProducts />
      </div>

      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <LowStockAlerts />
        <InventoryAuditLogs />
      </div>
    </div>
  )
}
