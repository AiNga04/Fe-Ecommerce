'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supportService } from '@/services/support'
import {
  SupportStatus,
  SupportSubject,
  SUPPORT_STATUS_LABEL,
  SUPPORT_SUBJECT_LABEL,
} from '@/types/support'
import { Skeleton } from '@/components/ui/skeleton'

interface SupportTicketTableProps {
  isAdmin?: boolean
  onSelectTicket?: (id: number) => void
}

export function SupportTicketTable({ isAdmin = false, onSelectTicket }: SupportTicketTableProps) {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>('ALL')
  const [subject, setSubject] = useState<string>('ALL')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const { data: res, isLoading } = useQuery({
    queryKey: ['support-tickets', keyword, status, subject, page, pageSize],
    queryFn: async () => {
      const response = await supportService.getAllTickets({
        keyword: keyword || undefined,
        status: status === 'ALL' ? undefined : status,
        subject: subject === 'ALL' ? undefined : subject,
        page,
        size: pageSize,
      })
      return response.data
    },
  })

  const payloadData: any = res?.data || []
  const ticketList = Array.isArray(payloadData) ? payloadData : payloadData.content || []
  const pagination = res?.pagination || (payloadData as any)
  const totalPages = pagination?.totalPages || 0
  const totalElements = pagination?.totalElements || ticketList.length

  const getStatusBadge = (status: SupportStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant='outline'
            className='bg-amber-50 text-amber-700 border-amber-200 gap-1 font-medium'
          >
            <Clock className='h-3 w-3' />
            {SUPPORT_STATUS_LABEL[status]}
          </Badge>
        )
      case 'RESOLVED':
        return (
          <Badge
            variant='outline'
            className='bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-medium'
          >
            <CheckCircle2 className='h-3 w-3' />
            {SUPPORT_STATUS_LABEL[status]}
          </Badge>
        )
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  return (
    <div className='space-y-6'>
      {/* Filters - reviews style */}
      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm'>
        <div className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
          <Input
            placeholder='Tìm theo tên, email, sđt...'
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPage(0)
            }}
            className='pl-10 h-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg'
          />
          {keyword && (
            <button
              onClick={() => {
                setKeyword('')
                setPage(0)
              }}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v)
            setPage(0)
          }}
        >
          <SelectTrigger className='w-[160px] bg-slate-50/50 border-slate-200'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
            <SelectItem value='PENDING'>Chờ xử lý</SelectItem>
            <SelectItem value='RESOLVED'>Đã xử lý</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={subject}
          onValueChange={(v) => {
            setSubject(v)
            setPage(0)
          }}
        >
          <SelectTrigger className='w-[180px] bg-slate-50/50 border-slate-200'>
            <SelectValue placeholder='Chủ đề' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>Tất cả chủ đề</SelectItem>
            <SelectItem value='TUVAN'>
              <span className='font-medium text-blue-600'>Tư vấn</span>
            </SelectItem>
            <SelectItem value='DONHANG'>
              <span className='font-medium text-emerald-600'>Đơn hàng</span>
            </SelectItem>
            <SelectItem value='DOITRA'>
              <span className='font-medium text-orange-600'>Đổi trả</span>
            </SelectItem>
            <SelectItem value='HOPTAC'>
              <span className='font-medium text-purple-600'>Hợp tác</span>
            </SelectItem>
            <SelectItem value='KHAC'>
              <span className='font-medium text-slate-600'>Khác</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table - reviews style Card wrapper */}
      <Card className='shadow-sm border-slate-200'>
        <CardContent className='p-0'>
          {isLoading && !ticketList.length ? (
            <div className='rounded-md overflow-hidden'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='min-w-[150px]'>Khách hàng</TableHead>
                    <TableHead className='min-w-[120px]'>Chủ đề</TableHead>
                    <TableHead className='min-w-[200px]'>Nội dung</TableHead>
                    <TableHead className='min-w-[130px]'>Trạng thái</TableHead>
                    <TableHead className='min-w-[130px]'>Người xử lý</TableHead>
                    <TableHead className='min-w-[120px]'>Ngày gửi</TableHead>
                    <TableHead className='text-right min-w-[100px]'>Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className='h-5 w-full' />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Skeleton className='h-8 w-8 rounded-full' />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='rounded-md overflow-hidden flex overflow-x-auto'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='min-w-[150px]'>Khách hàng</TableHead>
                    <TableHead className='min-w-[120px]'>Chủ đề</TableHead>
                    <TableHead className='min-w-[200px]'>Nội dung</TableHead>
                    <TableHead className='min-w-[130px]'>Trạng thái</TableHead>
                    <TableHead className='min-w-[130px]'>Người xử lý</TableHead>
                    <TableHead className='min-w-[120px]'>Ngày gửi</TableHead>
                    <TableHead className='text-right min-w-[100px]'>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketList.map((ticket: any) => (
                    <TableRow
                      key={ticket.id}
                      className='hover:bg-slate-50/30 transition-colors group'
                    >
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900'>{ticket.name}</span>
                          <span className='text-xs text-slate-500'>{ticket.email}</span>
                          <span className='text-xs text-slate-400 font-medium'>{ticket.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className='font-medium text-slate-700'>
                          {SUPPORT_SUBJECT_LABEL[ticket.subject as SupportSubject] ||
                            ticket.subject}
                        </span>
                      </TableCell>
                      <TableCell className='max-w-[240px]'>
                        <p className='truncate text-slate-600 text-sm italic'>"{ticket.message}"</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.processedByName || ticket.assignedToName ? (
                          <div className='flex items-center gap-2 text-sm font-medium text-slate-600'>
                            <div className='w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center'>
                              <User className='h-3 w-3' />
                            </div>
                            {ticket.processedByName || ticket.assignedToName}
                          </div>
                        ) : (
                          <span className='text-xs text-slate-400 italic'>Chưa gán</span>
                        )}
                      </TableCell>
                      <TableCell className='text-slate-500 text-sm'>
                        {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                            title='Xem chi tiết'
                            onClick={() => onSelectTicket?.(ticket.id)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {ticketList.length === 0 && (
                <div className='py-20 text-center flex flex-col items-center justify-center text-slate-400 w-full'>
                  <MessageSquare className='w-12 h-12 mb-3 opacity-10' />
                  <p className='italic'>Không tìm thấy yêu cầu nào phù hợp</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination - same style as reviews */}
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
            <span>yêu cầu mỗi trang</span>
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
    </div>
  )
}
