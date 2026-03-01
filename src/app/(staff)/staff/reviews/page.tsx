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
import { Star, MessageSquare, AlertCircle, Eye, EyeOff, Trash2, ShieldAlert, Package, ShoppingBag } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function StaffReviewsPage() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

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
        setReviews(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
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

  const handleToggleHide = async (id: number, currentHidden: boolean) => {
    try {
      const res = currentHidden ? await reviewService.unhide(id) : await reviewService.hide(id)
      if (res.data.success) {
        toast.success(currentHidden ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá')
        fetchReviews()
      }
    } catch (error) {
      toast.error('Thao tác thất bại')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn?')) return
    try {
      const res = await reviewService.delete(id)
      if (res.data.success) {
        toast.success('Đã xóa đánh giá thành công')
        fetchReviews()
      }
    } catch (error) {
      toast.error('Không thể xóa đánh giá')
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
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Quản lý Đánh giá</h1>
          <p className='text-slate-500 text-sm'>Theo dõi phản hồi từ khách hàng và kiểm duyệt nội dung</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <div className='flex items-center justify-between mb-4'>
          <TabsList className='bg-slate-100 p-1'>
            <TabsTrigger value='all' className='data-[state=active]:bg-white data-[state=active]:shadow-sm'>
              Tất cả
            </TabsTrigger>
            <TabsTrigger value='reported' className='data-[state=active]:bg-white data-[state=active]:shadow-sm'>
              Cần kiểm duyệt ({reviews.length > 0 && activeTab === 'reported' ? reviews.length : '?'})
            </TabsTrigger>
            <TabsTrigger value='hidden' className='data-[state=active]:bg-white data-[state=active]:shadow-sm'>
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
              <div className='rounded-md overflow-hidden'>
                <Table>
                  <TableHeader className='bg-slate-50/50'>
                    <TableRow>
                      <TableHead className='font-bold w-[250px]'>Sản phẩm & Đơn hàng</TableHead>
                      <TableHead className='font-bold w-[300px]'>Nội dung đánh giá</TableHead>
                      <TableHead className='font-bold'>Khách hàng</TableHead>
                      <TableHead className='font-bold'>Trạng thái</TableHead>
                      <TableHead className='text-right font-bold'>Hành động</TableHead>
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
                              {review.content || <span className='text-slate-400 italic'>Không có nội dung</span>}
                            </p>
                            {review.images && review.images.length > 0 && (
                              <div className='flex gap-1'>
                                {review.images.map((img, i) => (
                                  <div key={i} className='w-8 h-8 rounded border border-slate-100 overflow-hidden'>
                                    <img src={img} alt='' className='w-full h-full object-cover' />
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
                              <Badge variant='outline' className='bg-slate-100 text-slate-500 border-none w-fit'>Đã ẩn</Badge>
                            ) : (
                              <Badge variant='outline' className='bg-emerald-50 text-emerald-600 border-none w-fit'>Hiển thị</Badge>
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
                              onClick={() => handleToggleHide(review.id, review.hidden)}
                            >
                              {review.hidden ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              title='Xóa vĩnh viễn'
                              onClick={() => handleDelete(review.id)}
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!reviews.length && (
                  <div className='py-20 text-center flex flex-col items-center justify-center text-slate-400'>
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
                          className={page === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
