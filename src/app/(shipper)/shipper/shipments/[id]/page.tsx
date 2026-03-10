'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Copy,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  ExternalLink,
  ClipboardCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { shipmentService } from '@/services/shipment'
import { ShipmentStatusBadge } from '@/components/shipper/shipment-status-badge'
import { ShipmentActions } from '@/components/shipper/shipment-actions'
import { ShipmentTimeline } from '@/components/shipper/shipment-timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShipmentStatus } from '@/constants/enum/shipment-status'

export default function ShipmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const shipmentId = Number(id)

  const {
    data: shipmentRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['shipment', shipmentId],
    queryFn: () => shipmentService.getMyShipmentById(shipmentId),
  })

  const shipment = shipmentRes?.data?.data

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã sao chép ${label}`)
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-10 w-32' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <Skeleton className='h-64 w-full' />
            <Skeleton className='h-48 w-full' />
          </div>
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    )
  }

  if (!shipment)
    return (
      <div className='py-20 text-center'>
        <p className='text-muted-foreground'>Không tìm thấy thông tin đơn giao hàng.</p>
        <Button variant='link' onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    )

  const timelineSteps = [
    { label: 'Gán Shipper', date: shipment.assignedAt, isCompleted: !!shipment.assignedAt },
    {
      label: 'Lấy hàng',
      date: shipment.pickedUpAt,
      isCompleted: !!shipment.pickedUpAt,
      isCurrent: shipment.status === ShipmentStatus.ASSIGNED,
    },
    {
      label: 'Giao hàng',
      date: shipment.deliveredAt,
      isCompleted:
        shipment.status === ShipmentStatus.DELIVERED || shipment.orderStatus === 'COMPLETED',
      isCurrent:
        shipment.status === ShipmentStatus.IN_DELIVERY ||
        shipment.status === ShipmentStatus.PICKED_UP,
    },
    {
      label: 'Hoàn thành',
      date: shipment.completedAt,
      isCompleted: shipment.orderStatus === 'COMPLETED',
      isCurrent: shipment.status === ShipmentStatus.DELIVERED,
    },
  ]

  return (
    <div className='space-y-6 pb-20'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={() => router.back()}>
          <ArrowLeft className='w-5 h-5' />
        </Button>
        <div>
          <div className='flex items-center gap-3'>
            <h2 className='text-xl font-bold'>#{shipment.orderCode}</h2>
            <ShipmentStatusBadge status={shipment.status} />
          </div>
          <p className='text-sm text-muted-foreground flex items-center gap-1 mt-1'>
            <ClipboardCheck className='w-3 h-3' />
            Vận đơn: {shipment.trackingCode}
          </p>
        </div>
      </div>

      {shipment.returnRequested && (
        <div className='p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-pulse'>
          <AlertTriangle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
          <div>
            <p className='text-sm font-bold text-red-900'>Khách hàng yêu cầu trả hàng</p>
            <p className='text-xs text-red-700 mt-0.5'>
              Vui lòng kiểm tra lại với tổng đài trước khi tiếp tục giao.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Customer Info */}
          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                Thông tin người nhận
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between group'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center'>
                    <User className='w-5 h-5 text-orange-600' />
                  </div>
                  <div>
                    <p className='font-bold text-gray-900'>{shipment.shippingName}</p>
                    <p className='text-sm text-gray-500'>Tên người nhận</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => copyToClipboard(shipment.shippingName, 'tên khách')}
                >
                  <Copy className='w-4 h-4 text-gray-400' />
                </Button>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center'>
                    <Phone className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-bold text-gray-900'>{shipment.shippingPhone}</p>
                    <p className='text-sm text-gray-500'>Số điện thoại</p>
                  </div>
                </div>
                <Button
                  asChild
                  variant='secondary'
                  className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                >
                  <a href={`tel:${shipment.shippingPhone}`}>
                    <Phone className='w-4 h-4 mr-2' />
                    Gọi điện
                  </a>
                </Button>
              </div>

              <div className='flex items-start justify-between'>
                <div className='flex gap-3'>
                  <div className='w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0'>
                    <MapPin className='w-5 h-5 text-emerald-600' />
                  </div>
                  <div>
                    <p className='font-bold text-gray-900 leading-tight'>
                      {shipment.shippingAddress}
                    </p>
                    <p className='text-sm text-gray-500 mt-1'>Địa chỉ giao hàng</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='shrink-0'
                  onClick={() => copyToClipboard(shipment.shippingAddress, 'địa chỉ')}
                >
                  <Copy className='w-4 h-4 text-gray-400' />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Footer for Mobile */}
          <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-20 lg:static lg:p-0 lg:bg-transparent lg:border-none'>
            <Card className='lg:border-none lg:shadow-md overflow-hidden'>
              <CardContent className='p-4'>
                <p className='text-xs font-bold text-gray-500 mb-3 uppercase flex items-center gap-2'>
                  Thao tác nhanh
                </p>
                <ShipmentActions
                  shipmentId={shipmentId}
                  status={shipment.status}
                  onSuccess={refetch}
                />
              </CardContent>
            </Card>
          </div>

          {/* Note Section */}
          {(shipment.note || shipment.attempts > 0) && (
            <Card className='border-none shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                  Ghi chú & Lịch sử giao
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                  <span className='text-sm text-gray-600'>Số lần giao hàng</span>
                  <span className='font-bold text-orange-600'>{shipment.attempts} lần</span>
                </div>
                {shipment.note && (
                  <div className='p-3 bg-red-50 text-red-700 rounded-lg'>
                    <p className='text-xs font-bold uppercase mb-1 opacity-70'>Ghi chú mới nhất:</p>
                    <p className='text-sm'>{shipment.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className='space-y-6'>
          <Card className='border-none shadow-sm bg-orange-600 text-white'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-bold uppercase tracking-widest text-orange-200'>
                Hành trình đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='bg-white p-6 rounded-xl shadow-inner'>
                <ShipmentTimeline steps={timelineSteps} />
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-bold uppercase text-muted-foreground'>
                Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100'>
                <div className='flex items-center gap-3'>
                  <Banknote className='w-5 h-5 text-emerald-600' />
                  <span className='text-sm font-medium text-emerald-900'>Tiền thu hộ (COD)</span>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-black text-emerald-700'>250.000đ</p>
                  <p className='text-[10px] text-emerald-600 font-bold uppercase'>
                    Thanh toán tại chỗ
                  </p>
                </div>
              </div>
              <p className='text-[10px] text-gray-400 mt-3 text-center'>
                * Vui lòng chỉ xác nhận đã giao khi nhận đủ tiền.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Banknote({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <rect width='20' height='12' x='2' y='6' rx='2' />
      <circle cx='12' cy='12' r='2' />
      <path d='M6 12h.01M18 12h.01' />
    </svg>
  )
}
