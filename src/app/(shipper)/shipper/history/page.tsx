'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  History,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCcw,
  Table as TableIcon,
} from 'lucide-react'
import { shipmentService } from '@/services/shipment'
import { ShipmentStatusBadge } from '@/components/shipper/shipment-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { ShipmentStatus } from '@/constants/enum/shipment-status'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { format } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ShipmentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusTab, setStatusTab] = useState<string>('ALL')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const {
    data: historyRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['my-history', statusTab, page, pageSize],
    queryFn: () =>
      shipmentService.getMyHistory({
        page,
        size: pageSize,
        status: statusTab === 'ALL' ? undefined : (statusTab as ShipmentStatus),
      }),
  })

  const shipments = historyRes?.data?.data || []
  const totalPages = historyRes?.data?.pagination?.totalPages || 0

  const filteredShipments = shipments.filter(
    (s) =>
      s.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shippingName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTabChange = (newStatus: string) => {
    setStatusTab(newStatus)
    setPage(0)
  }

  const renderStatusButton = (value: string, label: string, icon?: React.ReactNode) => {
    const isActive = statusTab === value
    return (
      <Button
        variant='ghost'
        size='sm'
        onClick={() => handleTabChange(value)}
        className={cn(
          'gap-2 h-9 px-4 transition-all duration-200 font-bold text-xs rounded-lg border shrink-0',
          isActive
            ? 'bg-[#ff4d00] text-white border-[#ff4d00] shadow-md hover:bg-[#e64500]'
            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
        )}
      >
        {icon}
        {label}
      </Button>
    )
  }

  if (isLoading && !shipments.length) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-10 w-64 rounded-xl' />
          <Skeleton className='h-10 w-48 rounded-xl' />
        </div>
        <Card className='border-slate-200 shadow-sm overflow-hidden rounded-xl'>
          <CardContent className='p-0'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='p-4 border-b border-slate-50 flex items-center gap-4'>
                <Skeleton className='h-12 w-12 rounded-lg' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-1/3' />
                  <Skeleton className='h-3 w-1/4' />
                </div>
                <Skeleton className='h-8 w-24 rounded-full' />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-[1600px] mx-auto'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6'>
        <div className='space-y-1'>
          <h2 className='text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3'>
            <div className='p-2 bg-orange-100 rounded-xl'>
              <History className='w-7 h-7 text-orange-600' />
            </div>
            Lịch sử giao hàng
          </h2>
          <p className='text-sm text-slate-500 font-medium ml-12'>
            Xem lại danh sách các đơn hàng đã xử lý trong quá khứ
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          {renderStatusButton('ALL', 'Tất cả')}
          {renderStatusButton(ShipmentStatus.DELIVERED, 'Giao thành công')}
          {renderStatusButton(ShipmentStatus.RETURNED, 'Đã trả hàng')}
          {renderStatusButton(ShipmentStatus.FAILED, 'Giao thất bại')}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm'>
        <div className='relative flex-1 group w-full'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors' />
          <Input
            placeholder='Tìm kiếm theo mã đơn, tên khách hàng...'
            className='pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl text-sm font-medium'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant='outline'
          size='icon'
          className='hidden md:flex h-12 w-12 rounded-xl border-slate-200 shrink-0 text-slate-500 hover:text-orange-600 hover:border-orange-200 transition-all'
          onClick={() => refetch()}
        >
          <RefreshCcw className='w-5 h-5' />
        </Button>
      </div>

      {/* Data Table Content */}
      <Card className='shadow-lg border-slate-200 overflow-hidden rounded-2xl bg-white'>
        <CardContent className='p-0'>
          <div className='overflow-x-auto overflow-y-visible'>
            <Table>
              <TableHeader className='bg-slate-50/80 border-b border-slate-100'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='font-bold text-slate-500 uppercase text-xs tracking-wider py-5 pl-8'>
                    Mã đơn
                  </TableHead>
                  <TableHead className='font-bold text-slate-500 uppercase text-xs tracking-wider py-5'>
                    Khách hàng
                  </TableHead>
                  <TableHead className='font-bold text-slate-500 uppercase text-xs tracking-wider py-5'>
                    Địa chỉ giao hàng
                  </TableHead>
                  <TableHead className='font-bold text-slate-500 uppercase text-xs tracking-wider py-5 text-center'>
                    Trạng thái
                  </TableHead>
                  <TableHead className='font-bold text-slate-500 uppercase text-xs tracking-wider py-5'>
                    Ngày gán
                  </TableHead>
                  <TableHead className='text-right font-bold text-slate-500 uppercase text-xs tracking-wider py-5 pr-8'>
                    Chi tiết
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow
                    key={shipment.shipmentId}
                    className='hover:bg-slate-50 transition-colors border-b border-slate-50 group'
                  >
                    <TableCell className='py-4 pl-8'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-bold text-slate-900 text-sm'>
                          #{shipment.orderCode}
                        </span>
                        <span className='text-xs text-slate-400 font-bold uppercase tracking-tight'>
                          ID: {shipment.shipmentId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-bold text-slate-800 text-sm'>
                          {shipment.shippingName}
                        </span>
                        <span className='text-xs text-slate-400 font-medium'>
                          {shipment.shippingPhone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-4 max-w-[300px]'>
                      <p className='text-sm text-slate-600 truncate'>{shipment.shippingAddress}</p>
                    </TableCell>
                    <TableCell className='py-4 text-center'>
                      <ShipmentStatusBadge
                        status={shipment.status}
                        className='px-2.5 py-0.5 text-xs font-bold'
                      />
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2 text-slate-500 text-sm font-medium'>
                        <Calendar className='w-3.5 h-3.5 text-slate-400' />
                        {shipment.assignedAt
                          ? format(new Date(shipment.assignedAt), 'dd/MM/yyyy')
                          : '--/--/----'}
                        <span className='text-slate-300 text-xs ml-1'>
                          {shipment.assignedAt
                            ? format(new Date(shipment.assignedAt), 'HH:mm')
                            : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right py-4 pr-8'>
                      <Button
                        variant='ghost'
                        size='icon'
                        asChild
                        className='h-8 w-8 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors'
                      >
                        <Link href={`/shipper/shipments/${shipment.shipmentId}`}>
                          <Eye className='w-4 h-4' />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredShipments.length === 0 && (
              <div className='py-32 text-center flex flex-col items-center justify-center text-slate-400'>
                <div className='p-4 bg-slate-50 rounded-full mb-4'>
                  <History className='w-12 h-12 opacity-20' />
                </div>
                <p className='text-lg font-bold text-slate-600'>Chưa có dữ liệu lịch sử</p>
                <p className='text-sm italic font-medium'>
                  Các đơn hàng đã hoàn tất sẽ xuất hiện tại đây.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Container */}
      <div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-4 px-2 py-4'>
        <div className='flex items-center gap-3 text-sm text-slate-500 font-medium'>
          <span>Hiển thị</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className='h-9 w-[80px] bg-white border-slate-200 rounded-lg shadow-sm font-bold'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {[5, 10, 20, 50].map((s) => (
                <SelectItem key={s} value={s.toString()} className='font-medium'>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className='hidden sm:inline'>đơn hàng mỗi trang</span>
        </div>

        {totalPages > 0 && (
          <div className='flex items-center gap-6'>
            <div className='text-sm font-bold text-slate-600'>
              Trang <span className='text-orange-600'>{page + 1}</span> / {totalPages}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className='h-9 px-4 rounded-xl border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all font-bold gap-2'
              >
                <ChevronLeft className='w-4 h-4' />
                Trước
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className='h-9 px-4 rounded-xl border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all font-bold gap-2'
              >
                Sau
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
