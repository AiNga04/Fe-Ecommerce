export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface VnPayReturnResponse {
  orderCode: string
  paymentStatus: PaymentStatus
  vnpResponseCode: string
  vnpTransactionStatus: string
  vnpTransactionNo: string
  vnpBankCode: string
  vnpAmount: string
  vnpPayDate: string
  message: string
}
