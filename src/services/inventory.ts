import { http } from '@/lib/http'
import { IBackendRes } from '@/types/glubal'

const INVENTORY_PATH = '/inventory'

export interface IPageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
}

export interface AdjustStockRequest {
  quantityChange: number
  sizeId: number
  reason?: string
}

export interface InventoryAuditResponse {
  id: number
  productId: number
  productName: string
  oldStock: number
  newStock: number
  reason: string
  changedByUserName: string
  changedAt: string
}

export interface GetAuditLogsParams {
  productId?: number
  fromDate?: string // YYYY-MM-DD
  toDate?: string // YYYY-MM-DD
  page?: number
  size?: number
}

export const inventoryService = {
  adjustStock: (productId: number, data: AdjustStockRequest) => {
    return http.put<IBackendRes<InventoryAuditResponse>>(
      `${INVENTORY_PATH}/products/${productId}/stock`,
      data,
    )
  },

  getAuditLogs: (params?: GetAuditLogsParams) => {
    return http.get<IBackendRes<IPageResponse<InventoryAuditResponse>>>(
      `${INVENTORY_PATH}/audit-logs`,
      {
        params,
      },
    )
  },

  exportExcel: async (params?: Omit<GetAuditLogsParams, 'page' | 'size'>) => {
    const response = await http.get(`${INVENTORY_PATH}/audit-logs/export/excel`, {
      params,
      responseType: 'blob', // Important for file download
    })
    return response.data
  },

  exportPdf: async (params?: Omit<GetAuditLogsParams, 'page' | 'size'>) => {
    const response = await http.get(`${INVENTORY_PATH}/audit-logs/export/pdf`, {
      params,
      responseType: 'blob', // Important for file download
    })
    return response.data
  },
}
