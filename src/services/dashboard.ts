import { http } from '@/lib/http'
import { RevenueStats, OrderStats, TopProduct, LowStockProduct, UserStats } from '@/types/dashboard'

const DASHBOARD_PATH = '/dashboard'

export const dashboardService = {
  getRevenueStats: (from?: string, to?: string) => {
    return http.get<IBackendRes<RevenueStats>>(`${DASHBOARD_PATH}/revenue`, {
      params: { from, to },
    })
  },

  getOrderStats: () => {
    return http.get<IBackendRes<OrderStats>>(`${DASHBOARD_PATH}/orders/summary`)
  },

  getTopProducts: (limit: number = 5) => {
    return http.get<IBackendRes<TopProduct[]>>(`${DASHBOARD_PATH}/top-products`, {
      params: { limit },
    })
  },

  getLowStockProducts: (threshold: number = 10) => {
    return http.get<IBackendRes<LowStockProduct[]>>(`${DASHBOARD_PATH}/low-stock`, {
      params: { threshold },
    })
  },

  getUserStats: () => {
    return http.get<IBackendRes<UserStats>>(`${DASHBOARD_PATH}/users/summary`)
  },
}
