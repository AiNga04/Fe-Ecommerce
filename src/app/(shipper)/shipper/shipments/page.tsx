'use client'

import { useQuery } from '@tanstack/react-query'
import { Box, Search, Filter } from 'lucide-react'
import { shipmentService } from '@/services/shipment'
import { ShipmentCard } from '@/components/shipper/shipment-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ActiveShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: shipmentsRes, isLoading } = useQuery({
    queryKey: ['my-shipments'],
    queryFn: () => shipmentService.getMyShipments({ page: 0, size: 50 }),
  })

  const shipments = shipmentsRes?.data?.data || []

  const filteredShipments = shipments.filter(
    (s) =>
      s.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shippingName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-10 w-48' />
        </div>
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
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold flex items-center gap-2'>
            <Box className='w-6 h-6 text-orange-600' />
            Đơn đang giao
          </h2>
          <p className='text-sm text-muted-foreground'>Danh sách các đơn hàng đã được phân công.</p>
        </div>

        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            placeholder='Tìm mã đơn, tên khách...'
            className='pl-10 border-orange-100 focus-visible:ring-orange-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredShipments.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          {filteredShipments.map((shipment) => (
            <ShipmentCard key={shipment.shipmentId} shipment={shipment} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-200'>
          <Box className='w-12 h-12 text-gray-200 mb-4' />
          <p className='text-gray-500 font-medium'>Không tìm thấy đơn hàng nào</p>
          <p className='text-gray-400 text-sm'>Vui lòng kiểm tra lại bộ lọc hoặc tìm kiếm.</p>
        </div>
      )}
    </div>
  )
}
