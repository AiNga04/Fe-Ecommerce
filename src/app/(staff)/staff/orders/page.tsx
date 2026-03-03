'use client'

import React, { useEffect, useState } from 'react'
import { orderService } from '@/services/order'
import { Order } from '@/types/order'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { Search, Filter, Eye, MoreHorizontal, Truck, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { LoadingOverlay } from '@/components/common/loading-overlay'

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Đang giao hàng', value: 'SHIPPING' },
  { label: 'Đã giao hàng', value: 'DELIVERED' },
  { label: 'Đã hủy', value: 'CANCELED' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
]

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(0)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // Note: Assuming backend supports basic order listing for staff
      // If not, we might need a dedicated staff order search endpoint
      const response = await orderService.getOrders({
        page,
        size: 10,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      })

      if (response.data.success) {
        // @ts-ignore
        setOrders(response.data.data || [])
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách đơn hàng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className='bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none'>
            Chờ xử lý
          </Badge>
        )
      case 'CONFIRMED':
        return (
          <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-100 border-none'>
            Đã xác nhận
          </Badge>
        )
      case 'SHIPPING':
        return (
          <Badge className='bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none'>
            Đang giao
          </Badge>
        )
      case 'DELIVERED':
        return (
          <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none'>
            Đã giao hàng
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge className='bg-green-100 text-green-700 hover:bg-green-100 border-none'>
            Hoàn thành
          </Badge>
        )
      case 'CANCELED':
        return (
          <Badge className='bg-rose-100 text-rose-700 hover:bg-rose-100 border-none'>Đã hủy</Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Quản lý Đơn hàng</h1>
          <p className='text-slate-500 text-sm'>
            Xử lý và theo dõi trạng thái đơn hàng của hệ thống
          </p>
        </div>
      </div>

      <Card className='shadow-sm border-slate-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                placeholder='Tìm theo mã đơn, tên khách...'
                className='pl-10'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full md:w-auto'>
              <Filter className='w-4 h-4 text-slate-500' />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full md:w-[180px]'>
                  <SelectValue placeholder='Trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && !orders.length ? (
            <div className='py-20 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='rounded-md border border-slate-100'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='w-[150px] font-bold'>Mã đơn hàng</TableHead>
                    <TableHead className='font-bold'>Ngày đặt</TableHead>
                    <TableHead className='font-bold'>Khách hàng</TableHead>
                    <TableHead className='font-bold text-right'>Tổng tiền</TableHead>
                    <TableHead className='font-bold'>Trạng thái</TableHead>
                    <TableHead className='w-[100px] text-right font-bold'>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className='hover:bg-slate-50/30 transition-colors'>
                      <TableCell className='font-medium text-blue-600'>#{order.code}</TableCell>
                      <TableCell className='text-slate-500'>
                        {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>{order.shippingName}</div>
                        <div className='text-xs text-slate-400'>{order.shippingPhone}</div>
                      </TableCell>
                      <TableCell className='text-right font-bold text-slate-900'>
                        {formatCurrency(order.totalPrice)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 hover:bg-slate-100 text-slate-500'
                        >
                          <Eye className='w-4 h-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!orders.length && (
                <div className='py-12 text-center text-slate-400'>Không tìm thấy đơn hàng nào</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
