export type SupportSubject = 'TUVAN' | 'KIEU_NAI' | 'DOITRA' | 'KHAC'

export type SupportStatus = 'PENDING' | 'RESOLVED'

export const SUPPORT_SUBJECT_LABEL: Record<SupportSubject, string> = {
  TUVAN: 'Tư vấn sản phẩm',
  KIEU_NAI: 'Khiếu nại dịch vụ',
  DOITRA: 'Đổi trả hàng',
  KHAC: 'Vấn đề khác',
}

export const SUPPORT_STATUS_LABEL: Record<SupportStatus, string> = {
  PENDING: 'Đang chờ xử lý',
  RESOLVED: 'Đã giải quyết',
}

export interface SupportTicketResponse {
  id: number
  customerName: string
  customerPhone: string
  customerEmail: string
  subject: SupportSubject
  message: string
  status: SupportStatus
  createdAt: string
  processedById: number | null
  processedByName: string | null
  replyMessage: string | null
  internalNote: string | null
  processedAt: string | null
}

export interface SupportTicketRequest {
  customerName: string
  customerPhone: string
  customerEmail: string
  subject: SupportSubject
  message: string
}

export interface SupportTicketReplyRequest {
  replyMessage: string
  internalNote?: string
  markAsResolved?: boolean
}
