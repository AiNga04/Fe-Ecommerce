'use client'

import React, { useEffect, useState } from 'react'
import { inventoryService, InventoryAuditResponse } from '@/services/inventory'
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
import { format } from 'date-fns'
import {
  Search,
  Calendar,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Minus,
} from 'lucide-react'
import { toast } from 'sonner'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { AdjustStockDialog } from '@/components/staff/inventory/adjust-stock-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

export default function StaffInventoryPage() {
  const [logs, setLogs] = useState<InventoryAuditResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [searchProductId, setSearchProductId] = useState('')

  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string } | null>(null)

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const res = await inventoryService.getAuditLogs({
        page,
        size: 10,
        productId: searchProductId ? Number(searchProductId) : undefined,
      })
      if (res.data.success && res.data.data) {
        setLogs(res.data.data.content || [])
        setTotalPages(res.data.data.totalPages || 0)
      }
    } catch (error) {
      console.error('Fetch inventory logs error:', error)
      toast.error('Có lỗi xảy ra khi tải nhật ký kho')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  const handleExport = async (type: 'EXCEL' | 'PDF') => {
    try {
      toast.info(`Đang chuẩn bị tệp ${type}...`)
      const blob =
        type === 'EXCEL' ? await inventoryService.exportExcel() : await inventoryService.exportPdf()

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `inventory-audit-${format(new Date(), 'yyyyMMdd')}.${type === 'EXCEL' ? 'xlsx' : 'pdf'}`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success(`Xuất tệp ${type} thành công`)
    } catch (error) {
      console.error(`Export ${type} error:`, error)
      toast.error(`Có lỗi xảy ra khi xuất tệp ${type}`)
    }
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Nhật ký Kho hàng</h1>
          <p className='text-slate-500 text-sm'>
            Theo dõi mọi biến động xuất nhập tồn của sản phẩm
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='border-slate-200'
            onClick={() => handleExport('EXCEL')}
          >
            <FileSpreadsheet className='w-4 h-4 mr-2 text-emerald-600' />
            Excel
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='border-slate-200'
            onClick={() => handleExport('PDF')}
          >
            <FileText className='w-4 h-4 mr-2 text-rose-600' />
            PDF
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            size='sm'
            onClick={() => setIsAdjustOpen(true)}
          >
            <Plus className='w-4 h-4 mr-2' />
            Điều chỉnh kho
          </Button>
        </div>
      </div>

      <Card className='shadow-sm border-slate-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                placeholder='Tìm theo ID sản phẩm...'
                className='pl-10'
                type='number'
                value={searchProductId}
                onChange={(e) => setSearchProductId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && !logs.length ? (
            <div className='py-20 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='rounded-xl border border-slate-100 overflow-hidden'>
                <Table>
                  <TableHeader className='bg-slate-50/50'>
                    <TableRow>
                      <TableHead className='font-bold'>Sản phẩm</TableHead>
                      <TableHead className='font-bold'>Biến động</TableHead>
                      <TableHead className='font-bold'>Lý do</TableHead>
                      <TableHead className='font-bold text-right'>Người thực hiện</TableHead>
                      <TableHead className='font-bold text-right'>Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => {
                      const diff = log.newStock - log.oldStock
                      const isIncrease = diff > 0
                      return (
                        <TableRow
                          key={log.id}
                          className='hover:bg-slate-50/30 transition-colors group'
                        >
                          <TableCell>
                            <div className='flex flex-col'>
                              <div className='font-bold text-slate-900 group-hover:text-blue-600 transition-colors'>
                                {log.productName}
                              </div>
                              <div className='text-xs text-slate-400'>ID SP: #{log.productId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              <div className='flex flex-col items-end'>
                                <span className='text-[10px] text-slate-400 line-through'>
                                  {log.oldStock}
                                </span>
                                <span className='font-bold text-slate-900'>{log.newStock}</span>
                              </div>
                              <div
                                className={cn(
                                  'flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm',
                                  isIncrease
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700',
                                )}
                              >
                                {isIncrease ? (
                                  <Plus className='w-2.5 h-2.5 mr-0.5' />
                                ) : (
                                  <Minus className='w-2.5 h-2.5 mr-0.5' />
                                )}
                                {Math.abs(diff)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='max-w-[250px]'>
                            <p className='text-sm text-slate-600 line-clamp-1 italic'>
                              {log.reason || 'Không có lý do'}
                            </p>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='text-sm font-medium text-slate-700'>
                              {log.changedByUserName}
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='text-xs text-slate-400 font-medium'>
                              {format(new Date(log.changedAt), 'dd/MM/yyyy HH:mm')}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {!logs.length && (
                  <div className='py-16 text-center text-slate-400 italic'>
                    Chưa có lịch sử biến động kho
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className='flex justify-center pt-4'>
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
            </div>
          )}
        </CardContent>
      </Card>

      <AdjustStockDialog
        isOpen={isAdjustOpen}
        productId={selectedProduct?.id || null}
        onClose={() => {
          setIsAdjustOpen(false)
          setSelectedProduct(null)
        }}
        onSuccess={fetchLogs}
      />
    </div>
  )
}
