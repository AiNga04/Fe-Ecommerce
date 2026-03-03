import { http } from '@/lib/http'
import { Order, OrderSearchParams } from '@/types/order'

const ORDER_PATH = '/orders'

export interface CheckoutCartRequest {
  cartItemIds: number[]
  shippingName?: string
  shippingPhone?: string
  shippingAddress?: string
  shippingAddressId?: number
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE'
  voucherCode?: string
  shippingVoucherCode?: string
}

export const orderService = {
  // ... existing methods
  checkoutCart: (data: CheckoutCartRequest) => {
    return http.post<IBackendRes<any>>(`${ORDER_PATH}/checkout/carts`, data)
  },
  getMyOrders: (params?: OrderSearchParams) => {
    // ...
    return http.get<IBackendRes<Order[]>>(`${ORDER_PATH}/my`, {
      params,
    })
  },
  getOrderById: (id: number | string) => {
    return http.get<IBackendRes<Order>>(`${ORDER_PATH}/${id}`)
  },
  getAdminOrderById: (id: number | string) => {
    return http.get<IBackendRes<Order>>(`${ORDER_PATH}/admin/${id}`)
  },
  getOrders: (params?: OrderSearchParams) => {
    return http.get<IBackendRes<Order[]>>(`${ORDER_PATH}/admin`, { params })
  },
  updateOrderStatus: (id: number | string, status: string) => {
    return http.patch<IBackendRes<Order>>(`${ORDER_PATH}/${id}/status`, { status })
  },
  confirmReceived: (id: number | string) => {
    return http.post<IBackendRes<Order>>(`${ORDER_PATH}/my/${id}/confirm-received`, {})
  },
}
