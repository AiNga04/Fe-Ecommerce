'use client'

import { useQuery } from '@tanstack/react-query'
import { History, Search, Calendar, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { shipmentService } from '@/services/shipment'
import { ShipmentCard } from '@/components/shipper/shipment-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ShipmentStatus } from '@/constants/enum/shipment-status'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ShipmentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusTab, setStatusTab] = useState<string>('ALL')

  const { data: historyRes, isLoading } = useQuery({
    queryKey: ['my-history', statusTab],
    queryFn: () =>
      shipmentService.getMyHistory({
        page: 0,
        size: 50,
        status: statusTab === 'ALL' ? undefined : (statusTab as ShipmentStatus),
      }),
  })

  const shipments = historyRes?.data?.data || []

  const filteredShipments = shipments.filter(
    (s) =>
      s.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shippingName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-48' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-48 w-full' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold flex items-center gap-2'>
            <History className='w-6 h-6 text-slate-600' />
            Lịch sử giao hàng
          </h2>
          <p className='text-sm text-muted-foreground'>
            Bản ghi các đơn hàng đã hoàn thành hoặc thất bại.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Tìm mã đơn, tên...'
              className='pl-10 border-slate-200'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue='ALL' onValueChange={setStatusTab} className='w-full'>
        <TabsList className='grid grid-cols-4 w-full sm:w-auto bg-slate-100 p-1'>
          <TabsTrigger value='ALL' className='text-xs sm:text-sm px-4'>
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value={ShipmentStatus.DELIVERED}
            className='text-xs sm:text-sm px-4 text-green-600'
          >
            Thành công
          </TabsTrigger>
          <TabsTrigger
            value={ShipmentStatus.FAILED}
            className='text-xs sm:text-sm px-4 text-red-600'
          >
            Thất bại
          </TabsTrigger>
          <TabsTrigger
            value={ShipmentStatus.RETURNED}
            className='text-xs sm:text-sm px-4 text-slate-600'
          >
            Đã trả
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredShipments.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500'>
          {filteredShipments.map((shipment) => (
            <ShipmentCard key={shipment.shipmentId} shipment={shipment} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-200'>
          <History className='w-12 h-12 text-gray-200 mb-4' />
          <p className='text-gray-500 font-medium'>Chưa có dữ liệu lịch sử</p>
          <p className='text-gray-400 text-sm'>Các đơn hàng đã hoàn tất sẽ xuất hiện tại đây.</p>
        </div>
      )}
    </div>
  )
}
