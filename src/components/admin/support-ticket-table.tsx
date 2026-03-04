'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, MoreHorizontal, Eye, CheckCircle2, Clock, User, MessageSquare } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

  const { data: res, isLoading } = useQuery({
    queryKey: ['support-tickets', keyword, status, subject],
    queryFn: async () => {
      const response = await supportService.getAllTickets({
        keyword: keyword || undefined,
        status: status === 'ALL' ? undefined : status,
        subject: subject === 'ALL' ? undefined : subject,
      })
      return response.data
    },
  })

  const ticketList = res?.data || []

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
      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm'>
        <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <Input
              placeholder='Tìm theo tên, email, sđt...'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className='pl-9 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200'
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className='w-[160px] bg-slate-50 border-transparent'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
              <SelectItem value='PENDING'>Chờ xử lý</SelectItem>
              <SelectItem value='RESOLVED'>Đã xử lý</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className='w-[180px] bg-slate-50 border-transparent'>
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
              <SelectItem value='KHAC'>
                <span className='font-medium text-slate-600'>Khác</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='text-sm text-slate-400 font-medium whitespace-nowrap'>
          Hiển thị {ticketList.length} kết quả
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className='bg-slate-50/50'>
            <TableRow>
              <TableHead className='font-bold text-slate-900'>Khách hàng</TableHead>
              <TableHead className='font-bold text-slate-900'>Chủ đề</TableHead>
              <TableHead className='font-bold text-slate-900'>Nội dung</TableHead>
              <TableHead className='font-bold text-slate-900'>Trạng thái</TableHead>
              <TableHead className='font-bold text-slate-900'>Người xử lý</TableHead>
              <TableHead className='font-bold text-slate-900'>Ngày gửi</TableHead>
              <TableHead className='w-[80px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
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
              ))
            ) : ticketList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-64 text-center'>
                  <div className='flex flex-col items-center justify-center text-slate-400'>
                    <MessageSquare className='h-12 w-12 mb-4 opacity-20' />
                    <p className='text-lg font-medium'>Không tìm thấy yêu cầu nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              ticketList.map((ticket: any) => (
                <TableRow key={ticket.id} className='hover:bg-slate-50/50 transition-colors group'>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-bold text-slate-900'>{ticket.name}</span>
                      <span className='text-xs text-slate-500'>{ticket.email}</span>
                      <span className='text-xs text-slate-400 font-medium'>{ticket.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-slate-700'>
                      {SUPPORT_SUBJECT_LABEL[ticket.subject as SupportSubject] || ticket.subject}
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0 rounded-full hover:bg-slate-200'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-48 rounded-xl'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem
                          className='gap-2 cursor-pointer'
                          onClick={() => onSelectTicket?.(ticket.id)}
                        >
                          <Eye className='h-4 w-4' /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-red-600 gap-2 cursor-pointer'>
                          Xóa yêu cầu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
