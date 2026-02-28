import { http } from '@/lib/http'
import { IBackendRes } from '@/types/glubal'
import {
  SupportTicketRequest,
  SupportTicketResponse,
  SupportTicketReplyRequest,
} from '@/types/support'

const SUPPORT_PATH = '/support/tickets'

export const supportService = {
  // Public
  submitTicket: (payload: SupportTicketRequest) =>
    http.post<IBackendRes<void>>(SUPPORT_PATH, payload),

  // Management (Admin/Staff)
  getAllTickets: (params?: {
    keyword?: string
    subject?: string
    status?: string
    processedById?: number
    page?: number
    size?: number
  }) =>
    http.get<IBackendRes<SupportTicketResponse[]>>(`${SUPPORT_PATH}`, {
      params,
    }),

  getTicketById: (id: number) =>
    http.get<IBackendRes<SupportTicketResponse>>(`${SUPPORT_PATH}/${id}`),

  replyTicket: (id: number, payload: SupportTicketReplyRequest) =>
    http.put<IBackendRes<void>>(`${SUPPORT_PATH}/${id}/reply`, payload),

  deleteTicket: (id: number) => http.delete<IBackendRes<void>>(`${SUPPORT_PATH}/${id}`),
}
