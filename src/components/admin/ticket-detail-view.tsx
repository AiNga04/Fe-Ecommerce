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
      {/* Header */}
      <div className='flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full h-10 w-10 border-slate-200'
            onClick={onBack}
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-xl font-bold text-slate-900'>Chi tiết yêu cầu hỗ trợ</h1>
            <p className='text-sm text-slate-400 font-medium'>
              Mã yêu cầu: #{ticket.id.toString().padStart(5, '0')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Badge
            variant='outline'
            className={`${
              ticket.status === 'PENDING'
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            } px-4 py-1.5 rounded-full text-sm font-bold`}
          >
            {SUPPORT_STATUS_LABEL[ticket.status]}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Customer Info & Status */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Customer Info Card */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='bg-slate-50/50 pb-4'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2'>
                <User className='h-4 w-4' />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6 space-y-5'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0'>
                  <span className='font-bold'>{ticket.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className='font-bold text-slate-900 leading-tight'>{ticket.name}</p>
                  <p className='text-xs text-slate-400 font-medium italic'>Khách hàng</p>
                </div>
              </div>

              <Separator className='bg-slate-100' />

              <div className='space-y-4'>
                <div className='flex items-center gap-3 text-sm'>
                  <Mail className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600 font-medium'>{ticket.email}</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <Phone className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600 font-medium'>{ticket.phone}</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <Clock className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600 font-medium'>
                    Gửi lúc:{' '}
                    {format(new Date(ticket.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Handling Info */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='bg-slate-50/50 pb-4'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4' />
                Trạng thái xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6 space-y-4'>
              <div className='space-y-2'>
                <Label className='text-xs text-slate-400 uppercase font-black tracking-widest'>
                  Người xử lý
                </Label>
                <div className='flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 p-3 rounded-xl'>
                  <User className='h-4 w-4' />
                  {ticket.processedByName || 'Đang chờ tiếp nhận'}
                </div>
              </div>
              {ticket.updatedAt && (
                <div className='text-xs text-slate-400 font-medium italic'>
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
            <CardHeader className='bg-slate-50/50 pb-4'>
              <div className='flex items-center justify-between w-full'>
                <CardTitle className='text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2'>
                  <MessageSquare className='h-4 w-4' />
                  Nội dung yêu cầu
                </CardTitle>
                <Badge variant='outline' className='bg-blue-50 text-blue-600 border-blue-200'>
                  {SUPPORT_SUBJECT_LABEL[ticket.subject]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='bg-slate-50 p-6 rounded-2xl border border-slate-100'>
                <p className='text-slate-900 leading-relaxed font-medium text-lg italic'>
                  "{ticket.message}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reply & Action Card */}
          <Card className='rounded-2xl border-slate-100 shadow-sm overflow-hidden'>
            <CardHeader className='bg-slate-50/50 pb-4 border-b border-slate-100'>
              <CardTitle className='text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2'>
                <Send className='h-4 w-4' />
                Trao đổi & Xử lý
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6 space-y-6'>
              {/* Internal Note */}
              <div className='space-y-3'>
                <Label className='text-sm font-bold flex items-center gap-2'>
                  <History className='h-4 w-4 text-slate-400' />
                  Ghi chú nội bộ (Chỉ nhân viên thấy)
                </Label>
                <Textarea
                  placeholder='Cập nhật lịch sử xử lý, ví dụ: Đã gọi điện tư vấn thêm...'
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl min-h-[100px]'
                />
              </div>

              {/* Reply Message */}
              <div className='space-y-3'>
                <Label className='text-sm font-bold flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-slate-400' />
                  Phản hồi khách hàng (Gửi qua Email)
                </Label>
                <Textarea
                  placeholder='Nội dung gửi đến email khách hàng...'
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className='bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl min-h-[120px]'
                />
                {ticket.replyMessage && (
                  <div className='mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100'>
                    <p className='text-xs font-bold text-emerald-700 uppercase mb-2'>
                      Đã gửi phản hồi:
                    </p>
                    <p className='text-sm text-emerald-900'>{ticket.replyMessage}</p>
                  </div>
                )}
              </div>

              <Separator className='bg-slate-100' />

              <div className='flex items-center justify-between bg-slate-50 p-4 rounded-xl'>
                <div className='flex items-center gap-3'>
                  <Switch
                    id='resolve-mode'
                    checked={markAsResolved}
                    onCheckedChange={setMarkAsResolved}
                  />
                  <Label htmlFor='resolve-mode' className='font-bold text-slate-900 cursor-pointer'>
                    Đánh dấu là đã giải quyết xong
                  </Label>
                </div>
                <Button
                  disabled={replyMutation.isPending}
                  onClick={handleReply}
                  className='bg-slate-900 hover:bg-black text-white px-8 rounded-xl font-bold h-12 gap-2'
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
