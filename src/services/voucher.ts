import { http } from '@/lib/http'

export interface Voucher {
  id: number
  code: string
  name: string
  description: string
  type: 'FREESHIP' | 'FIXED_AMOUNT' | 'PERCENTAGE'
  scope: 'GLOBAL'
  discountValue: number
  maxDiscountAmount: number | null
  minOrderValue: number
  maxUsagePerUser: number
  maxUsage: number
  usedCount: number
  status: 'ACTIVE'
  startDate: string
  endDate: string
}

export const voucherService = {
  getActiveVouchers: () => {
    return http.get<IBackendRes<Voucher[]>>('/vouchers/active')
  },
}
