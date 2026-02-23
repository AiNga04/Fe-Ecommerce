'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Printer,
  Package,
  User,
  MapPin,
  CreditCard,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileText,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

import { orderService } from '@/services/order'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getImageUrl } from '@/lib/utils'
import { shipmentService } from '@/services/shipment'
import { userService } from '@/services/user'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Status Definitions
const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'Chờ xác nhận', bg: 'bg-slate-100', text: 'text-slate-600' },
  CONFIRMED: { label: 'Đã xác nhận', bg: 'bg-blue-50', text: 'text-blue-600' },
  SHIPPING: { label: 'Đang giao hàng', bg: 'bg-purple-50', text: 'text-purple-600' },
  DELIVERED: { label: 'Đã giao hàng', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  CANCELED: { label: 'Đã hủy', bg: 'bg-red-50', text: 'text-red-600' },
}

const NEXT_STATUS_MAP: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: [],
  SHIPPING: [],
  DELIVERED: [],
  CANCELED: [],
}

const TimelineStep = ({
  icon: Icon,
  title,
  date,
  isCompleted,
  isCurrent,
  isCanceled,
  isLast = false,
}: any) => {
  let iconColor = 'text-slate-300'
  let bgColor = 'bg-slate-100'
  let textColor = 'text-slate-400'
  let lineColor = 'bg-slate-200'

  if (isCanceled) {
    iconColor = 'text-white'
    bgColor = 'bg-red-500'
    textColor = 'text-red-600'
    lineColor = 'bg-red-200'
  } else if (isCompleted) {
    iconColor = 'text-white'
    bgColor = 'bg-emerald-500'
    textColor = 'text-slate-900'
    lineColor = 'bg-emerald-500'
  } else if (isCurrent) {
    iconColor = 'text-white'
    bgColor = 'bg-slate-900'
    textColor = 'text-slate-900'
    lineColor = 'bg-slate-200'
  }

  return (
    <div className='flex gap-4 relative'>
      <div className='flex flex-col items-center'>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm ${bgColor} ${iconColor}`}
        >
          <Icon className='w-4 h-4' />
        </div>
        {!isLast && <div className={`w-0.5 h-full absolute top-8 left-4 -ml-px ${lineColor}`} />}
      </div>
      <div className='pb-8 pt-1'>
        <p className={`text-sm font-semibold ${textColor}`}>{title}</p>
        {date && (
          <p className='text-xs text-slate-500 mt-1'>
            {new Date(date).toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        )}
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const orderId = params.id as string

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => orderService.getAdminOrderById(orderId),
    enabled: !!orderId,
  })

  const order = orderData?.data?.data
  const [localStatus, setLocalStatus] = useState<string | null>(null)

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => orderService.updateOrderStatus(orderId, newStatus),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật trạng thái thành công')
      setLocalStatus(variables)
      // Update local cache optimistically
      queryClient.setQueryData(['admin-order', orderId], (old: any) => {
        if (!old?.data?.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: { ...old.data.data, status: variables },
          },
        }
      })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Cập nhật thất bại'
      toast.error(message)
    },
  })

  // State for Assign Shipper
  const [selectedShipperId, setSelectedShipperId] = useState<string>('')
  const [trackingCode, setTrackingCode] = useState<string>('')

  // Query for Shippers list (only fetch if order is unassigned)
  const isAssigned = !!order?.shippingCarrier || !!order?.shippingTrackingCode
  const { data: shippersData, isLoading: isLoadingShippers } = useQuery({
    queryKey: ['admin-shippers'],
    queryFn: () => userService.getShippers({ page: 0, size: 100 }),
    enabled: (localStatus || order?.status) === 'CONFIRMED' && !isAssigned,
  })

  const shippers = shippersData?.data?.data || []

  // Mutation for Assigning Shipper
  const assignShipperMutation = useMutation({
    mutationFn: () =>
      shipmentService.assignShipper(orderId, {
        shipperId: Number(selectedShipperId),
        carrierCode: trackingCode,
      }),
    onSuccess: () => {
      toast.success('Gán shipper thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Gán shipper thất bại'
      toast.error(message)
    },
  })

  const handleAssignShipper = () => {
    if (!selectedShipperId) return
    assignShipperMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <Loader2 className='w-8 h-8 animate-spin text-slate-300' />
      </div>
    )
  }

  if (!order) {
    return (
      <div className='text-center p-12 text-slate-500'>
        <p>Không tìm thấy đơn hàng</p>
        <Button variant='link' onClick={() => router.back()} className='mt-2'>
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const currentStatus = localStatus || order.status || 'PENDING'
  const allowedNextStatuses = NEXT_STATUS_MAP[currentStatus] || []
  const statusStyle = STATUS_STYLES[currentStatus] || STATUS_STYLES['PENDING']

  const handleStatusChange = (newStatus: string) => {
    if (!allowedNextStatuses.includes(newStatus)) {
      toast.error('Chuyển đổi trạng thái không hợp lệ!')
      return
    }
    updateStatusMutation.mutate(newStatus)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  // Determine timeline states
  const isCanceled = currentStatus === 'CANCELED' || currentStatus === 'cancelled'
  const isDelivered = currentStatus === 'DELIVERED'
  const isShipping = currentStatus === 'SHIPPING' || isDelivered
  const isConfirmed = currentStatus === 'CONFIRMED' || isShipping

  return (
    <div className='flex flex-col gap-6 w-full mx-auto pb-10'>
      {/* 1. HEADER */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-wrap'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full shrink-0 w-10 h-10 border-slate-200 shadow-sm'
            onClick={() => router.back()}
          >
            <ChevronLeft className='w-5 h-5 text-slate-600' />
          </Button>
          <div className='flex items-center gap-3 flex-wrap'>
            <h1 className='text-xl md:text-2xl font-bold tracking-tight text-slate-900'>
              Đơn hàng {order.code || `#${order.id}`}
            </h1>
            <Badge
              variant='outline'
              className={`rounded-full px-3 py-1 font-semibold uppercase ${statusStyle.bg} ${statusStyle.text} border-transparent`}
            >
              {statusStyle.label}
            </Badge>
          </div>
        </div>
        <div className='flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto'>
          <Button
            variant='outline'
            className='bg-white rounded-md shadow-sm flex-1 sm:flex-none justify-center'
            onClick={() => window.open(`/admin/orders/${orderId}/print`, '_blank')}
          >
            <Printer className='w-4 h-4 mr-2' />
            In hóa đơn
          </Button>
          <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={allowedNextStatuses.length === 0 || updateStatusMutation.isPending}
          >
            <SelectTrigger className='w-full sm:w-[180px] flex-1 sm:flex-none rounded-md bg-white shadow-sm font-medium'>
              <SelectValue placeholder='Cập nhật' />
            </SelectTrigger>
            <SelectContent className='rounded-md'>
              {/* Only show current status and allowed transitions */}
              <SelectItem value={currentStatus} disabled className='bg-slate-50 text-slate-500'>
                {STATUS_STYLES[currentStatus]?.label || currentStatus}
              </SelectItem>
              {allowedNextStatuses.map((st) => (
                <SelectItem key={st} value={st}>
                  {STATUS_STYLES[st]?.label || st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* LEFT COLUMN: 2. TIMELINE & 3. CUSTOMER/SHIPPING */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Order Timeline Card */}
          <Card className='rounded-xl shadow-sm border-slate-200'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <Clock className='w-5 h-5 text-slate-400' />
                Tiến trình đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='pt-2'>
                <TimelineStep
                  icon={FileText}
                  title='Đặt hàng thành công'
                  date={order.createdAt}
                  isCompleted={true}
                />
                {!isCanceled && (
                  <>
                    <TimelineStep
                      icon={CheckCircle2}
                      title='Đã xác nhận'
                      date={order.confirmedAt}
                      isCompleted={isConfirmed}
                      isCurrent={currentStatus === 'PENDING'}
                    />
                    <TimelineStep
                      icon={Truck}
                      title='Đang giao hàng'
                      date={order.shippedAt}
                      isCompleted={isShipping}
                      isCurrent={currentStatus === 'CONFIRMED'}
                    />
                    <TimelineStep
                      icon={Package}
                      title='Đã giao hàng'
                      date={order.deliveredAt}
                      isCompleted={isDelivered}
                      isCurrent={currentStatus === 'SHIPPING'}
                      isLast={true}
                    />
                  </>
                )}
                {isCanceled && (
                  <TimelineStep
                    icon={XCircle}
                    title='Đã hủy'
                    date={order.canceledAt}
                    isCanceled={true}
                    isCurrent={true}
                    isLast={true}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer & Shipping Section */}
          <Card className='rounded-xl shadow-sm border-slate-200'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <User className='w-5 h-5 text-slate-400' />
                Khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm space-y-1'>
              <p className='font-medium text-slate-900 text-base'>{order.shippingName}</p>
              <p className='text-slate-500 font-medium'>{order.shippingPhone}</p>
            </CardContent>
            <Separator />
            <CardHeader className='pb-4 pt-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <MapPin className='w-5 h-5 text-slate-400' />
                Giao hàng tới
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>
              <p className='text-slate-600 leading-relaxed'>{order.shippingAddress}</p>
              {order.shippingTrackingCode && (
                <div className='mt-3 p-3 bg-slate-50 rounded-md border border-slate-100'>
                  <p className='text-xs text-slate-500'>Mã vận đơn</p>
                  <p className='font-mono font-medium text-slate-900'>
                    {order.shippingTrackingCode}
                  </p>
                  {order.shippingCarrier && (
                    <p className='text-xs text-slate-500 mt-1'>Đơn vị: {order.shippingCarrier}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipment Assignment Card */}
          {(currentStatus === 'CONFIRMED' || isAssigned) && (
            <Card className='rounded-xl shadow-sm border-slate-200 mt-6'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-base font-semibold flex items-center gap-2'>
                  <Truck className='w-5 h-5 text-slate-400' />
                  Giao Vận
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAssigned ? (
                  <div className='space-y-3 text-sm'>
                    <div>
                      <p className='text-xs text-slate-500'>Trạng thái</p>
                      <Badge
                        variant='outline'
                        className='mt-1 bg-green-50 text-green-600 border-green-200'
                      >
                        Đã Gán Shipper
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='shipper-select'>Chọn Shipper</Label>
                      <Select
                        value={selectedShipperId}
                        onValueChange={setSelectedShipperId}
                        disabled={isLoadingShippers || assignShipperMutation.isPending}
                      >
                        <SelectTrigger id='shipper-select' className='w-full'>
                          <SelectValue
                            placeholder={isLoadingShippers ? 'Đang tải...' : 'Chọn shipper...'}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {shippers.map((s: any) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.firstName} {s.lastName} - {s.phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='tracking-code'>Mã vận đơn (nếu có)</Label>
                      <Input
                        id='tracking-code'
                        placeholder='Ví dụ: GHN-123456'
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        disabled={assignShipperMutation.isPending}
                      />
                    </div>
                    <Button
                      onClick={handleAssignShipper}
                      disabled={!selectedShipperId || assignShipperMutation.isPending}
                      className='w-full mt-2'
                    >
                      {assignShipperMutation.isPending ? (
                        <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      ) : null}
                      Xác nhận Gán
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: 4. ITEMS, 5. SUMMARY, 6. PAYMENT */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Items Table */}
          <Card className='rounded-xl shadow-sm border-slate-200 overflow-hidden'>
            <CardHeader className='bg-slate-50 border-b border-slate-100 py-4'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <Package className='w-5 h-5 text-slate-500' />
                Sản phẩm đã đặt ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <div className='divide-y divide-slate-100'>
              {order.items?.map((item: any) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className='p-4 flex flex-col sm:flex-row gap-4 sm:items-center'
                >
                  <div className='flex gap-4 items-start sm:items-center flex-1 min-w-0'>
                    {/* Thumbnail */}
                    <div className='h-20 w-20 shrink-0 rounded-md border border-slate-100 bg-slate-50 overflow-hidden relative'>
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.productName}
                          className='object-cover w-full h-full'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center text-slate-300'>
                          <ImageIcon className='w-6 h-6' />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-base font-semibold text-slate-900 truncate'>
                        {item.productName}
                      </h4>
                      <p className='text-sm text-slate-500 mt-0.5'>Kích cỡ: {item.size}</p>
                      <div className='flex items-center gap-4 mt-2 text-sm text-slate-600'>
                        <span className='font-medium text-slate-800'>
                          {formatCurrency(item.unitPrice || 0)}
                        </span>
                        <span className='text-slate-400'>x</span>
                        <span className='font-medium'>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  {/* Subtotal */}
                  <div className='text-left sm:text-right shrink-0 mt-2 sm:mt-0 pl-24 sm:pl-0'>
                    <p className='text-xs text-slate-500 sm:hidden mb-1'>Thành tiền</p>
                    <p className='font-bold text-slate-900 text-lg'>
                      {formatCurrency(item.subtotal || (item.unitPrice || 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className='grid grid-cols-1 gap-6'>
            {/* Payment Details Card */}
            <Card className='rounded-xl shadow-sm border-slate-200 h-fit'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-base font-semibold flex items-center gap-2'>
                  <CreditCard className='w-5 h-5 text-slate-400' />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-sm text-slate-500 mb-1'>Phương thức</p>
                  <p className='font-semibold text-slate-900'>
                    {order.paymentMethod === 'ONLINE'
                      ? 'Thanh toán Online'
                      : 'Thanh toán khi nhận hàng (COD)'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-slate-500 mb-1'>Trạng thái</p>
                  <Badge
                    variant='outline'
                    className={`rounded-md px-2 py-0.5 font-semibold uppercase border-transparent ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary Card */}
            <Card className='rounded-xl shadow-sm border-slate-200 h-fit'>
              <CardContent className='p-6 space-y-3'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-slate-500'>Tạm tính</span>
                  <span className='font-medium text-slate-900'>
                    {formatCurrency(
                      (order.totalPrice || 0) -
                        (order.shippingFee || 0) +
                        (order.discountAmount || 0) +
                        (order.shippingDiscount || 0),
                    )}
                  </span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-slate-500'>Phí vận chuyển</span>
                  <span className='font-medium text-slate-900'>
                    {formatCurrency(order.shippingFee || 0)}
                  </span>
                </div>

                {order.shippingDiscount > 0 && (
                  <div className='flex justify-between items-center text-sm text-emerald-600'>
                    <span>Giảm giá vận chuyển</span>
                    <span className='font-medium'>-{formatCurrency(order.shippingDiscount)}</span>
                  </div>
                )}

                {order.discountAmount > 0 && (
                  <div className='flex justify-between items-center text-sm text-emerald-600'>
                    <div className='flex items-center gap-2'>
                      <span>Giảm giá đơn hàng</span>
                      {order.voucherCode && (
                        <Badge
                          variant='outline'
                          className='bg-emerald-50 border-emerald-200 text-xs px-1.5 py-0'
                        >
                          {order.voucherCode}
                        </Badge>
                      )}
                    </div>
                    <span className='font-medium'>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}

                <Separator className='my-3' />

                <div className='flex justify-between items-center'>
                  <span className='text-base font-semibold text-slate-900'>Tổng cộng</span>
                  <span className='text-2xl font-bold text-slate-900'>
                    {formatCurrency(order.totalPrice || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
