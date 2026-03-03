'use client'

import React, { useEffect, useState } from 'react'
import { voucherService } from '@/services/voucher'
import { VoucherResponse, VoucherStatus, VoucherType } from '@/types/voucher'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Search,
  Ticket,
  Calendar,
  Play,
  Power,
  Tag,
  Percent,
  Truck,
  MoreVertical,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { LoadingOverlay } from '@/components/common/loading-overlay'

export default function StaffVouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const fetchVouchers = async () => {
    try {
      setIsLoading(true)
      const res = await voucherService.getAll(page, 10)
      if (res.data.success) {
        setVouchers(res.data.data || [])
      }
    } catch (error) {
      console.error('Fetch vouchers error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách khuyến mãi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [page])

  const handleActivate = async (id: number) => {
    try {
      const res = await voucherService.activate(id)
      if (res.data.success) {
        toast.success('Kích hoạt mã khuyến mãi thành công')
        fetchVouchers()
      }
    } catch (error) {
      toast.error('Không thể kích hoạt mã khuyến mãi')
    }
  }

  const getStatusBadge = (status: VoucherStatus) => {
    switch (status) {
      case VoucherStatus.ACTIVE:
        return (
          <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none'>
            Hoạt động
          </Badge>
        )
      case VoucherStatus.DRAFT:
        return (
          <Badge className='bg-slate-100 text-slate-700 hover:bg-slate-100 border-none'>
            Bản nháp
          </Badge>
        )
      case VoucherStatus.INACTIVE:
        return (
          <Badge className='bg-rose-100 text-rose-700 hover:bg-rose-100 border-none'>
            Ngừng áp dụng
          </Badge>
        )
      case VoucherStatus.EXPIRED:
        return (
          <Badge className='bg-amber-100 text-amber-700 hover:bg-amber-100 border-none'>
            Hết hạn
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getTypeIcon = (type: VoucherType) => {
    switch (type) {
      case VoucherType.PERCENTAGE:
        return <Percent className='w-4 h-4 text-blue-600' />
      case VoucherType.FIXED_AMOUNT:
        return <Tag className='w-4 h-4 text-emerald-600' />
      case VoucherType.FREESHIP:
        return <Truck className='w-4 h-4 text-indigo-600' />
      default:
        return <Ticket className='w-4 h-4 text-slate-600' />
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Mã Khuyến mãi</h1>
          <p className='text-slate-500 text-sm'>
            Theo dõi và quản lý các chương trình ưu đãi của cửa hàng
          </p>
        </div>
      </div>

      <Card className='shadow-sm border-slate-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                placeholder='Tìm theo mã hoặc tên voucher...'
                className='pl-10 bg-white'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && !vouchers.length ? (
            <div className='py-20 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='rounded-xl border border-slate-100 overflow-hidden'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='font-bold'>Mã & Tên</TableHead>
                    <TableHead className='font-bold'>Loại & Giá trị</TableHead>
                    <TableHead className='font-bold'>Lượt dùng</TableHead>
                    <TableHead className='font-bold'>Thời hạn</TableHead>
                    <TableHead className='font-bold'>Trạng thái</TableHead>
                    <TableHead className='w-[120px] text-right font-bold'>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id} className='hover:bg-slate-50/30 transition-colors'>
                      <TableCell>
                        <div className='flex flex-col'>
                          <div className='font-bold text-blue-600'>#{voucher.code}</div>
                          <div className='text-xs text-slate-500 font-medium'>{voucher.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0'>
                            {getTypeIcon(voucher.type)}
                          </div>
                          <div>
                            <div className='font-bold text-slate-900'>
                              {voucher.type === VoucherType.PERCENTAGE
                                ? `${voucher.discountValue}%`
                                : formatCurrency(voucher.discountValue)}
                            </div>
                            <div className='text-[10px] text-slate-400'>
                              Đơn tối thiểu {formatCurrency(voucher.minOrderValue || 0)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col gap-1'>
                          <div className='text-xs font-bold text-slate-700'>
                            {voucher.usedCount} / {voucher.maxUsage || '∞'}
                          </div>
                          <div className='w-24 h-1 bg-slate-100 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-blue-500 rounded-full'
                              style={{
                                width: `${voucher.maxUsage ? (voucher.usedCount / voucher.maxUsage) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col gap-0.5 text-xs'>
                          <div className='flex items-center gap-1 text-slate-500'>
                            <Clock className='w-3 h-3' />{' '}
                            {voucher.startDate
                              ? format(new Date(voucher.startDate), 'dd/MM/yy')
                              : 'N/A'}
                          </div>
                          <div className='flex items-center gap-1 text-rose-500 font-medium'>
                            <Calendar className='w-3 h-3' />{' '}
                            {voucher.endDate
                              ? format(new Date(voucher.endDate), 'dd/MM/yy')
                              : 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                      <TableCell className='text-right'>
                        {voucher.status !== VoucherStatus.ACTIVE &&
                          voucher.status !== VoucherStatus.EXPIRED && (
                            <Button
                              variant='outline'
                              size='sm'
                              className='h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                              onClick={() => handleActivate(voucher.id)}
                            >
                              <Play className='w-3.5 h-3.5 mr-1.5 fill-emerald-600' />
                              Dùng ngay
                            </Button>
                          )}
                        {voucher.status === VoucherStatus.ACTIVE && (
                          <Button disabled variant='ghost' size='sm' className='h-8 text-slate-400'>
                            <CheckCircle2 className='w-3.5 h-3.5 mr-1.5' />
                            Đang chạy
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!vouchers.length && (
                <div className='py-12 text-center text-slate-400'>
                  Không có chương trình khuyến mãi nào
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
