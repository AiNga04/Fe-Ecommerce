'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { orderService } from '@/services/order'
import { userService } from '@/services/user'
import { Order } from '@/types/order'
import { User } from '@/types/user'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { Calendar, Package, CreditCard, MapPin } from 'lucide-react'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const fetchData = async () => {
    try {
      const [userRes, orderRes] = await Promise.all([
        userService.getMyInfo(),
        orderService.getMyOrders({ page: 0, size: 20 }), // Fetch recent orders
      ])

      if (userRes.data.success && userRes.data.data) {
        setUser(userRes.data.data)
      }

      if (orderRes.data.success && orderRes.data.data) {
        setOrders(orderRes.data.data)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const response = await userService.updateMyAvatar(file)
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || 'Cập nhật ảnh đại diện thành công')
        setUser(response.data.data)
      } else {
        toast.error(response.data.message || 'Cập nhật ảnh đại diện thất bại')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('Có lỗi xảy ra khi tải ảnh lên')
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant='outline' className='bg-yellow-50 text-yellow-700 border-yellow-200'>
            Chờ xác nhận
          </Badge>
        )
      case 'CONFIRMED':
        return (
          <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
            Đã xác nhận
          </Badge>
        )
      case 'SHIPPING':
        return (
          <Badge variant='outline' className='bg-indigo-50 text-indigo-700 border-indigo-200'>
            Đang giao
          </Badge>
        )
      case 'DELIVERED':
        return (
          <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
            Hoàn thành
          </Badge>
        )
      case 'CANCELED':
        return <Badge variant='destructive'>Đã hủy</Badge>
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    return status === 'PAID' ? (
      <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
        Đã thanh toán
      </Badge>
    ) : (
      <Badge variant='outline' className='bg-gray-50 text-gray-600 border-gray-200'>
        Chưa thanh toán
      </Badge>
    )
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8 md:py-12'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8'>
        {/* Left Sidebar */}
        <div className='md:col-span-4 lg:col-span-3'>
          <ProfileSidebar
            user={user}
            activeTab='orders'
            onAvatarUpload={handleAvatarUpload}
            isUploading={isUploading}
          />
        </div>

        {/* Right Content */}
        <div className='md:col-span-8 lg:col-span-9'>
          <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[500px]'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-2 bg-yellow-50 rounded-lg'>
                <Package className='w-6 h-6 text-yellow-600' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Lịch sử đơn hàng</h2>
            </div>

            <div className='space-y-6'>
              {orders.length === 0 ? (
                <div className='text-center py-16 px-4 border-2 border-dashed border-gray-100 rounded-xl'>
                  <div className='bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Package className='w-8 h-8 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>Chưa có đơn hàng nào</h3>
                  <p className='text-muted-foreground'>
                    Bạn chưa mua sắm sản phẩm nào. Hãy khám phá ngay!
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className='border rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-200 bg-white shadow-sm'
                  >
                    {/* Header */}
                    <div className='bg-gray-50/50 p-4 border-b flex flex-wrap gap-4 justify-between items-center'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3'>
                          <span className='font-bold text-gray-900'>#{order.code}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className='flex items-center text-sm text-gray-500 gap-4'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='w-3.5 h-3.5' />{' '}
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}{' '}
                            {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className='text-right'>{getPaymentBadge(order.paymentStatus)}</div>
                    </div>

                    {/* Items */}
                    <div className='p-4 divide-y'>
                      {order.items.map((item, idx) => (
                        <div key={idx} className='py-4 first:pt-0 last:pb-0 flex gap-4'>
                          <div className='relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0'>
                            <Image
                              src={getImageUrl(item.image)}
                              alt={item.productName}
                              fill
                              className='object-cover'
                              unoptimized
                            />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-gray-900 line-clamp-2'>
                              {item.productName}
                            </h4>
                            <div className='text-sm text-gray-500 mt-1 flex flex-wrap gap-3'>
                              <span className='bg-gray-100 px-2 py-0.5 rounded text-xs'>
                                Size: {item.size}
                              </span>
                              <span>x{item.quantity}</span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='font-medium text-gray-900'>
                              {formatCurrency(item.unitPrice)}
                            </div>
                            <div className='text-xs text-gray-500 mt-1'>
                              Thành tiền: {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer / Total */}
                    <div className='p-4 bg-gray-50 border-t flex flex-wrap justify-between items-center gap-4'>
                      <div className='text-sm text-gray-600'>
                        <div className='flex items-center gap-1.5 mb-1'>
                          <CreditCard className='w-4 h-4' />
                          {order.paymentMethod === 'CASH_ON_DELIVERY'
                            ? 'Thanh toán khi nhận hàng (COD)'
                            : order.paymentMethod}
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <MapPin className='w-4 h-4' />
                          <span className='line-clamp-1 max-w-[250px]'>
                            {order.shippingAddress}
                          </span>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm text-gray-500 flex justify-end gap-2'>
                          <span>Phí ship:</span>
                          <span>{formatCurrency(order.shippingFee)}</span>
                        </div>
                        <div className='text-lg font-bold text-gray-900 mt-1 flex justify-end gap-2 items-end'>
                          <span className='text-sm font-normal text-gray-500 pb-0.5'>
                            Tổng cộng:
                          </span>
                          <span className='text-primary'>{formatCurrency(order.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
