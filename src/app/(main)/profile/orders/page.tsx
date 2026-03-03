'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { orderService } from '@/services/order'
import { userService } from '@/services/user'
import { paymentService } from '@/services/payment'
import { Order } from '@/types/order'
import { User } from '@/types/user'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { reviewService } from '@/services/review'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatCurrency, getImageUrl, cn } from '@/lib/utils'
import {
  Calendar,
  Package,
  CreditCard,
  MapPin,
  Loader2,
  ShoppingBag,
  CheckCircle,
  MessageSquare,
} from 'lucide-react'
import { OrderReviewDialog } from '@/components/reviews/order-review-dialog'

const STATUS_TABS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Hoàn thành', value: 'DELIVERED' },
  { label: 'Đã hủy', value: 'CANCELED' },
  { label: 'Chưa thanh toán', value: 'UNPAID' },
]

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<User | null>(null)
  // Track which order items have been reviewed: key is `${orderId}-${productId}`
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set())

  // Pagination
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  // Status filter
  const [currentTab, setCurrentTab] = useState('ALL')

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  // Review Dialog State
  const [reviewOrderInfo, setReviewOrderInfo] = useState<{
    orderId: number
    productId: number
    productName: string
  } | null>(null)

  const fetchData = async () => {
    try {
      setIsPageLoading(true)

      const params: any = {
        page: page,
        size: pageSize,
      }

      // Map tab to params
      if (currentTab !== 'ALL') {
        switch (currentTab) {
          case 'PENDING':
            params.status = 'PENDING'
            break
          case 'CONFIRMED':
            params.status = 'CONFIRMED'
            break
          case 'SHIPPING':
            params.shipmentStatus = 'IN_DELIVERY'
            break
          case 'DELIVERED':
            params.shipmentStatus = 'DELIVERED'
            break
          case 'CANCELED':
            params.status = 'CANCELED'
            break
          case 'UNPAID':
            params.paymentStatus = 'UNPAID'
            break
        }
      }

      const [userRes, orderRes] = await Promise.all([
        userService.getMyInfo(),
        orderService.getMyOrders(params),
      ])

      if (userRes.data.success && userRes.data.data) {
        setUser(userRes.data.data)
      }

      if (orderRes.data.success) {
        // @ts-ignore
        const fetchedOrders = orderRes.data.data || []
        setOrders(fetchedOrders)
        // @ts-ignore
        setTotalPages(orderRes.data.pagination?.totalPages || 1)
        // @ts-ignore
        setTotalElements(orderRes.data.pagination?.totalElements || 0)

        // Fetch review statuses for COMPLETED orders
        const completedOrders = fetchedOrders.filter((o: any) => o.status === 'COMPLETED')
        if (completedOrders.length > 0) {
          const newReviewedItems = new Set<string>()

          // Collect all unique product IDs from completed orders to minimize API calls
          const productIds = new Set<number>()
          completedOrders.forEach((o: any) => {
            o.items.forEach((item: any) => productIds.add(item.productId))
          })

          // Fetch user's reviews for these products
          await Promise.all(
            Array.from(productIds).map(async (productId) => {
              try {
                const reviewRes = await reviewService.getMyReviewsByProduct(productId, 0, 100)
                if (reviewRes.data.success && reviewRes.data.data?.content) {
                  // Mark the specific order items as reviewed
                  reviewRes.data.data.content.forEach((rev: any) => {
                    if (rev.orderId) {
                      newReviewedItems.add(`${rev.orderId}-${rev.productId}`)
                    }
                  })
                }
              } catch (e) {
                console.error('Failed to fetch reviews for product', productId)
              }
            }),
          )

          setReviewedItems(newReviewedItems)
        } else {
          setReviewedItems(new Set())
        }
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, pageSize, currentTab])

  // Reset page when tab or pageSize changes
  useEffect(() => {
    setPage(0)
  }, [currentTab, pageSize])

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

  const handleConfirmReceived = async () => {
    if (!confirmId) return
    setIsProcessing(true)
    try {
      const res = await orderService.confirmReceived(confirmId)
      if (res.data.success) {
        toast.success('Đã xác nhận nhận hàng thành công')
        fetchData()
      } else {
        toast.error(res.data.message || 'Xác nhận thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi xác nhận')
    } finally {
      setIsProcessing(false)
      setConfirmId(null)
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

  return (
    <div className='container max-w-10xl mx-auto px-4 py-8 md:py-12 relative'>
      <LoadingOverlay visible={isProcessing} />

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
          <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
            {/* Header */}
            <div className='p-6 md:p-8 pb-0'>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='p-2.5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100'>
                    <Package className='w-6 h-6 text-yellow-600' />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900'>Lịch sử đơn hàng</h2>
                    <p className='text-sm text-muted-foreground'>
                      {totalElements > 0
                        ? `${totalElements} đơn hàng`
                        : 'Theo dõi tình trạng đơn hàng của bạn'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className='flex gap-2 overflow-x-auto pb-4 scrollbar-thin'>
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setCurrentTab(tab.value)
                      setPage(0)
                    }}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border',
                      currentTab === tab.value
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-slate-100' />

            {/* Content */}
            <div className='p-6 md:p-8 min-h-[400px]'>
              {isPageLoading ? (
                <div className='flex flex-col items-center justify-center py-20 text-slate-400'>
                  <Loader2 className='w-8 h-8 animate-spin mb-3' />
                  <span className='text-sm'>Đang tải đơn hàng...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className='text-center py-16 px-4'>
                  <div className='bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100'>
                    <ShoppingBag className='w-10 h-10 text-slate-300' />
                  </div>
                  <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                    Không tìm thấy đơn hàng
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Chưa có đơn hàng nào trong mục này.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className='border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white'
                    >
                      {/* Order Header */}
                      <div className='bg-slate-50/80 px-5 py-3.5 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-3'>
                            <span className='font-bold text-slate-900 text-sm'>#{order.code}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className='flex items-center text-xs text-slate-500 gap-1.5'>
                            <Calendar className='w-3 h-3' />
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}{' '}
                            {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          {getPaymentBadge(order.paymentStatus)}
                          {order.status === 'DELIVERED' && (
                            <Button
                              size='sm'
                              variant='outline'
                              className='bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 h-8'
                              onClick={() => setConfirmId(order.id)}
                            >
                              <CheckCircle className='w-3.5 h-3.5 mr-1' />
                              Đã nhận hàng
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className='px-5 divide-y divide-slate-100'>
                        {order.items.map((item, idx) => (
                          <div key={idx} className='py-4 flex gap-4'>
                            <div className='relative w-16 h-16 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0'>
                              <Image
                                src={getImageUrl(item.image)}
                                alt={item.productName}
                                fill
                                className='object-cover'
                                unoptimized
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h4 className='font-medium text-slate-900 text-sm line-clamp-1'>
                                {item.productName}
                              </h4>
                              <div className='text-xs text-slate-500 mt-1 flex items-center gap-2'>
                                <span className='bg-slate-100 px-2 py-0.5 rounded font-medium'>
                                  {item.size}
                                </span>
                                <span className='text-slate-400'>×</span>
                                <span>{item.quantity}</span>
                              </div>
                            </div>
                            <div className='text-right shrink-0'>
                              <div className='font-semibold text-slate-900 text-sm'>
                                {formatCurrency(item.unitPrice)}
                              </div>
                              {item.quantity > 1 && (
                                <div className='text-[11px] text-slate-400 mt-0.5'>
                                  = {formatCurrency(item.subtotal)}
                                </div>
                              )}
                              {order.status === 'COMPLETED' && (
                                <div className='mt-2 text-right'>
                                  {reviewedItems.has(`${order.id}-${item.productId}`) ? (
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='h-7 text-xs bg-slate-50 text-slate-500 border-slate-200 opacity-80 cursor-default'
                                      disabled
                                    >
                                      <CheckCircle className='w-3 h-3 mr-1' />
                                      Đã đánh giá
                                    </Button>
                                  ) : (
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='h-7 text-xs border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                                      onClick={() =>
                                        setReviewOrderInfo({
                                          orderId: order.id,
                                          productId: item.productId,
                                          productName: item.productName,
                                        })
                                      }
                                    >
                                      <MessageSquare className='w-3 h-3 mr-1' />
                                      Đánh giá
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className='px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap justify-between items-end gap-4'>
                        <div className='text-xs text-slate-500 space-y-1.5'>
                          <div className='flex items-center gap-1.5'>
                            <CreditCard className='w-3.5 h-3.5' />
                            <span>
                              {order.paymentMethod === 'CASH_ON_DELIVERY'
                                ? 'COD'
                                : order.paymentMethod === 'ONLINE'
                                  ? 'ONLINE'
                                  : order.paymentMethod}
                            </span>
                          </div>
                          <div className='flex items-center gap-1.5'>
                            <MapPin className='w-3.5 h-3.5' />
                            <span className='line-clamp-1 max-w-[280px]'>
                              {order.shippingAddress}
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-xs text-slate-400'>
                            Phí ship: {formatCurrency(order.shippingFee)}
                          </div>
                          <div className='text-lg font-bold text-slate-900 mt-0.5'>
                            {formatCurrency(order.totalPrice)}
                          </div>
                          {/* Retry Payment */}
                          {order.paymentMethod === 'ONLINE' &&
                            order.paymentStatus !== 'PAID' &&
                            order.status !== 'CANCELED' && (
                              <Button
                                size='sm'
                                className='mt-2 h-8 bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                                onClick={async () => {
                                  try {
                                    setIsProcessing(true)
                                    const pRes = await paymentService.createVnPayUrl(order.id)
                                    if (pRes.data.success && pRes.data.data) {
                                      window.location.href = pRes.data.data
                                    } else {
                                      toast.error('Không thể tạo link thanh toán')
                                      setIsProcessing(false)
                                    }
                                  } catch (err) {
                                    toast.error('Lỗi kết nối thanh toán')
                                    setIsProcessing(false)
                                  }
                                }}
                              >
                                Thanh toán ngay
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            <div className='px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50/50'>
              <div className='flex flex-col-reverse sm:flex-row items-center justify-between gap-4'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <span>Hiển thị</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setPage(0)
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px] bg-white'>
                      <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent side='top'>
                      {[5, 10, 20].map((s) => (
                        <SelectItem key={s} value={s.toString()}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>đơn mỗi trang</span>
                </div>

                {totalPages > 0 && (
                  <div className='flex items-center gap-4'>
                    <div className='text-sm text-muted-foreground'>
                      Trang {page + 1} / {totalPages}
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
                              if (page < totalPages - 1) setPage(page + 1)
                            }}
                            className={
                              page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Dialog */}
            <AlertDialog
              open={!!confirmId}
              onOpenChange={(open: boolean) => !open && setConfirmId(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đã nhận hàng?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Vui lòng chỉ xác nhận khi bạn đã nhận được hàng và hàng hóa ở tình trạng nguyên
                    vẹn. Đơn hàng sẽ được chuyển sang trạng thái <strong>Hoàn thành</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Chưa nhận được</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmReceived}
                    className='bg-green-600 hover:bg-green-700 text-white'
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Đã nhận được hàng'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Review Dialog */}
            {reviewOrderInfo && (
              <OrderReviewDialog
                open={!!reviewOrderInfo}
                onOpenChange={(open: boolean) => !open && setReviewOrderInfo(null)}
                orderId={reviewOrderInfo.orderId}
                productId={reviewOrderInfo.productId}
                productName={reviewOrderInfo.productName}
                onReviewSuccess={fetchData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
