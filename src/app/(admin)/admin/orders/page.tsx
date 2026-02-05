'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye } from 'lucide-react'
import { orderService } from '@/services/order'
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
import { Badge } from '@/components/ui/badge'

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getOrders(),
  })

  // Access data safely
  const orders = ordersData?.data?.data || []

  const getStatusBadgeVaraint = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'default' // variant name for badge usually: default, secondary, destructive, outline
      case 'PENDING':
      case 'PROCESSING':
        return 'secondary'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Đơn hàng</h1>
          <p className='text-muted-foreground'>Quản lý danh sách đơn hàng trong hệ thống</p>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input type='search' placeholder='Tìm kiếm mã đơn hàng...' className='pl-8' />
        </div>
      </div>

      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã Đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>#{order.id}</TableCell>
                  <TableCell>
                    {order.shippingName || 'N/A'}
                    <div className='text-xs text-muted-foreground'>{order.shippingPhone}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.totalPrice || 0)}
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVaraint(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon' asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className='h-4 w-4' />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
