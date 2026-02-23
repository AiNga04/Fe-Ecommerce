'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Download, History, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import { inventoryService } from '@/services/inventory'

export default function InventoryPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  // Filters
  const [productIdStr, setProductIdStr] = useState('')
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Convert states to API params
  const productId = productIdStr ? Number(productIdStr) : undefined
  const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined
  const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined

  // Data fetching
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory-logs', productId, fromDate, toDate, page, size],
    queryFn: () => inventoryService.getAuditLogs({ productId, fromDate, toDate, page, size }),
  })

  const logs = Array.isArray(data?.data?.data) ? data.data.data : []
  const totalElements = data?.data?.pagination?.totalElements || 0
  const totalPages = data?.data?.pagination?.totalPages || 0

  // Export Handlers
  const handleExportExcel = async () => {
    try {
      const blob = await inventoryService.exportExcel({ productId, fromDate, toDate })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory_audit_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export Excel failed:', error)
    }
  }

  const handleExportPdf = async () => {
    try {
      const blob = await inventoryService.exportPdf({ productId, fromDate, toDate })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory_audit_${format(new Date(), 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export PDF failed:', error)
    }
  }

  return (
    <div className='flex flex-col gap-6 w-full mx-auto pb-10'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center'>
            <History className='w-5 h-5 text-indigo-600' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900'>Biến động Tồn kho</h1>
            <p className='text-sm text-slate-500'>
              Lịch sử xuất nhập và điều chỉnh số lượng sản phẩm
            </p>
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' className='bg-white shadow-sm flex-1 md:flex-none'>
                <Download className='w-4 h-4 mr-2' /> Excel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xuất file Excel?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hệ thống sẽ tiến hành tổng hợp dữ liệu lịch sử biến động kho dựa trên bộ lọc hiện
                  tại và tải xuống dưới dạng file Excel (.xlsx).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleExportExcel}
                  className='bg-indigo-600 hover:bg-indigo-700 text-white'
                >
                  Tiến hành xuất
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' className='bg-white shadow-sm flex-1 md:flex-none'>
                <Download className='w-4 h-4 mr-2' /> PDF
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xuất file PDF?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hệ thống sẽ tiến hành tổng hợp dữ liệu lịch sử biến động kho dựa trên bộ lọc hiện
                  tại và tải xuống dưới dạng file PDF (.pdf).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleExportPdf}
                  className='bg-indigo-600 hover:bg-indigo-700 text-white'
                >
                  Tiến hành xuất
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end'>
        <div className='w-full md:w-auto'>
          <label className='text-sm font-medium text-slate-700 mb-1 block'>Từ ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full md:w-[200px] justify-start text-left font-normal',
                  !dateRange.from && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={dateRange.from}
                onSelect={(date: Date | undefined) =>
                  setDateRange((prev) => ({ ...prev, from: date }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='w-full md:w-auto'>
          <label className='text-sm font-medium text-slate-700 mb-1 block'>Đến ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full md:w-[200px] justify-start text-left font-normal',
                  !dateRange.to && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={dateRange.to}
                onSelect={(date: Date | undefined) =>
                  setDateRange((prev) => ({ ...prev, to: date }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='w-full md:w-auto ml-auto'>
          <Button
            variant='ghost'
            className='text-slate-500'
            onClick={() => {
              setProductIdStr('')
              setDateRange({ from: undefined, to: undefined })
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Table section */}
      <div className='bg-white border rounded-xl shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className='bg-slate-50'>
            <TableRow>
              <TableHead className='w-[80px] text-center font-semibold'>ID</TableHead>
              <TableHead className='font-semibold'>Thời gian</TableHead>
              <TableHead className='font-semibold'>Sản phẩm</TableHead>
              <TableHead className='font-semibold text-right'>Tồn cũ</TableHead>
              <TableHead className='font-semibold text-center'>Thay đổi</TableHead>
              <TableHead className='font-semibold text-right'>Tồn mới</TableHead>
              <TableHead className='font-semibold'>Người thao tác</TableHead>
              <TableHead className='font-semibold'>Lý do</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center text-slate-500'>
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center text-slate-500'>
                  Không tìm thấy dữ liệu biến động nào
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: any) => {
                const change = log.newStock - log.oldStock
                return (
                  <TableRow key={log.id}>
                    <TableCell className='text-center text-slate-500'>{log.id}</TableCell>
                    <TableCell className='text-slate-600'>
                      {format(new Date(log.changedAt), 'HH:mm dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className='font-medium max-w-[200px] truncate'>
                      <span className='mr-2 text-slate-500 text-xs'>#{log.productId}</span>
                      {log.productName}
                    </TableCell>
                    <TableCell className='text-right'>{log.oldStock}</TableCell>
                    <TableCell className='text-center'>
                      <Badge
                        variant='outline'
                        className={cn(
                          'font-mono border-transparent',
                          change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
                        )}
                      >
                        {change > 0 ? '+' : ''}
                        {change}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right font-medium'>{log.newStock}</TableCell>
                    <TableCell className='text-slate-600'>{log.changedByUserName}</TableCell>
                    <TableCell
                      className='text-sm text-slate-500 max-w-[200px] truncate'
                      title={log.reason}
                    >
                      {log.reason || '-'}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination placeholder */}
        {totalPages > 1 && (
          <div className='p-4 border-t flex justify-end gap-2 items-center bg-slate-50'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Trước
            </Button>
            <span className='text-sm text-slate-600 mx-4'>
              Trang {page + 1} / {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
