'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SupportTicketTable } from './support-ticket-table'
import { TicketDetailView } from './ticket-detail-view'
import { supportService } from '@/services/support'
import { Skeleton } from '@/components/ui/skeleton'

interface SupportPageContentProps {
  isAdmin?: boolean
}

export function SupportPageContent({ isAdmin = false }: SupportPageContentProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)

  const { data: ticket, isLoading: isLoadingTicket } = useQuery({
    queryKey: ['support-ticket', selectedTicketId],
    queryFn: async () => {
      if (!selectedTicketId) return null
      const res = await supportService.getTicketById(selectedTicketId)
      return res.data.data || null
    },
    enabled: !!selectedTicketId,
  })

  if (selectedTicketId && ticket) {
    return <TicketDetailView ticket={ticket} onBack={() => setSelectedTicketId(null)} />
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900'>Hỗ trợ & Khiếu nại</h1>
        <p className='text-slate-500 text-sm mt-1'>
          Quản lý và giải quyết các yêu cầu hỗ trợ từ khách hàng.
        </p>
      </div>

      <SupportTicketTable isAdmin={isAdmin} onSelectTicket={(id) => setSelectedTicketId(id)} />
    </div>
  )
}
