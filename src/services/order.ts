import { http } from '@/lib/http'
import { Order, OrderSearchParams } from '@/types/order'

const ORDER_PATH = '/orders'

export const orderService = {
  getMyOrders: (params?: OrderSearchParams) => {
    return http.get<IBackendRes<Order[]>>(`${ORDER_PATH}/my`, {
      params,
    })
  },
  getOrderById: (id: number | string) => {
    return http.get<IBackendRes<Order>>(`${ORDER_PATH}/${id}`)
  },
}
