import { http } from '@/lib/http'
import { VnPayReturnResponse } from '@/types/payment'

export const paymentService = {
  createVnPayUrl: (orderId: number) => {
    return http.post<IBackendRes<string>>(`/payments/vnpay/create`, null, {
      params: { orderId },
    })
  },
  handleVnPayReturn: (params: any) => {
    return http.get<IBackendRes<VnPayReturnResponse>>(`/payments/vnpay/return`, {
      params,
    })
  },
}
