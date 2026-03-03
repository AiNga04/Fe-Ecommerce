'use client'

import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartSeries {
  key: string
  name: string
  color: string
}

interface DashboardChartProps {
  title: string
  data: any[]
  series: ChartSeries[]
  type?: 'bar' | 'area'
  className?: string
  valueFormatter?: (value: number) => string
}

export function DashboardChart({
  title,
  data,
  series,
  type = 'bar',
  className,
  valueFormatter,
}: DashboardChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: item.date
      ? format(parseISO(item.date), 'dd/MM', { locale: vi })
      : item.label || '',
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 rounded-xl shadow-xl border-none text-xs font-medium'>
          <p className='text-slate-500 mb-2 border-b pb-1'>{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className='flex items-center gap-2 py-0.5'>
              <div className='w-2 h-2 rounded-full' style={{ backgroundColor: entry.color }} />
              <span className='text-slate-600'>{entry.name}:</span>
              <span className='font-bold text-slate-900'>
                {valueFormatter ? valueFormatter(entry.value) : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={cn('border-none shadow-sm overflow-hidden bg-white', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base sm:text-lg font-bold text-slate-800'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            {type === 'bar' ? (
              <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                <XAxis
                  dataKey='formattedDate'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend
                  verticalAlign='top'
                  align='right'
                  iconType='circle'
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 600 }}
                />
                {series.map((s) => (
                  <Bar
                    key={s.key}
                    name={s.name}
                    dataKey={s.key}
                    fill={s.color}
                    radius={[4, 4, 0, 0]}
                    barSize={formattedData.length > 10 ? 15 : 25}
                  />
                ))}
              </BarChart>
            ) : (
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {series.map((s) => (
                    <linearGradient
                      key={`grad-${s.key}`}
                      id={`grad-${s.key}`}
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor={s.color} stopOpacity={0.3} />
                      <stop offset='95%' stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                <XAxis
                  dataKey='formattedDate'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${(val / 1000000).toFixed(1)}M`
                      : val >= 1000
                        ? `${(val / 1000).toFixed(0)}k`
                        : val
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {series.map((s) => (
                  <Area
                    key={s.key}
                    type='monotone'
                    name={s.name}
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#grad-${s.key})`}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
