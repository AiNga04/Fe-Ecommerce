import { http } from '@/lib/http'

export interface RevenueStatResponse {
  date: string
  revenue: number
}

export interface RevenueDashboardResponse {
  totalRevenue: number
  growthRate: number
  dailyStats: RevenueStatResponse[]
}

export interface OrderStatResponse {
  totalOrders: number
  byStatus: Record<string, number>
}

export interface TopProductResponse {
  productId: number
  productName: string
  imageUrl: string
  totalSold: number
  totalRevenue: number
}

export interface LowStockResponse {
  productId: number
  productName: string
  imageUrl: string
  sizeName: string
  stock: number
}

export interface UserStatResponse {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  disabledUsers: number
  newUsersToday: number
}

export interface DailyOrderStatResponse {
  date: string
  orderCount: number
  totalRevenue: number
}

const DASHBOARD_PATH = '/dashboard'

export const dashboardService = {
  getRevenueStats: (from?: string, to?: string) => {
    return http.get<IBackendRes<RevenueDashboardResponse>>(`${DASHBOARD_PATH}/revenue`, {
      params: { from, to },
    })
  },
  getOrderStats: () => {
    return http.get<IBackendRes<OrderStatResponse>>(`${DASHBOARD_PATH}/orders/summary`)
  },
  getTopSellingProducts: (limit: number = 5) => {
    return http.get<IBackendRes<TopProductResponse[]>>(`${DASHBOARD_PATH}/top-products`, {
      params: { limit },
    })
  },
  getLowStockProducts: (threshold: number = 10) => {
    return http.get<IBackendRes<LowStockResponse[]>>(`${DASHBOARD_PATH}/low-stock`, {
      params: { threshold },
    })
  },
  getDailyOrderStats: (from?: string, to?: string) => {
    return http.get<IBackendRes<DailyOrderStatResponse[]>>(`${DASHBOARD_PATH}/orders/daily-chart`, {
      params: { from, to },
    })
  },
  getUserStats: () => {
    return http.get<IBackendRes<UserStatResponse>>(`${DASHBOARD_PATH}/users/summary`)
  },
}
