'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardService } from '@/services/dashboard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Loader2 } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELED: 'Đã hủy',
}

export function OrderStatusChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-order-stats'],
    queryFn: dashboardService.getOrderStats,
  })

  // Transform Map/Object to Array for Recharts
  const byStatus = data?.data?.data?.byStatus || {}
  const chartData = Object.entries(byStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    originalStatus: status,
  }))

  // Sort to keep consistent colors if needed, or by value
  chartData.sort((a, b) => b.value - a.value)

  return (
    <Card className='col-span-1 lg:col-span-3'>
      <CardHeader>
        <CardTitle>Trạng thái đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='h-[300px] flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-slate-300' />
          </div>
        ) : chartData.length > 0 ? (
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={chartData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, 'Đơn hàng']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend verticalAlign='middle' align='right' layout='vertical' iconType='circle' />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className='h-[300px] flex items-center justify-center text-muted-foreground'>
            Chưa có n đơn hàng nào
          </div>
        )}
      </CardContent>
    </Card>
  )
}
