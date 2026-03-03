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
  ArrowLeft,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getImageUrl, cn } from '@/lib/utils'

interface ReviewsPageContentProps {
  basePath: 'admin' | 'staff'
}

export function ReviewsPageContent({ basePath }: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

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
          res = await reviewService.getReported(page, pageSize)
          break
        case 'hidden':
          res = await reviewService.getHidden(page, pageSize)
          break
        default:
          res = await reviewService.getAll(page, pageSize)
      }

      if (res.data.success && res.data.data) {
        const payloadData: any = res.data.data
        const reviewsArray = Array.isArray(payloadData) ? payloadData : payloadData.content || []
        setReviews(reviewsArray)

        const pagination = res.data.pagination || (payloadData as any)
        setTotalPages(pagination?.totalPages || 0)
        setTotalElements(pagination?.totalElements || 0)
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
  }, [activeTab, page, pageSize])

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
          <h1 className='text-3xl font-bold tracking-tight'>
            {activeTab === 'hidden' ? 'Đánh giá đang ẩn' : 'Quản lý đánh giá'}
          </h1>
          <p className='text-slate-500 text-sm mt-1'>
            {activeTab === 'hidden'
              ? 'Danh sách các phản hồi đã được tạm ẩn khỏi hệ thống'
              : 'Theo dõi phản hồi từ khách hàng và kiểm duyệt nội dung'}
          </p>
        </div>

        <div className='flex items-center gap-2 flex-wrap'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setActiveTab(activeTab === 'hidden' ? 'all' : 'hidden')
              setPage(0)
            }}
            className={cn(
              'gap-2 transition-all duration-200 border-dashed h-9',
              activeTab === 'hidden'
                ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700 hover:border-orange-300'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            {activeTab === 'hidden' ? (
              <>
                <ArrowLeft className='h-4 w-4' /> Quay lại danh sách
              </>
            ) : (
              <>
                <EyeOff className='h-4 w-4' /> Đang ẩn
              </>
            )}
          </Button>

          {activeTab !== 'hidden' && (
            <>
              <div className='h-6 w-px bg-slate-200 hidden sm:block mx-1' />

              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setActiveTab(activeTab === 'reported' ? 'all' : 'reported')
                  setPage(0)
                }}
                className={cn(
                  'gap-2 h-9 transition-colors',
                  activeTab === 'reported'
                    ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                    : 'text-slate-500 hover:text-slate-900',
                )}
              >
                <ShieldAlert className='h-4 w-4' />
                Cần kiểm duyệt
              </Button>

              <Button
                size='sm'
                onClick={() => {
                  setActiveTab('all')
                  setPage(0)
                }}
                className={cn(
                  'gap-2 h-9 shadow-sm transition-all',
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50',
                )}
              >
                <MessageSquare className='h-4 w-4' />
                Tất cả
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm'>
        <div className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
          <Input
            placeholder='Tìm kiếm đánh giá...'
            className='pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>

      <Card className='shadow-sm border-slate-200'>
        <CardContent className='p-0'>
          {isLoading && !reviews.length ? (
            <div className='py-20 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='rounded-md overflow-hidden flex overflow-x-auto'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='font-bold min-w-[150px]'>Sản phẩm & Đơn hàng</TableHead>
                    <TableHead className='font-bold min-w-[200px]'>Nội dung đánh giá</TableHead>
                    <TableHead className='font-bold min-w-[150px]'>Khách hàng</TableHead>
                    <TableHead className='font-bold min-w-[150px]'>Trạng thái</TableHead>
                    <TableHead className='text-right font-bold min-w-[100px]'>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} className='hover:bg-slate-50/30 transition-colors'>
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
                          <div className='text-sm font-bold text-slate-900'>{review.userName}</div>
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
          )}
        </CardContent>
      </Card>

      {totalPages > 0 && (
        <div className='flex items-center justify-between px-2 pt-2 pb-6'>
          <div className='flex items-center gap-2 text-sm text-slate-500 font-medium'>
            <span>Hiển thị</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value))
                setPage(0)
              }}
            >
              <SelectTrigger className='w-[70px] h-8 bg-white border-slate-200 font-bold text-xs shadow-none'>
                <SelectValue placeholder='10' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5</SelectItem>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
            <span>đánh giá mỗi trang</span>
          </div>

          <div className='flex items-center gap-6'>
            <div className='text-sm text-slate-500 font-medium'>
              Trang <span className='text-slate-900 font-bold'>{page + 1}</span> / {totalPages}
            </div>

            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 px-3 gap-1 text-slate-500 hover:text-blue-600 hover:bg-white transition-all disabled:opacity-30'
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className='w-4 h-4 text-slate-400' /> Trước
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 px-3 gap-1 content-center text-slate-500 hover:text-blue-600 hover:bg-white transition-all disabled:opacity-30'
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Sau <ChevronRight className='w-4 h-4 text-slate-400' />
              </Button>
            </div>
          </div>
        </div>
      )}

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
