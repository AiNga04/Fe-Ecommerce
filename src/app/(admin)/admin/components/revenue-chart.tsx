'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardService } from '@/services/dashboard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export function RevenueChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-revenue-stats'], // Reuse same query key to share data
    queryFn: () => dashboardService.getRevenueStats(),
    staleTime: 5 * 60 * 1000,
  })

  const dailyStats = data?.data?.data?.dailyStats || []

  // Formatting date to DD/MM
  const chartData = dailyStats.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'dd/MM'),
    revenue: item.revenue,
  }))

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        {isLoading ? (
          <div className='h-[300px] flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-slate-300' />
          </div>
        ) : chartData.length > 0 ? (
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
                <XAxis
                  dataKey='formattedDate'
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: any) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: any) => [`${value.toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                  labelFormatter={(label: any) => `Ngày ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='revenue'
                  stroke='#0f172a'
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: '#0f172a' }}
                  dot={{ r: 4, fill: '#0f172a', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className='h-[300px] flex items-center justify-center text-muted-foreground'>
            Chưa có dữ liệu doanh thu
          </div>
        )}
      </CardContent>
    </Card>
  )
}
