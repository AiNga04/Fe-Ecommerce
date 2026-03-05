'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TicketPercent,
  Loader2,
  Eye,
  Percent,
  Truck,
  Tag,
  Clock,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { voucherService } from '@/services/voucher'
import { Voucher, VoucherStatus, VoucherType } from '@/types/voucher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { VoucherDialog } from './voucher-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface VouchersPageContentProps {
  basePath: 'admin' | 'staff'
}

export function VouchersPageContent({ basePath }: VouchersPageContentProps) {
  const isReadOnly = basePath === 'staff' // Staff can only view and activate

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)

  // Actions state
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [activateId, setActivateId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  // Fetch vouchers
  const { data: voucherData, isLoading } = useQuery({
    queryKey: ['vouchers', basePath, page],
    queryFn: () => voucherService.getAll(page, pageSize),
  })

  // List data
  const vouchers = voucherData?.data?.data || []
  const totalPages = voucherData?.data?.pagination?.totalPages || 0

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => voucherService.deactivate(id),
    onSuccess: () => {
      toast.success('Đã ẩn voucher thành công')
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      setDeleteId(null)
    },
    onError: () => toast.error('Có lỗi xảy ra'),
  })

  const activateMutation = useMutation({
    mutationFn: (id: number) => voucherService.activate(id),
    onSuccess: () => {
      toast.success('Đã kích hoạt voucher thành công')
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      setActivateId(null)
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra'
      toast.error(msg)
    },
  })

  // Handlers
  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    if (isReadOnly) return
    setSelectedVoucher(null)
    setIsDialogOpen(true)
  }

  const handleDeleteCallback = () => {
    if (deleteId) deleteMutation.mutate(deleteId)
  }

  const handleActivateCallback = () => {
    if (activateId) activateMutation.mutate(activateId)
  }

  const getStatusBadge = (status: VoucherStatus) => {
    switch (status) {
      case VoucherStatus.ACTIVE:
        return <Badge className='bg-green-600 hover:bg-green-700'>Đang chạy</Badge>
      case VoucherStatus.DRAFT:
        return <Badge variant='secondary'>Bản nháp</Badge>
      case VoucherStatus.INACTIVE:
        return <Badge variant='destructive'>Đã ẩn</Badge>
      case VoucherStatus.EXPIRED:
        return (
          <Badge variant='outline' className='text-slate-500 border-slate-300'>
            Đã hết hạn
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeLabel = (type: VoucherType) => {
    switch (type) {
      case VoucherType.PERCENTAGE:
        return '%'
      case VoucherType.FIXED_AMOUNT:
        return 'VNĐ'
      case VoucherType.FREESHIP:
        return 'FreeShip'
      default:
        return type
    }
  }

  return (
    <div className='flex flex-col gap-6 relative pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Mã Giảm Giá</h1>
          <p className='text-muted-foreground'>Quản lý các chương trình khuyến mãi và voucher</p>
        </div>
        {!isReadOnly && (
          <Button
            onClick={handleCreate}
            className='bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
          >
            <Plus className='h-4 w-4' /> Tạo Voucher Mới
          </Button>
        )}
      </div>

      <div className='rounded-md border bg-white shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className='bg-slate-50'>
            <TableRow>
              <TableHead className='w-[150px]'>Mã Voucher</TableHead>
              <TableHead className='min-w-[200px]'>Tên chương trình</TableHead>
              <TableHead>Loại & Giá trị</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời hạn</TableHead>
              <TableHead>Đã dùng</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center text-muted-foreground'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto mb-2' />
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-32 text-center text-muted-foreground'>
                  <div className='flex flex-col items-center justify-center'>
                    <TicketPercent className='h-8 w-8 mb-2 opacity-20' />
                    <p>Chưa có voucher nào.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              vouchers.map((voucher: Voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className='font-mono font-medium text-blue-600'>
                    {voucher.code}
                  </TableCell>
                  <TableCell className='font-medium'>
                    <div className='flex flex-col'>
                      <span>{voucher.name}</span>
                      <span className='text-xs text-muted-foreground line-clamp-1'>
                        {voucher.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3 py-1'>
                      <div
                        className={cn(
                          'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                          voucher.type === VoucherType.PERCENTAGE
                            ? 'bg-blue-50'
                            : voucher.type === VoucherType.FREESHIP
                              ? 'bg-indigo-50'
                              : 'bg-emerald-50',
                        )}
                      >
                        {voucher.type === VoucherType.PERCENTAGE ? (
                          <Percent className='h-5 w-5 text-blue-600' />
                        ) : voucher.type === VoucherType.FREESHIP ? (
                          <Truck className='h-5 w-5 text-indigo-600' />
                        ) : (
                          <Tag className='h-5 w-5 text-emerald-600' />
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-bold text-slate-900 text-base flex items-baseline gap-0.5'>
                          {voucher.type === VoucherType.PERCENTAGE
                            ? `${voucher.discountValue}%`
                            : voucher.discountValue?.toLocaleString()}
                          {voucher.type !== VoucherType.PERCENTAGE && (
                            <span className='text-xs font-semibold underline decoration-2 underline-offset-2'>
                              ₫
                            </span>
                          )}
                        </span>
                        <span className='text-[10px] text-slate-400 font-medium'>
                          Đơn tối thiểu {voucher.minOrderValue?.toLocaleString() || '0'} ₫
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-1 py-1'>
                      <div className='flex items-center gap-1.5 text-[11px] text-slate-500 font-medium'>
                        <Clock className='h-3.5 w-3.5' />
                        <span>
                          {voucher.startDate
                            ? format(new Date(voucher.startDate), 'dd/MM/yy')
                            : '--'}
                        </span>
                      </div>
                      <div className='flex items-center gap-1.5 text-[11px] text-rose-500 font-bold'>
                        <CalendarIcon className='h-3.5 w-3.5' />
                        <span>
                          {voucher.endDate ? format(new Date(voucher.endDate), 'dd/MM/yy') : '--'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm'>
                      {voucher.usedCount}
                      <span className='text-muted-foreground mx-1'>/</span>
                      {voucher.maxUsage || '∞'}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-1'>
                      {/* Activate: Admin OR Staff (VOUCHER_STATUS_MANAGE) */}
                      {(voucher.status === VoucherStatus.DRAFT ||
                        voucher.status === VoucherStatus.INACTIVE) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setActivateId(voucher.id)}
                              className='h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50'
                            >
                              <CheckCircle2 className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Kích hoạt voucher</TooltipContent>
                        </Tooltip>
                      )}

                      {/* Edit or View Details */}
                      {voucher.status !== VoucherStatus.EXPIRED && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleEdit(voucher)}
                              className={`h-8 w-8 ${isReadOnly ? 'text-slate-500 hover:text-blue-700 hover:bg-blue-50' : 'text-slate-500 hover:text-blue-600'}`}
                            >
                              {isReadOnly ? (
                                <Eye className='h-4 w-4' />
                              ) : (
                                <Pencil className='h-4 w-4' />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isReadOnly ? 'Xem chi tiết' : 'Chỉnh sửa'}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Deactivate/Delete: ADMIN ONLY */}
                      {!isReadOnly && voucher.status !== VoucherStatus.INACTIVE && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setDeleteId(voucher.id)}
                              className='h-8 w-8 text-slate-500 hover:text-red-600'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ẩn / Hủy kích hoạt</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Hiển thị</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 50].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>voucher mỗi trang</span>
        </div>

        {totalPages > 0 && (
          <div className='flex items-center gap-4'>
            <div className='text-sm text-muted-foreground'>
              Trang {page + 1} / {totalPages || 1}
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
                    className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <VoucherDialog
        basePath={basePath}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        voucher={selectedVoucher}
      />

      {/* Delete/Deactivate Dialog (Admin Only Feature protected softly by JS guard) */}
      {!isReadOnly && (
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ẩn voucher này?</AlertDialogTitle>
              <AlertDialogDescription>
                Voucher sẽ chuyển sang trạng thái <strong>INACTIVE</strong> và không thể sử dụng
                được nữa. Bạn có thể kích hoạt lại sau.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCallback}
                className='bg-red-600 hover:bg-red-700'
              >
                {deleteMutation.isPending ? 'Đang xử lý...' : 'Xác nhận Ẩn'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Activate Dialog (Admin and Staff Share) */}
      <AlertDialog open={!!activateId} onOpenChange={(open) => !open && setActivateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kích hoạt voucher?</AlertDialogTitle>
            <AlertDialogDescription>
              Voucher sẽ chuyển sang trạng thái <strong>ACTIVE</strong> và người dùng có thể sử dụng
              ngay (nếu trong thời gian hiệu lực).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivateCallback}
              className='bg-green-600 hover:bg-green-700'
            >
              {activateMutation.isPending ? 'Đang kích hoạt...' : 'Kích hoạt ngay'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
