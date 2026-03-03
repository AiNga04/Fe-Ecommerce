'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardService } from '@/services/dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface DailyOrdersChartProps {
  from?: string
  to?: string
}

/**
 * Biểu đồ biến động số lượng đơn hàng theo ngày
 * @description Hiển thị biểu đồ hình cột cho số lượng đơn hàng theo khoảng thời gian được chọn
 * @param {string} from Ngày bắt đầu định dạng YYYY-MM-DD
 * @param {string} to Ngày kết thúc định dạng YYYY-MM-DD
 */
export function DailyOrdersChart({ from, to }: DailyOrdersChartProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-daily-orders', from, to],
    queryFn: () => dashboardService.getDailyOrderStats(from, to),
    staleTime: 5 * 60 * 1000,
  })

  // Trích xuất thống kê đơn hàng từ response
  const dailyStats = data?.data?.data || []

  // Xử lý dữ liệu đồ thị: định dạng lại ngày tháng
  const chartData = dailyStats.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'dd/MM'),
    orderCount: item.orderCount,
  }))

  return (
    <Card className='col-span-4 overflow-hidden border-none shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
          <div className='w-3 h-6 bg-blue-500 rounded-sm'></div>
          Biểu đồ số lượng đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className='pl-0 pt-4'>
        {isLoading ? (
          <div className='h-[350px] flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-400' />
          </div>
        ) : chartData.length > 0 ? (
          <div className='h-[350px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                <XAxis
                  dataKey='formattedDate'
                  stroke='#94a3b8'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke='#94a3b8'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickMargin={10}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} đơn`, 'Số lượng']}
                  labelFormatter={(label: any) => `Ngày ${label}`}
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backdropFilter: 'blur(4px)',
                  }}
                  itemStyle={{
                    color: '#3b82f6', // blue-500
                    fontWeight: 600,
                  }}
                />
                <Bar
                  dataKey='orderCount'
                  fill='#3b82f6' // text-blue-500
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill='#3b82f6' // You could add gradient or logic to change color if needed
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className='h-[350px] flex items-center justify-center text-slate-400 bg-slate-50/50 rounded-lg mx-6'>
            Chưa có đơn hàng nào trong thời gian này
          </div>
        )}
      </CardContent>
    </Card>
  )
}
