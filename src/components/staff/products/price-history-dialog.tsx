'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { productService } from '@/services/product'
import { PriceHistory } from '@/types/product'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { Loader2, TrendingUp, TrendingDown, Minus, History as HistoryIcon } from 'lucide-react'

interface PriceHistoryDialogProps {
  productId: number | null
  productName: string | null
  isOpen: boolean
  onClose: () => void
}

export function PriceHistoryDialog({
  productId,
  productName,
  isOpen,
  onClose,
}: PriceHistoryDialogProps) {
  const [data, setData] = useState<PriceHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && productId) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const res = await productService.getPriceHistory(productId)
          if (res.data.success) {
            setData(res.data.data || [])
          }
        } catch (error) {
          console.error('Fetch price history error:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [isOpen, productId])

  const getPriceChange = () => {
    if (data.length < 1) return null
    const latest = data[0].newPrice
    const previous = data[0].oldPrice
    if (previous === 0) return null
    const diff = latest - previous
    const percent = (diff / previous) * 100
    return {
      diff,
      percent: percent.toFixed(1),
      isIncrease: diff > 0,
    }
  }

  const priceChange = getPriceChange()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-hidden p-0 gap-0 bg-white border-none shadow-2xl rounded-2xl'>
        {/* Modern Dark Header */}
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden shrink-0'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <HistoryIcon className='h-32 w-32 -mr-8 -mt-8' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
              Lịch sử giá
            </DialogTitle>
            <div className='flex items-center gap-2 mt-1'>
              <span className='bg-blue-600 text-xs px-2 py-0.5 rounded text-white font-medium'>
                {productName}
              </span>
              <span className='text-slate-300 text-sm'>
                Theo dõi biến động và lịch sử giá sản phẩm
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='h-[400px] flex items-center justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
          </div>
        ) : data.length > 0 ? (
          <div className='p-6 space-y-6'>
            {priceChange && (
              <div className='flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100'>
                <div className='flex flex-col'>
                  <span className='text-xs text-slate-500 font-medium uppercase tracking-wider'>
                    Biến động gần nhất
                  </span>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-2xl font-bold text-slate-900'>
                      {formatCurrency(Math.abs(priceChange.diff))}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${priceChange.isIncrease ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}
                    >
                      {priceChange.isIncrease ? (
                        <TrendingUp className='w-3 h-3' />
                      ) : (
                        <TrendingDown className='w-3 h-3' />
                      )}
                      {priceChange.percent}%
                    </div>
                  </div>
                </div>
                <div className='ml-auto h-12 w-1 bg-slate-200 rounded-full' />
                <div className='flex flex-col'>
                  <span className='text-xs text-slate-500 font-medium uppercase tracking-wider'>
                    Giá hiện tại
                  </span>
                  <span className='text-2xl font-bold text-blue-600 mt-1'>
                    {formatCurrency(data[0].newPrice)}
                  </span>
                </div>
              </div>
            )}

            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={[...data].reverse()}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                  <XAxis
                    dataKey='changedAt'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickFormatter={(val) => format(new Date(val), 'dd/MM')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f1f5f9',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: number | string | undefined) => [
                      formatCurrency(Number(val) || 0),
                      'Giá',
                    ]}
                    labelFormatter={(label) => format(new Date(label), 'dd/MM/yyyy HH:mm')}
                  />
                  <Line
                    type='stepAfter'
                    dataKey='newPrice'
                    stroke='#2563eb'
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className='overflow-hidden rounded-lg border border-slate-100'>
              <table className='w-full text-sm text-left'>
                <thead className='bg-slate-50 text-slate-500 font-medium'>
                  <tr>
                    <th className='px-4 py-2'>Ngày cập nhật</th>
                    <th className='px-4 py-2 text-right'>Giá cũ</th>
                    <th className='px-4 py-2 text-right'>Giá mới</th>
                    <th className='px-4 py-2 text-right'>Người thực hiện</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                  {data.map((item, idx) => (
                    <tr key={idx} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-4 py-2 font-medium'>
                        {format(new Date(item.changedAt), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className='px-4 py-2 text-right text-slate-500'>
                        {formatCurrency(item.oldPrice)}
                      </td>
                      <td className='px-4 py-2 text-right font-bold text-slate-900'>
                        {formatCurrency(item.newPrice)}
                      </td>
                      <td className='px-4 py-2 text-right text-xs text-slate-500'>
                        {item.changedBy || 'Hệ thống'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='h-[200px] flex items-center justify-center text-slate-400'>
            Chưa có dữ liệu lịch sử giá
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
