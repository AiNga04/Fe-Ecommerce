'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supportService } from '@/services/support'
import { SupportTicketResponse, SUPPORT_SUBJECT_LABEL } from '@/types/support'
import { toast } from 'sonner'
import { Loader2, MessageSquare, User, Mail, Phone, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface ReplyTicketDialogProps {
  ticket: SupportTicketResponse | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ReplyTicketDialog({ ticket, isOpen, onClose, onSuccess }: ReplyTicketDialogProps) {
  const [replyMessage, setReplyMessage] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [markAsResolved, setMarkAsResolved] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!ticket || !replyMessage.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await supportService.replyTicket(ticket.id, {
        replyMessage,
        internalNote,
        markAsResolved,
      })
      if (res.data.success) {
        toast.success('Gửi phản hồi thành công')
        onSuccess()
        onClose()
        setReplyMessage('')
        setInternalNote('')
      }
    } catch (error) {
      console.error('Reply ticket error:', error)
      toast.error('Có lỗi xảy ra khi gửi phản hồi')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!ticket) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='w-5 h-5 text-blue-600' />
            Xử lý yêu cầu hỗ trợ #{ticket.id}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Ticket Information */}
          <div className='bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <Label className='text-[10px] uppercase text-slate-400 font-bold'>Khách hàng</Label>
                <div className='flex items-center gap-2 text-sm font-medium text-slate-900'>
                  <User className='w-3.5 h-3.5 text-slate-400' /> {ticket.name}
                </div>
              </div>
              <div className='space-y-1'>
                <Label className='text-[10px] uppercase text-slate-400 font-bold'>Chủ đề</Label>
                <div className='text-sm font-bold text-blue-600'>
                  {SUPPORT_SUBJECT_LABEL[ticket.subject]}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <Label className='text-[10px] uppercase text-slate-400 font-bold'>Liên hệ</Label>
                <div className='flex flex-col gap-0.5'>
                  <div className='flex items-center gap-2 text-xs text-slate-600'>
                    <Mail className='w-3 h-3' /> {ticket.email}
                  </div>
                  <div className='flex items-center gap-2 text-xs text-slate-600'>
                    <Phone className='w-3 h-3' /> {ticket.phone}
                  </div>
                </div>
              </div>
              <div className='space-y-1'>
                <Label className='text-[10px] uppercase text-slate-400 font-bold'>Ngày gửi</Label>
                <div className='flex items-center gap-2 text-xs text-slate-600 font-medium'>
                  <Calendar className='w-3 h-3' />{' '}
                  {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>
            </div>

            <div className='pt-2 border-t border-slate-200 mt-2'>
              <Label className='text-[10px] uppercase text-slate-400 font-bold'>
                Nội dung yêu cầu
              </Label>
              <p className='text-sm text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 italic'>
                "{ticket.message}"
              </p>
            </div>
          </div>

          {/* Reply Form */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='reply' className='font-bold text-slate-700'>
                Nội dung phản hồi (Gửi tới email khách hàng)
              </Label>
              <Textarea
                id='reply'
                placeholder='Nhập nội dung phản hồi cho khách hàng...'
                className='min-h-[120px] focus:ring-blue-500'
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='note' className='font-bold text-slate-700'>
                Ghi chú nội bộ (Chỉ Staff thấy)
              </Label>
              <Textarea
                id='note'
                placeholder='Nhập ghi chú nội bộ cho yêu cầu này...'
                className='min-h-[80px] bg-amber-50/30 border-amber-100 placeholder:text-amber-300'
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              />
            </div>

            <div className='flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100'>
              <Checkbox
                id='resolved'
                checked={markAsResolved}
                onCheckedChange={(checked) => setMarkAsResolved(!!checked)}
              />
              <label
                htmlFor='resolved'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700'
              >
                Đánh dấu là đã giải quyết (RESOLVED)
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className='border-t pt-4'>
          <Button variant='ghost' onClick={onClose} disabled={isSubmitting}>
            Bỏ qua
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700 min-w-[120px]'
            onClick={handleSubmit}
            disabled={isSubmitting || !replyMessage.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Đang xử lý...
              </>
            ) : (
              'Gửi phản hồi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
