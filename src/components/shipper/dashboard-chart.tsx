'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ShipperChartData } from '@/services/shipment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardChartProps {
  data: ShipperChartData[]
}

export function DashboardChart({ data }: DashboardChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'dd/MM', { locale: vi }),
  }))

  return (
    <Card className='border-none shadow-sm'>
      <CardHeader>
        <CardTitle className='text-lg font-bold'>Hiệu suất giao hàng (7 ngày qua)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[350px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f3f4f6' />
              <XAxis
                dataKey='formattedDate'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign='top'
                align='right'
                iconType='circle'
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
              />
              <Bar
                name='Thành công'
                dataKey='deliveredCount'
                fill='#22c55e'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                name='Thất bại'
                dataKey='failedCount'
                fill='#ef4444'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                name='Hoàn hàng'
                dataKey='returnedCount'
                fill='#9ca3af'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
