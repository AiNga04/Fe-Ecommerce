'use client'

import React, { useEffect, useState } from 'react'
import { supportService } from '@/services/support'
import { SupportTicketResponse, SUPPORT_SUBJECT_LABEL, SUPPORT_STATUS_LABEL } from '@/types/support'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  User,
  Mail,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import { ReplyTicketDialog } from '@/components/staff/support/reply-ticket-dialog'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { cn } from '@/lib/utils'

export default function StaffSupportPage() {
  const [tickets, setTickets] = useState<SupportTicketResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(0)

  // Reply dialog state
  const [replyDialog, setReplyDialog] = useState<{
    isOpen: boolean
    ticket: SupportTicketResponse | null
  }>({
    isOpen: false,
    ticket: null,
  })

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      const res = await supportService.getAllTickets({
        page,
        size: 10,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        keyword: search || undefined,
      })
      if (res.data.success) {
        setTickets(res.data.data || [])
      }
    } catch (error) {
      console.error('Fetch tickets error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách hỗ trợ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [page, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTickets()
  }

  const getStatusBadge = (status: string) => {
    if (status === 'RESOLVED') {
      return (
        <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none flex items-center gap-1 w-fit'>
          <CheckCircle2 className='w-3 h-3' /> Đã giải quyết
        </Badge>
      )
    }
    return (
      <Badge className='bg-amber-100 text-amber-700 hover:bg-amber-100 border-none flex items-center gap-1 w-fit'>
        <Clock className='w-3 h-3' /> Chờ xử lý
      </Badge>
    )
  }

  const getSubjectBadge = (subject: string) => {
    const label = SUPPORT_SUBJECT_LABEL[subject as keyof typeof SUPPORT_SUBJECT_LABEL] || subject
    return (
      <Badge variant='outline' className='bg-slate-50 text-slate-600 border-slate-200 text-[10px]'>
        {label}
      </Badge>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Hỗ trợ & Khiếu nại</h1>
          <p className='text-slate-500 text-sm'>Tiếp nhận và xử lý các yêu cầu từ khách hàng</p>
        </div>
      </div>

      <Card className='shadow-sm border-slate-200'>
        <CardHeader className='pb-3'>
          <form onSubmit={handleSearch} className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                placeholder='Tìm theo nội dung, tên khách...'
                className='pl-10 bg-white'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full md:w-auto'>
              <Filter className='w-4 h-4 text-slate-500' />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full md:w-[200px]'>
                  <SelectValue placeholder='Trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
                  <SelectItem value='PENDING'>Đang chờ xử lý</SelectItem>
                  <SelectItem value='RESOLVED'>Đã giải quyết</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type='submit' variant='outline' className='hidden md:flex'>
              Tìm kiếm
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {isLoading && !tickets.length ? (
            <div className='py-20 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='rounded-xl border border-slate-100 overflow-hidden'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='font-bold'>Khách hàng</TableHead>
                    <TableHead className='font-bold'>Yêu cầu</TableHead>
                    <TableHead className='font-bold'>Trạng thái</TableHead>
                    <TableHead className='font-bold'>Người xử lý</TableHead>
                    <TableHead className='w-[150px] text-right font-bold'>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className='hover:bg-slate-50/30 transition-colors group'
                    >
                      <TableCell>
                        <div className='flex flex-col gap-1'>
                          <div className='font-bold text-slate-900'>{ticket.customerName}</div>
                          <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                            <Mail className='w-3 h-3' /> {ticket.customerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-[300px]'>
                        <div className='flex flex-col gap-1.5'>
                          {getSubjectBadge(ticket.subject)}
                          <p className='text-sm text-slate-600 line-clamp-2 leading-tight'>
                            {ticket.message}
                          </p>
                          <div className='text-[10px] text-slate-400'>
                            {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.processedByName ? (
                          <div className='flex items-center gap-2'>
                            <div className='w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center'>
                              <span className='text-[10px] font-bold text-blue-600'>S</span>
                            </div>
                            <div className='text-xs font-medium text-slate-700'>
                              {ticket.processedByName}
                            </div>
                          </div>
                        ) : (
                          <span className='text-[10px] text-slate-400 italic'>Chưa có</span>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant={ticket.status === 'PENDING' ? 'default' : 'outline'}
                          size='sm'
                          className={cn(
                            'h-8 px-3',
                            ticket.status === 'PENDING'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'text-slate-500',
                          )}
                          onClick={() =>
                            setReplyDialog({
                              isOpen: true,
                              ticket: ticket,
                            })
                          }
                        >
                          {ticket.status === 'PENDING' ? 'Xử lý ngay' : 'Xem lại'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!tickets.length && (
                <div className='py-12 text-center text-slate-400 italic'>
                  <ShieldAlert className='w-8 h-8 mx-auto mb-2 opacity-20' />
                  Không tìm thấy yêu cầu nào
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ReplyTicketDialog
        isOpen={replyDialog.isOpen}
        ticket={replyDialog.ticket}
        onClose={() => setReplyDialog({ ...replyDialog, isOpen: false })}
        onSuccess={fetchTickets}
      />
    </div>
  )
}
