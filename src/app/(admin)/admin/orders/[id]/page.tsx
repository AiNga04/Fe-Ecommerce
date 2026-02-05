'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Package, User, MapPin, CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { orderService } from '@/services/order'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const orderId = params.id as string

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  })

  const order = orderData?.data?.data

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => orderService.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công')
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: () => toast.error('Cập nhật thất bại'),
  })

  if (isLoading) return <div className='p-8'>Đang tải chi tiết đơn hàng...</div>
  if (!order) return <div className='p-8'>Không tìm thấy đơn hàng</div>

  return (
    <div className='flex flex-col gap-6 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' asChild>
            <Link href='/admin/orders'>
              <ChevronLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Đơn hàng #{order.id}</h1>
            <p className='text-muted-foreground'>
              Ngày đặt: {new Date(order.createdAt || Date.now()).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Select
            defaultValue={order.status}
            onValueChange={(val) => updateStatusMutation.mutate(val)}
            disabled={updateStatusMutation.isPending}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='PENDING'>PENDING</SelectItem>
              <SelectItem value='PROCESSING'>PROCESSING</SelectItem>
              <SelectItem value='SHIPPING'>SHIPPING</SelectItem>
              <SelectItem value='DELIVERED'>DELIVERED</SelectItem>
              <SelectItem value='cancelled'>CANCELLED</SelectItem>
            </SelectContent>
          </Select>
          {/* Can add print invoice button here */}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' /> Sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {order.items?.map((item: any) => (
                  <div key={item.productId} className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='h-16 w-16 bg-muted rounded-md overflow-hidden relative'>
                        {/* Placeholder for api not returning image in order items yet */}
                        {item.image ? (
                          <img src={item.image} alt='' className='object-cover w-full h-full' />
                        ) : (
                          <span className='absolute inset-0 flex items-center justify-center text-xs text-muted-foreground'>
                            IMG
                          </span>
                        )}
                      </div>
                      <div>
                        <p className='font-medium'>
                          {item.productName || `Product #${item.productId}`}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Phân loại: {item.size || 'Default'} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className='font-medium'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format((item.unitPrice || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
                <Separator className='my-4' />
                <div className='space-y-1.5 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Tạm tính</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(order.totalPrice || 0)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Phí vận chuyển</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(order.shippingFee || 0)}
                    </span>
                  </div>
                  <div className='flex justify-between font-bold text-lg mt-4'>
                    <span>Tổng cộng</span>
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(order.totalPrice || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' /> Khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm space-y-3'>
              <div>
                <p className='font-medium'>{order.shippingName}</p>
                <p className='text-muted-foreground'>{order.shippingPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' /> Giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>
              <p className='text-muted-foreground'>{order.shippingAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CreditCard className='h-5 w-5' /> Thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>
              <p className='font-medium'>{order.paymentMethod}</p>
              <p className='text-muted-foreground capitalize'>{order.paymentStatus || 'PENDING'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
