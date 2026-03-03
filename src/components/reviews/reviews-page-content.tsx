'use client'

import React, { useEffect, useState } from 'react'
import { reviewService } from '@/services/review'
import { ReviewResponse } from '@/types/review'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Star,
  MessageSquare,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  ShieldAlert,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getImageUrl } from '@/lib/utils'

interface ReviewsPageContentProps {
  basePath: 'admin' | 'staff'
}

export function ReviewsPageContent({ basePath }: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Confirmation dialogs state
  const [hideConfirm, setHideConfirm] = useState<{
    isOpen: boolean
    reviewId: number | null
    isHidden: boolean
  }>({
    isOpen: false,
    reviewId: null,
    isHidden: false,
  })

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    reviewId: number | null
  }>({
    isOpen: false,
    reviewId: null,
  })

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      let res
      switch (activeTab) {
        case 'reported':
          res = await reviewService.getReported(page, 10)
          break
        case 'hidden':
          res = await reviewService.getHidden(page, 10)
          break
        default:
          res = await reviewService.getAll(page, 10)
      }

      if (res.data.success && res.data.data) {
        const payloadData: any = res.data.data
        const reviewsArray = Array.isArray(payloadData) ? payloadData : payloadData.content || []
        setReviews(reviewsArray)

        const pagination = (res.data as any).pagination || payloadData
        setTotalPages(pagination?.totalPages || 0)
      }
    } catch (error) {
      console.error('Fetch reviews error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách đánh giá')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [activeTab, page])

  const handleToggleHide = async () => {
    if (!hideConfirm.reviewId) return
    try {
      const res = hideConfirm.isHidden
        ? await reviewService.unhide(hideConfirm.reviewId)
        : await reviewService.hide(hideConfirm.reviewId)
      if (res.data.success) {
        toast.success(hideConfirm.isHidden ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá')
        fetchReviews()
      }
    } catch (error) {
      toast.error('Thao tác thất bại')
    } finally {
      setHideConfirm({ ...hideConfirm, isOpen: false })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm.reviewId) return
    try {
      const res = await reviewService.delete(deleteConfirm.reviewId)
      if (res.data.success) {
        toast.success('Đã xóa đánh giá thành công')
        fetchReviews()
      }
    } catch (error) {
      toast.error('Không thể xóa đánh giá')
    } finally {
      setDeleteConfirm({ ...deleteConfirm, isOpen: false })
    }
  }

  const renderRating = (rating: number) => (
    <div className='flex gap-0.5'>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  )

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý Đánh giá</h1>
          <p className='text-slate-500 text-sm'>
            Theo dõi phản hồi từ khách hàng và kiểm duyệt nội dung
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <div className='flex items-center justify-between mb-4'>
          <TabsList className='bg-slate-100 p-1'>
            <TabsTrigger
              value='all'
              className='data-[state=active]:bg-white data-[state=active]:shadow-sm'
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value='reported'
              className='data-[state=active]:bg-white data-[state=active]:shadow-sm'
            >
              Cần kiểm duyệt (
              {reviews.length > 0 && activeTab === 'reported' ? reviews.length : '?'})
            </TabsTrigger>
            <TabsTrigger
              value='hidden'
              className='data-[state=active]:bg-white data-[state=active]:shadow-sm'
            >
              Đang ẩn
            </TabsTrigger>
          </TabsList>
        </div>

        <Card className='shadow-sm border-slate-200'>
          <CardContent className='p-0'>
            {isLoading && !reviews.length ? (
              <div className='py-20 flex justify-center'>
                <LoadingOverlay visible={true} />
              </div>
            ) : (
              <>
                <div className='rounded-md overflow-hidden flex overflow-x-auto'>
                  <Table>
                    <TableHeader className='bg-slate-50/50'>
                      <TableRow>
                        <TableHead className='font-bold min-w-[150px]'>
                          Sản phẩm & Đơn hàng
                        </TableHead>
                        <TableHead className='font-bold min-w-[200px]'>Nội dung đánh giá</TableHead>
                        <TableHead className='font-bold min-w-[150px]'>Khách hàng</TableHead>
                        <TableHead className='font-bold min-w-[150px]'>Trạng thái</TableHead>
                        <TableHead className='text-right font-bold min-w-[100px]'>
                          Hành động
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow
                          key={review.id}
                          className='hover:bg-slate-50/30 transition-colors'
                        >
                          <TableCell>
                            <div className='flex flex-col gap-1.5'>
                              <div className='flex items-center gap-1.5 text-xs font-bold text-blue-600'>
                                <Package className='w-3 h-3' /> SP ID: #{review.productId}
                              </div>
                              <div className='flex items-center gap-1.5 text-xs text-slate-500 italic'>
                                <ShoppingBag className='w-3 h-3' /> Đơn hàng: #{review.orderId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='space-y-2 py-2'>
                              {renderRating(review.rating)}
                              <p className='text-sm text-slate-700 line-clamp-3 leading-relaxed'>
                                {review.content || (
                                  <span className='text-slate-400 italic'>Không có nội dung</span>
                                )}
                              </p>
                              {review.images && review.images.length > 0 && (
                                <div className='flex gap-1'>
                                  {review.images.map((img, i) => (
                                    <div
                                      key={i}
                                      className='w-8 h-8 rounded border border-slate-100 overflow-hidden'
                                    >
                                      <img
                                        src={getImageUrl(img)}
                                        alt=''
                                        className='w-full h-full object-cover'
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col'>
                              <div className='text-sm font-bold text-slate-900'>
                                {review.userName}
                              </div>
                              <div className='text-[10px] text-slate-400 font-medium'>
                                {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col gap-1.5'>
                              {review.hidden ? (
                                <Badge
                                  variant='outline'
                                  className='bg-slate-100 text-slate-500 border-none w-fit'
                                >
                                  Đã ẩn
                                </Badge>
                              ) : (
                                <Badge
                                  variant='outline'
                                  className='bg-emerald-50 text-emerald-600 border-none w-fit'
                                >
                                  Hiển thị
                                </Badge>
                              )}
                              {review.reportCount > 0 && (
                                <Badge className='bg-rose-100 text-rose-600 hover:bg-rose-100 border-none w-fit flex items-center gap-1'>
                                  <ShieldAlert className='w-3 h-3' /> {review.reportCount} báo cáo
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                title={review.hidden ? 'Bỏ ẩn' : 'Ẩn đánh giá'}
                                onClick={() =>
                                  setHideConfirm({
                                    isOpen: true,
                                    reviewId: review.id,
                                    isHidden: review.hidden,
                                  })
                                }
                              >
                                {review.hidden ? (
                                  <Eye className='w-4 h-4' />
                                ) : (
                                  <EyeOff className='w-4 h-4' />
                                )}
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                title='Xóa vĩnh viễn'
                                onClick={() =>
                                  setDeleteConfirm({
                                    isOpen: true,
                                    reviewId: review.id,
                                  })
                                }
                              >
                                <Trash2 className='w-4 h-4' />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {reviews.length === 0 && (
                    <div className='py-20 text-center flex flex-col items-center justify-center text-slate-400 w-full col-span-5'>
                      <MessageSquare className='w-12 h-12 mb-3 opacity-10' />
                      <p className='italic'>Không có đánh giá nào phù hợp với bộ lọc này</p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className='flex justify-center p-6 border-t'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href='#'
                            onClick={(e) => {
                              e.preventDefault()
                              if (page > 0) setPage(page - 1)
                            }}
                            // @ts-ignore
                            disabled={page === 0}
                            className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href='#'
                              onClick={(e) => {
                                e.preventDefault()
                                setPage(i)
                              }}
                              isActive={page === i}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href='#'
                            onClick={(e) => {
                              e.preventDefault()
                              if (page < totalPages - 1) setPage(page + 1)
                            }}
                            // @ts-ignore
                            disabled={page === totalPages - 1}
                            className={
                              page === totalPages - 1 ? 'pointer-events-none opacity-50' : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={hideConfirm.isOpen}
        onOpenChange={(isOpen) => setHideConfirm({ ...hideConfirm, isOpen })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {hideConfirm.isHidden ? 'Hiển thị đánh giá?' : 'Ẩn đánh giá này?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {hideConfirm.isHidden
                ? 'Đánh giá này sẽ được hiển thị công khai trên trang chi tiết sản phẩm.'
                : 'Đánh giá này sẽ bị ẩn khỏi khách hàng nhưng vẫn được lưu trong hệ thống quản trị.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleHide}
              className={
                hideConfirm.isHidden
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-900 hover:bg-slate-800'
              }
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteConfirm.isOpen}
        onOpenChange={(isOpen) => setDeleteConfirm({ ...deleteConfirm, isOpen })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-rose-600'>Xóa vĩnh viễn đánh giá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đánh giá và các hình ảnh đi kèm sẽ bị xóa hoàn toàn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className='bg-rose-600 hover:bg-rose-700'>
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
