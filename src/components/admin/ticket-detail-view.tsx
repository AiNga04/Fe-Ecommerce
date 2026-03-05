'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Send,
  History,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SupportTicketResponse, SUPPORT_STATUS_LABEL, SUPPORT_SUBJECT_LABEL } from '@/types/support'
import { supportService } from '@/services/support'
import { cn } from '@/lib/utils'

interface TicketDetailViewProps {
  ticket: SupportTicketResponse
  onBack: () => void
}

export function TicketDetailView({ ticket, onBack }: TicketDetailViewProps) {
  const queryClient = useQueryClient()
  const [replyMessage, setReplyMessage] = useState('')
  const [internalNote, setInternalNote] = useState(ticket.internalNote || '')
  const [markAsResolved, setMarkAsResolved] = useState(ticket.status === 'RESOLVED')

  const replyMutation = useMutation({
    mutationFn: (data: { replyMessage: string; internalNote: string; markAsResolved: boolean }) =>
      supportService.replyTicket(ticket.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['support-ticket', ticket.id] })
      toast.success('Cập nhật phản hồi thành công')
      setReplyMessage('')
    },
    onError: (error: any) => {
      toast.error('Có lỗi xảy ra', {
        description: error.response?.data?.message || 'Không thể gửi phản hồi lúc này.',
      })
    },
  })

  const handleReply = () => {
    if (!replyMessage && !internalNote && markAsResolved === (ticket.status === 'RESOLVED')) {
      toast.error('Vui lòng nhập nội dung phản hồi hoặc ghi chú')
      return
    }
    replyMutation.mutate({
      replyMessage,
      internalNote,
      markAsResolved,
    })
  }

  return (
    <div className='w-full space-y-6'>
      {/* Header - matching product detail page style */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={onBack}
            className='rounded-full w-10 h-10 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm transition-all'
          >
            <ChevronLeft className='w-5 h-5' />
          </Button>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
                Chi tiết yêu cầu hỗ trợ
              </h1>
              <Badge
                variant='outline'
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-none',
                  ticket.status === 'PENDING'
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200',
                )}
              >
                {SUPPORT_STATUS_LABEL[ticket.status]}
              </Badge>
            </div>
            <p className='text-sm text-slate-500 font-medium mt-1'>
              Mã yêu cầu:{' '}
              <span className='text-slate-900'>#{ticket.id.toString().padStart(5, '0')}</span>
            </p>
          </div>
        </div>

        {ticket.subject === 'DONHANG' && (
          <Button
            variant='outline'
            className='border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm gap-2 rounded-2xl'
          >
            Hỗ trợ đơn hàng
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Customer Info & Status */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Customer Info Card */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <User className='h-4 w-4 text-slate-400' />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center gap-4 pt-2'>
                <div className='w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm'>
                  <span className='font-bold text-lg'>{ticket.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className='font-bold text-slate-900 text-lg leading-tight'>{ticket.name}</p>
                  <p className='text-xs text-slate-500 mt-0.5'>Khách hàng</p>
                </div>
              </div>

              <div className='space-y-4 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-slate-50 last:border-0'>
                  <span className='text-slate-500 flex items-center gap-2'>
                    <Mail className='h-4 w-4' /> Email
                  </span>
                  <span className='font-medium text-slate-900'>{ticket.email}</span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-slate-50 last:border-0'>
                  <span className='text-slate-500 flex items-center gap-2'>
                    <Phone className='h-4 w-4' /> Điện thoại
                  </span>
                  <span className='font-medium text-slate-900'>{ticket.phone}</span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-slate-50 last:border-0'>
                  <span className='text-slate-500 flex items-center gap-2'>
                    <Clock className='h-4 w-4' /> Ngày gửi
                  </span>
                  <span className='font-medium text-slate-900'>
                    {format(new Date(ticket.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Handling Info */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-slate-400' />
                Trạng thái xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-sm text-slate-500 font-medium'>Người xử lý</Label>
                <div className='flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-xl'>
                  <User className='h-4 w-4 text-slate-400' />
                  {ticket.processedByName || 'Đang chờ tiếp nhận'}
                </div>
              </div>
              {ticket.updatedAt && (
                <div className='text-xs text-slate-400 italic'>
                  Lần cập nhật cuối:{' '}
                  {format(new Date(ticket.updatedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Message & Reply */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Main Content Card */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='flex flex-row items-center justify-between pb-3'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <MessageSquare className='h-4 w-4 text-slate-400' />
                Nội dung yêu cầu
              </CardTitle>
              <Badge
                variant='outline'
                className='bg-blue-50 text-blue-600 border-blue-200 rounded-lg text-[11px] font-semibold px-2 py-0.5'
              >
                {SUPPORT_SUBJECT_LABEL[ticket.subject]}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-slate-600 whitespace-pre-line leading-relaxed'>
                {ticket.message}
              </p>
            </CardContent>
          </Card>

          {/* Reply & Action Card */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='pb-3 border-b border-slate-100 mb-6'>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <Send className='h-4 w-4 text-slate-400' />
                Trao đổi & Xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-8'>
              {/* Internal Note */}
              <div className='space-y-3'>
                <Label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <History className='h-4 w-4 text-slate-400' />
                  Ghi chú nội bộ (Chỉ nhân viên thấy)
                </Label>
                <Textarea
                  placeholder='Cập nhật lịch sử xử lý, ví dụ: Đã gọi điện tư vấn thêm...'
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className='bg-slate-50 border-slate-100 focus:bg-white focus:border-slate-300 rounded-xl min-h-[100px] text-sm p-4 transition-all'
                />
              </div>

              {/* Reply Message */}
              <div className='space-y-3'>
                <Label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-slate-400' />
                  Phản hồi khách hàng (Gửi qua Email)
                </Label>
                <Textarea
                  placeholder='Nội dung gửi đến email khách hàng...'
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className='bg-slate-50 border-slate-100 focus:bg-white focus:border-slate-300 rounded-xl min-h-[140px] text-sm p-4 transition-all'
                />
                {ticket.replyMessage && (
                  <div className='mt-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100'>
                    <p className='text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2'>
                      <CheckCircle2 className='h-3.5 w-3.5' />
                      Đã gửi phản hồi:
                    </p>
                    <p className='text-sm text-emerald-900 font-medium leading-relaxed'>
                      {ticket.replyMessage}
                    </p>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100'>
                <div className='flex items-center gap-4'>
                  <Switch
                    id='resolve-mode'
                    checked={markAsResolved}
                    onCheckedChange={setMarkAsResolved}
                  />
                  <Label
                    htmlFor='resolve-mode'
                    className='font-semibold text-slate-900 cursor-pointer text-sm'
                  >
                    Đánh dấu là đã giải quyết xong
                  </Label>
                </div>
                <Button
                  disabled={replyMutation.isPending}
                  onClick={handleReply}
                  className='bg-slate-900 hover:bg-black text-white px-8 rounded-xl font-bold h-12 gap-2 shadow-sm transition-all'
                >
                  {replyMutation.isPending ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <CheckCircle2 className='h-4 w-4' />
                  )}
                  Cập nhật xử lý
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
