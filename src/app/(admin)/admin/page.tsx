'use client'

import { useState } from 'react'
import { subDays, formatISO } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DashboardStats } from './components/dashboard-stats'
import { RevenueChart } from './components/revenue-chart'
import { DailyOrdersChart } from './components/daily-orders-chart'
import { OrderStatusChart } from './components/order-status-chart'
import { TopProducts } from './components/top-products'
import { LowStockAlerts } from './components/low-stock-alerts'
import { PriceChanges } from './components/price-changes'
import { UserAuditLogs } from './components/user-audit-logs'
import { InventoryAuditLogs } from './components/inventory-audit-logs'
import { DateRangeFilter } from '@/components/shipper/date-range-filter'

/**
 * Trang Dashboard chính của Admin
 * @description Hiển thị tổng quan các số liệu thống kê (doanh thu, đơn hàng, kho hàng...)
 */
export default function AdminDashboard() {
  const today = new Date()

  // State quản lý khoảng thời gian (DatePicker Range)
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today,
  })

  // Định dạng lại ngày để truyền API (Mặc định lấy ngày hôm nay nếu người dùng xóa trắng DatePicker)
  const safeFrom = date?.from || today
  const safeTo = date?.to || today

  const fromIso = formatISO(safeFrom, { representation: 'date' })
  const toIso = formatISO(safeTo, { representation: 'date' })

  return (
    <div className='flex flex-col gap-6 pb-10'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Tổng quan về tình hình kinh doanh và hoạt động của hệ thống.
          </p>
        </div>

        {/* Bộ chọn thời gian (DateRangePicker) */}
        <div className='flex items-center gap-2'>
          <DateRangeFilter
            date={date}
            setDate={setDate}
            className='w-full sm:w-auto min-w-[300px]'
          />
        </div>
      </div>

      {/* Row 1: Thẻ KPI thống kê tổng quan */}
      <DashboardStats from={fromIso} to={toIso} />

      {/* Row 2: Biểu đồ doanh thu & Biểu đồ Đơn hàng (2 cột bằng nhau) */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
        <div className='col-span-1'>
          <RevenueChart from={fromIso} to={toIso} />
        </div>
        <div className='col-span-1'>
          <DailyOrdersChart from={fromIso} to={toIso} />
        </div>
      </div>

      {/* Row 3: Biểu đồ trạng thái đơn hàng & Sản phẩm bán chạy */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <OrderStatusChart />
        <TopProducts />
      </div>

      {/* Row 4: Cảnh báo sắp hết hàng & Thay đổi giá */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <LowStockAlerts />
        <PriceChanges />
      </div>

      {/* Row 5: Nhật ký hoạt động (Audit Logs) */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7'>
        <InventoryAuditLogs />
        <UserAuditLogs />
      </div>
    </div>
  )
}
