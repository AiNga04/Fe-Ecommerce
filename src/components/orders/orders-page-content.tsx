'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, Filter, Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface OrdersPageContentProps {
  basePath: 'admin' | 'staff'
}

export function OrdersPageContent({ basePath }: OrdersPageContentProps) {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Fetch Orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', basePath, page, pageSize, statusFilter],
    queryFn: () =>
      orderService.getOrders({
        page,
        size: pageSize,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
  })

  // Access data safely
  const orders = ordersData?.data?.data || []
  const pagination = ordersData?.data?.pagination

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'default' // emerald/green usually
      case 'CONFIRMED':
        return 'default' // blue-ish
      case 'PENDING':
      case 'PROCESSING':
        return 'secondary' // yellow/orange
      case 'CANCELED':
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'SHIPPING':
        return 'Đang giao'
      case 'DELIVERED':
        return 'Đã giao'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'CANCELED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  // Status Badge Styles manually for better control if badge variant isn't enough
  const getBadgeClassName = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200'
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
      case 'CANCELED':
        return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className='flex flex-col gap-6 relative pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Đơn hàng</h1>
          <p className='text-muted-foreground'>Quản lý danh sách đơn hàng trong hệ thống</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm'>
        <div className='relative flex-1 w-full md:max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input type='search' placeholder='Tìm kiếm mã đơn, tên khách...' className='pl-8' />
        </div>

        <div className='flex items-center gap-2 w-full md:w-auto'>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val)
              setPage(0)
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <div className='flex items-center gap-2 text-slate-600'>
                <Filter className='h-3.5 w-3.5' />
                <SelectValue placeholder='Trạng thái' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
              <SelectItem value='PENDING'>Chờ xác nhận</SelectItem>
              <SelectItem value='CONFIRMED'>Đã xác nhận</SelectItem>
              <SelectItem value='SHIPPING'>Đang giao hàng</SelectItem>
              <SelectItem value='DELIVERED'>Đã giao hàng</SelectItem>
              <SelectItem value='CANCELED'>Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[180px]'>Mã Đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className='text-center'>Trạng thái</TableHead>
              <TableHead className='text-right'>Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center text-muted-foreground'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto mb-2' />
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center text-muted-foreground'>
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>
                    <div className='flex flex-col'>
                      <span className='text-slate-900 font-semibold'>{order.code}</span>
                      <span className='text-xs text-muted-foreground'>
                        {order.items?.length || 0} sản phẩm
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='font-medium text-slate-900'>{order.shippingName || 'N/A'}</div>
                    <div className='text-xs text-muted-foreground'>{order.shippingPhone}</div>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      {new Date(order.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {new Date(order.createdAt || Date.now()).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </TableCell>
                  <TableCell className='font-semibold text-slate-900'>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.totalPrice || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='font-normal text-xs whitespace-nowrap'>
                      {order.paymentMethod === 'ONLINE' ? 'Chuyển khoản' : 'COD'}
                    </Badge>
                    {order.paymentStatus === 'PAID' && (
                      <div className='text-[10px] text-emerald-600 font-medium mt-1 uppercase'>
                        Đã thanh toán
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      variant='secondary'
                      className={cn(
                        'font-medium shadow-none border',
                        getBadgeClassName(order.status),
                      )}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      asChild
                      className='h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                    >
                      <Link href={`/${basePath}/orders/${order.id}`}>
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

      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Hiển thị</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>đơn hàng mỗi trang</span>
        </div>

        {pagination && (
          <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end'>
            <div className='text-sm text-muted-foreground'>
              Trang {page + 1} / {pagination.totalPages || 1}
            </div>
            <Pagination className='justify-end w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 0) setPage(page - 1)
                    }}
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < (pagination.totalPages || 1) - 1) setPage(page + 1)
                    }}
                    className={
                      page >= (pagination.totalPages || 1) - 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
