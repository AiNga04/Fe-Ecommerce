export type SupportSubject = 'TUVAN' | 'DONHANG' | 'DOITRA' | 'HOPTAC' | 'KHAC'

export type SupportStatus = 'PENDING' | 'RESOLVED'

export const SUPPORT_SUBJECT_LABEL: Record<SupportSubject, string> = {
  TUVAN: 'Tư vấn sản phẩm',
  DONHANG: 'Hỗ trợ đơn hàng',
  DOITRA: 'Đổi trả hàng',
  HOPTAC: 'Hợp tác kinh doanh',
  KHAC: 'Vấn đề khác',
}

export const SUPPORT_STATUS_LABEL: Record<SupportStatus, string> = {
  PENDING: 'Đang chờ xử lý',
  RESOLVED: 'Đã giải quyết',
}

export interface SupportTicketResponse {
  id: number
  name: string
  phone: string
  email: string
  subject: SupportSubject
  message: string
  status: SupportStatus
  processedById: number | null
  processedByName: string | null
  internalNote: string | null
  replyMessage: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface SupportTicketRequest {
  name: string
  phone: string
  email: string
  subject: SupportSubject
  message: string
}

export interface SupportTicketReplyRequest {
  replyMessage: string
  internalNote?: string
  markAsResolved?: boolean
}
