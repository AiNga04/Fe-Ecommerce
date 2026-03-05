'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { reviewService } from '@/services/review'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageSquareOff, EyeOff, Eye, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Order } from '@/types/order'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface OrderReviewsDisplayProps {
  order: Order
  basePath: 'admin' | 'staff'
}

export function OrderReviewsDisplay({ order, basePath }: OrderReviewsDisplayProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchReviews = async () => {
    if (order.status !== 'COMPLETED') return
    setIsLoading(true)
    try {
      // Fetch all products involved in this order concurrently
      const reviewPromises = order.items.map((item) =>
        reviewService.getByProduct(item.productId, 0, 50),
      )
      const results = await Promise.all(reviewPromises)

      let allReviews: any[] = []
      results.forEach((res) => {
        if (res.data?.success && res.data?.data?.reviews) {
          const reviewsData = res.data.data.reviews
          const reviewsArray = Array.isArray(reviewsData) ? reviewsData : reviewsData.content || []
          allReviews = [...allReviews, ...reviewsArray]
        }
      })

      // Local filter: match reviews to THIS specific user AND maybe orderId
      const filtered = allReviews.filter(
        (r: any) => r.userId === (order as any).user?.id || (r.orderId && r.orderId === order.id),
      )

      // Deduplicate
      const unique = Array.from(new Map(filtered.map((item) => [item.id, item])).values())
      setReviews(unique)
    } catch (error) {
      console.error('Fetch reviews error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [order.id, order.status])

  const handleToggleHide = async (reviewId: number, currentlyHidden: boolean) => {
    try {
      if (currentlyHidden) {
        await reviewService.unhide(reviewId)
        toast.success('Đã hiển thị lại đánh giá')
      } else {
        await reviewService.hide(reviewId)
        toast.success('Đã ẩn đánh giá')
      }
      fetchReviews()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái hiển thị')
    }
  }

  if (order.status !== 'COMPLETED') return null

  return (
    <Card className='shadow-sm border-slate-200 mt-6'>
      <CardHeader className='bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
            Đánh giá từ khách hàng
          </CardTitle>
          <CardDescription>
            {reviews.length > 0
              ? `Khách hàng đã để lại ${reviews.length} đánh giá cho đơn hàng này`
              : 'Đơn hàng này chưa có đánh giá nào.'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='pt-6'>
        {isLoading ? (
          <div className='text-sm text-slate-500 text-center py-4'>Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-slate-400'>
            <MessageSquareOff className='w-10 h-10 mb-3 text-slate-300' />
            <span className='text-sm'>Chưa có đánh giá</span>
          </div>
        ) : (
          <div className='space-y-6'>
            {reviews.map((review: any) => {
              // Match review with order item to get product name
              const relatedItem = order.items.find((i: any) => i.productId === review.productId)

              return (
                <div
                  key={review.id}
                  className={`border rounded-xl p-5 ${review.hidden ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 shadow-sm'}`}
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <h4 className='font-semibold text-slate-900 text-sm mb-1'>
                        Sản phẩm: {relatedItem?.productName || `Mã SP: ${review.productId}`}
                      </h4>
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star: number) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-300'}`}
                          />
                        ))}
                        <span className='ml-2 text-xs text-slate-500'>
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {review.hidden && (
                        <Badge
                          variant='outline'
                          className='bg-slate-100 text-slate-600 border-slate-300 rounded-lg text-[10px] font-bold h-6'
                        >
                          <EyeOff className='w-3 h-3 mr-1' /> Đã ẩn
                        </Badge>
                      )}

                      {(basePath === 'admin' || basePath === 'staff') && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size='sm'
                              variant='outline'
                              className='h-7 text-[11px] font-bold rounded-lg border-slate-200 gap-1.5'
                            >
                              {review.hidden ? (
                                <Eye className='w-3.5 h-3.5' />
                              ) : (
                                <EyeOff className='w-3.5 h-3.5 text-slate-400' />
                              )}
                              {review.hidden ? 'Hiện' : 'Ẩn'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className='flex items-center gap-2'>
                                <AlertCircle
                                  className={review.hidden ? 'text-blue-500' : 'text-amber-500'}
                                />
                                {review.hidden ? 'Hiển thị đánh giá?' : 'Xác nhận ẩn đánh giá?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {review.hidden
                                  ? 'Đánh giá này sẽ được hiển thị công khai trên trang sản phẩm.'
                                  : 'Đánh giá này sẽ bị ẩn và không hiển thị trên trang sản phẩm cho khách hàng thấy.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className='rounded-xl'>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleToggleHide(review.id, review.hidden)}
                                className={cn(
                                  'rounded-xl',
                                  review.hidden
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-slate-900 hover:bg-black',
                                )}
                              >
                                Xác nhận
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>

                  {review.content && (
                    <p className='text-sm text-slate-700 mb-4 whitespace-pre-wrap'>
                      {review.content}
                    </p>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {review.images.map((img: string, idx: number) => (
                        <div
                          key={idx}
                          className='relative w-16 h-16 rounded-md overflow-hidden border border-slate-200'
                        >
                          <Image
                            src={getImageUrl(img)}
                            alt='Review image'
                            fill
                            className='object-cover'
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
