import { http } from '@/lib/http'
import { IBackendRes } from '@/types/glubal'
import {
  SupportTicketRequest,
  SupportTicketResponse,
  SupportTicketReplyRequest,
  SupportStatus,
} from '@/types/support'

const PUBLIC_SUPPORT_PATH = '/support/tickets'
const ADMIN_SUPPORT_PATH = '/admin/support/tickets'

export const supportService = {
  // Public
  submitTicket: (payload: SupportTicketRequest) =>
    http.post<IBackendRes<void>>(PUBLIC_SUPPORT_PATH, payload),

  // Management (Admin/Staff)
  getAllTickets: (params?: {
    keyword?: string
    subject?: string
    status?: string
    processedById?: number
    page?: number
    size?: number
    sortBy?: string
    direction?: string
  }) =>
    http.get<IBackendRes<SupportTicketResponse[]>>(ADMIN_SUPPORT_PATH, {
      params,
    }),

  getTicketById: (id: number) =>
    http.get<IBackendRes<SupportTicketResponse>>(`${ADMIN_SUPPORT_PATH}/${id}`),

  updateTicketStatus: (id: number, status: SupportStatus) =>
    http.put<IBackendRes<void>>(`${ADMIN_SUPPORT_PATH}/${id}/status`, null, {
      params: { status },
    }),

  replyTicket: (id: number, payload: SupportTicketReplyRequest) =>
    http.put<IBackendRes<void>>(`${ADMIN_SUPPORT_PATH}/${id}/reply`, payload),
}
