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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { VoucherDialog } from './components/voucher-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function VouchersPage() {
  const [page, setPage] = useState(0)
  const pageSize = 20
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)

  // Actions state
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [activateId, setActivateId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  // Fetch vouchers
  const { data: voucherData, isLoading } = useQuery({
    queryKey: ['vouchers', page],
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
        <Button
          onClick={handleCreate}
          className='bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
        >
          <Plus className='mr-2 h-4 w-4' /> Tạo Voucher Mới
        </Button>
      </div>

      <div className='rounded-md border bg-white shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className='bg-slate-50'>
            <TableRow>
              <TableHead className='w-[150px]'>Mã Voucher</TableHead>
              <TableHead className='min-w-[200px]'>Tên chương trình</TableHead>
              <TableHead>Loại / Giá trị</TableHead>
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
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {getTypeLabel(voucher.type)}
                      </Badge>
                      <span className='font-semibold'>
                        {voucher.type === VoucherType.PERCENTAGE
                          ? `${voucher.discountValue}%`
                          : voucher.type === VoucherType.FREESHIP
                            ? 'Tối đa ' + voucher.discountValue?.toLocaleString() + 'đ'
                            : voucher.discountValue?.toLocaleString() + 'đ'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    <div className='flex flex-col text-xs'>
                      <span>
                        {voucher.startDate
                          ? format(new Date(voucher.startDate), 'dd/MM/yyyy')
                          : 'Tùy ý'}
                      </span>
                      <span className='text-center w-4 rotate-90 sm:rotate-0'>→</span>
                      <span>
                        {voucher.endDate
                          ? format(new Date(voucher.endDate), 'dd/MM/yyyy')
                          : 'Vô hạn'}
                      </span>
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
                      {/* Actions based on status */}
                      {(voucher.status === VoucherStatus.DRAFT ||
                        voucher.status === VoucherStatus.INACTIVE) && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => setActivateId(voucher.id)}
                          className='h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50'
                          title='Kích hoạt voucher'
                        >
                          <CheckCircle2 className='h-4 w-4' />
                        </Button>
                      )}

                      {/* Allow edit unless Expired (though BE prevents it too) */}
                      {voucher.status !== VoucherStatus.EXPIRED && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(voucher)}
                          className='h-8 w-8 text-slate-500 hover:text-blue-600'
                          title='Chỉnh sửa'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                      )}

                      {/* Deactivate/Delete */}
                      {voucher.status !== VoucherStatus.INACTIVE && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => setDeleteId(voucher.id)}
                          className='h-8 w-8 text-slate-500 hover:text-red-600'
                          title='Ẩn / Hủy kích hoạt'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Simple prev/next for now) */}
      {totalPages > 1 && (
        <div className='flex justify-end gap-2 mt-4'>
          <Button variant='outline' disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Trước
          </Button>
          <div className='flex items-center px-4 text-sm font-medium'>
            Trang {page + 1} / {totalPages}
          </div>
          <Button
            variant='outline'
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      <VoucherDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} voucher={selectedVoucher} />

      {/* Delete/Deactivate Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ẩn voucher này?</AlertDialogTitle>
            <AlertDialogDescription>
              Voucher sẽ chuyển sang trạng thái <strong>INACTIVE</strong> và không thể sử dụng được
              nữa. Bạn có thể kích hoạt lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCallback}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {deleteMutation.isPending ? 'Đang xử lý...' : 'Xác nhận Ẩn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Dialog */}
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
              className='bg-green-600 hover:bg-green-700 text-white'
            >
              {activateMutation.isPending ? 'Đang kích hoạt...' : 'Kích hoạt ngay'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
