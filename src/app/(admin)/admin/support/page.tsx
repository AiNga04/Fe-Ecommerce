'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'

import { SupportTicketTable } from '@/components/admin/support-ticket-table'
import { TicketDetailView } from '@/components/admin/ticket-detail-view'
import { supportService } from '@/services/support'

export default function AdminSupportPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)

  const { data: res } = useQuery({
    queryKey: ['support-ticket', selectedTicketId],
    queryFn: async () => {
      if (!selectedTicketId) return null
      const response = await supportService.getTicketById(selectedTicketId)
      return response.data
    },
    enabled: !!selectedTicketId,
  })

  if (selectedTicketId && res?.data) {
    return (
      <div className='p-6'>
        <TicketDetailView ticket={res.data} onBack={() => setSelectedTicketId(null)} />
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3'>
          <div className='w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center'>
            <MessageSquare className='h-6 w-6' />
          </div>
          Quản lý Hỗ trợ
        </h1>
        <p className='text-slate-500 font-medium'>
          Xem và phản hồi các yêu cầu hỗ trợ từ khách hàng.
        </p>
      </div>

      <SupportTicketTable isAdmin={true} onSelectTicket={(id: number) => setSelectedTicketId(id)} />
    </div>
  )
}
