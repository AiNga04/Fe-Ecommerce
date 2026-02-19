export interface DailyRevenue {
  date: string
  revenue: number
}

export interface RevenueStats {
  totalRevenue: number
  growthRate: number
  dailyStats: DailyRevenue[]
}

export interface OrderStats {
  totalOrders: number
  byStatus: Record<string, number>
}

export interface TopProduct {
  productId: number
  name: string
  imageUrl: string
  soldQuantity: number
  totalRevenue: number
}

export interface LowStockProduct {
  productId: number
  productName: string
  imageUrl: string
  sizeName: string
  stock: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  disabledUsers: number
  newUsersToday: number
}
