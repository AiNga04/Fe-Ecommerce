'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Search, RefreshCcw, Calendar, Eye, MapPin, Phone, User } from 'lucide-react'
import { shipmentService } from '@/services/shipment'
import { ShipmentStatusBadge } from '@/components/shipper/shipment-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
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
import { format } from 'date-fns'
import Link from 'next/link'

export default function ActiveShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: shipmentsRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['my-shipments'],
    queryFn: () => shipmentService.getMyShipments({ page: 0, size: 50 }),
  })

  const shipments = shipmentsRes?.data?.data || []

  const filteredShipments = shipments.filter(
    (s) =>
      s.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shippingName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading && !shipments.length) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-10 w-64 rounded-xl' />
          <Skeleton className='h-10 w-48 rounded-xl' />
        </div>
        <Card className='border-slate-200 shadow-sm overflow-hidden rounded-xl'>
          <CardContent className='p-0'>
            {[...Array(5)].map((_, i) => (
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
            Đơn đang giao
          </h2>
          <p className='text-sm text-slate-500 font-medium'>
            Quản lý các đơn hàng đang trong quá trình vận chuyển của bạn
          </p>
        </div>

        <Button
          variant='outline'
          size='icon'
          className='hidden md:flex h-10 w-10 border-slate-200 shrink-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all'
          onClick={() => refetch()}
        >
          <RefreshCcw className='w-4 h-4' />
        </Button>
      </div>

      {/* Search Bar */}
      <div className='bg-white p-4 rounded-lg border border-slate-200 shadow-sm'>
        <div className='relative group w-full'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
          <Input
            placeholder='Tìm kiếm mã đơn, tên khách hàng...'
            className='pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-md text-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table Content */}
      <Card className='shadow-sm border-slate-200 overflow-hidden rounded-lg bg-white'>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader className='bg-slate-50/80 border-b border-slate-100'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='text-slate-500 py-5 pl-8'>Đơn hàng</TableHead>
                  <TableHead className='text-slate-500 py-5'>Người nhận</TableHead>
                  <TableHead className='text-slate-500 py-5'>Địa chỉ</TableHead>
                  <TableHead className='text-slate-500 py-5 text-center'>Trạng thái</TableHead>
                  <TableHead className='text-slate-500 py-5'>Thời gian</TableHead>
                  <TableHead className='text-right text-slate-500 py-5 pr-8'>Hành động</TableHead>
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
                          Tracking: {shipment.trackingCode || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0'>
                          <User className='w-4 h-4 text-slate-500' />
                        </div>
                        <div className='flex flex-col gap-0.5'>
                          <span className='font-bold text-slate-800 text-sm'>
                            {shipment.shippingName}
                          </span>
                          <span className='flex items-center gap-1.5 text-xs text-slate-400 font-medium'>
                            <Phone className='w-3 h-3' />
                            {shipment.shippingPhone}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='py-4 max-w-[280px]'>
                      <div className='flex items-start gap-2'>
                        <MapPin className='w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0' />
                        <p className='text-sm text-slate-600 truncate'>
                          {shipment.shippingAddress}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className='py-4 text-center'>
                      <ShipmentStatusBadge
                        status={shipment.status}
                        className='px-2.5 py-0.5 text-xs font-bold'
                      />
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2 text-slate-600 text-sm font-bold'>
                          <Calendar className='w-3.5 h-3.5 text-slate-400' />
                          {shipment.assignedAt
                            ? format(new Date(shipment.assignedAt), 'dd/MM/yyyy')
                            : '--/--/----'}
                        </div>
                        <span className='text-xs text-slate-400 font-medium ml-5'>
                          {shipment.assignedAt
                            ? format(new Date(shipment.assignedAt), 'HH:mm')
                            : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right py-4 pr-8'>
                      <Button
                        size='sm'
                        asChild
                        className='bg-slate-900 hover:bg-slate-800 text-white h-8 px-4 shadow-sm transition-colors gap-2 text-xs'
                      >
                        <Link href={`/shipper/shipments/${shipment.shipmentId}`}>
                          <Eye className='w-3.5 h-3.5' />
                          Chi tiết
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredShipments.length === 0 && (
              <div className='py-32 text-center flex flex-col items-center justify-center text-slate-400'>
                <div className='p-5 bg-slate-50 rounded-full mb-4 ring-8 ring-slate-50/50'>
                  <Box className='w-12 h-12 opacity-20' />
                </div>
                <p className='text-lg font-bold text-slate-600'>Không tìm thấy đơn hàng nào</p>
                <p className='text-sm italic font-medium'>
                  Vui lòng kiểm tra lại bộ lọc hoặc tìm kiếm.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className='mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center gap-4'>
        <div className='p-3 bg-blue-600 rounded-md text-white'>
          <Box className='w-6 h-6' />
        </div>
        <div>
          <h4 className='text-orange-900 font-bold'>Giao hàng Pro</h4>
          <p className='text-orange-700/70 text-sm font-medium'>
            Nhấn "Chi tiết" để cập nhật trạng thái đơn hàng và ghi chú giao hàng.
          </p>
        </div>
      </div>
    </div>
  )
}
