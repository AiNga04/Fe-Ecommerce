'use client'

import React, { useEffect, useState } from 'react'
import { reviewService } from '@/services/review'
import { ReviewResponse } from '@/types/review'
import { Star, MoreVertical, Flag, Edit2, Trash2, User } from 'lucide-react'
import { format } from 'date-fns'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { toast } from 'sonner'
import { useAuthSession } from '@/hooks/use-auth-session'
import { OrderReviewDialog } from '@/components/reviews/order-review-dialog'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'

interface ProductReviewsListProps {
  productId: number
  productName: string
}

export function ProductReviewsList({ productId, productName }: ProductReviewsListProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  const { user, isAuthenticated } = useAuthSession()

  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [reviewToReport, setReviewToReport] = useState<number | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  const fetchReviews = async (pageNumber: number = 0) => {
    try {
      setIsLoading(true)
      const res = await reviewService.getByProduct(productId, pageNumber, 5)
      if (res.data.success && res.data.data) {
        const pageData = res.data.data.reviews
        if (pageNumber === 0) {
          setReviews(pageData?.content || [])
        } else {
          setReviews((prev) => [...prev, ...(pageData?.content || [])])
        }
        setTotalPages(pageData?.totalPages || 0)
        setTotalElements(res.data.data.totalReviews || 0)
        setAverageRating(res.data.data.averageRating || 0)
        setPage(pageNumber)
      }
    } catch (error) {
      console.error('Fetch product reviews error', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(0)
  }, [productId])

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      fetchReviews(page + 1)
    }
  }

  const confirmDelete = (id: number) => {
    setReviewToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!reviewToDelete) return
    try {
      const res = await reviewService.delete(reviewToDelete)
      if (res.data.success) {
        toast.success('Xóa đánh giá thành công')
        fetchReviews(0)
      }
    } catch {
      toast.error('Không thể xóa đánh giá')
    } finally {
      setIsDeleteDialogOpen(false)
      setReviewToDelete(null)
    }
  }

  const confirmReport = (id: number) => {
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để báo cáo đánh giá')
      return
    }
    setReviewToReport(id)
    setIsReportDialogOpen(true)
  }

  const executeReport = async () => {
    if (!reviewToReport) return
    try {
      const res = await reviewService.reportReview(reviewToReport)
      if (res.data.success) {
        toast.success('Đã gửi báo cáo thành công. Quản trị viên sẽ xem xét.')
      } else {
        toast.error(res.data.message || 'Báo cáo thất bại')
      }
    } catch {
      toast.error('Có lỗi xảy ra khi gửi báo cáo')
    } finally {
      setIsReportDialogOpen(false)
      setReviewToReport(null)
    }
  }

  const openEditDialog = (review: ReviewResponse) => {
    setEditingReview(review)
    setIsEditDialogOpen(true)
  }

  const renderRatingStars = (rating: number) => {
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'
            }`}
          />
        ))}
      </div>
    )
  }

  if (isLoading && reviews.length === 0) {
    return (
      <div className='py-12 flex justify-center'>
        <LoadingOverlay visible={true} />
      </div>
    )
  }

  return (
    <div className='mt-12 border-t pt-10'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900'>Đánh giá sản phẩm</h2>
          {totalElements > 0 && (
            <div className='flex items-center mt-2 gap-2 text-slate-600'>
              <div className='flex items-center gap-1 text-yellow-500'>
                <Star className='w-5 h-5 fill-current' />
                <span className='font-bold text-lg text-slate-900'>{averageRating}</span>
                <span className='text-sm'>/ 5</span>
              </div>
              <span>•</span>
              <span className='font-medium'>{totalElements} đánh giá</span>
            </div>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className='text-center py-12 bg-slate-50 rounded-2xl border border-slate-100'>
          <p className='text-slate-500'>Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {reviews.map((review) => {
            const isOwner = isAuthenticated && user && Number(user.id) === review.userId
            return (
              <div
                key={review.id}
                className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm'
              >
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10 border border-slate-100'>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random`}
                        alt={review.userName}
                      />
                      <AvatarFallback>
                        <User className='w-5 h-5 text-slate-400' />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-semibold text-slate-900'>{review.userName}</div>
                      <div className='flex items-center gap-2 mt-1'>
                        {renderRatingStars(review.rating)}
                        <span className='text-xs text-slate-400'>
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-400'>
                        <MoreVertical className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                      {isOwner ? (
                        <>
                          <DropdownMenuItem onClick={() => openEditDialog(review)}>
                            <Edit2 className='w-4 h-4 mr-2 text-slate-500' />
                            Sửa đánh giá
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-rose-600 focus:bg-rose-50 focus:text-rose-600'
                            onClick={() => confirmDelete(review.id)}
                          >
                            <Trash2 className='w-4 h-4 mr-2 shrink-0' />
                            Xóa đánh giá
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => confirmReport(review.id)}>
                          <Flag className='w-4 h-4 mr-2 text-slate-500' />
                          Báo cáo vi phạm
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className='text-slate-700 leading-relaxed whitespace-pre-line'>
                  {review.content}
                </p>

                {review.images && review.images.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-4'>
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className='relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200'
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

          {page < totalPages - 1 && (
            <div className='text-center pt-4'>
              <Button variant='outline' onClick={handleLoadMore} disabled={isLoading}>
                {isLoading ? 'Đang tải...' : 'Xem thêm đánh giá'}
              </Button>
            </div>
          )}
        </div>
      )}

      {editingReview && (
        <OrderReviewDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          orderId={editingReview.orderId}
          productId={editingReview.productId}
          productName={productName}
          existingReview={editingReview}
          onReviewSuccess={() => fetchReviews(0)}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đánh giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className='bg-rose-600 hover:bg-rose-700'>
              Xóa đánh giá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Báo cáo vi phạm</AlertDialogTitle>
            <AlertDialogDescription>
              Báo cáo đánh giá này vi phạm tiêu chuẩn cộng đồng? Quản trị viên sẽ xem xét kỹ lưỡng
              và đưa ra hình thức xử lý.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={executeReport} className='bg-blue-600 hover:bg-blue-700'>
              Gửi báo cáo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
