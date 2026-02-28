import { http } from '@/lib/http'
import type {
  ShipmentInfoResponse,
  AssignShipmentRequest,
  ShipperDashboardStatsResponse,
} from '@/types/shipment'

const SHIPMENT_PATH = '/shipments'

export const shipmentService = {
  // ======================= ADMIN / STAFF =======================

  /** Gán shipper cho đơn hàng */
  assignShipper: (orderId: number | string, data: AssignShipmentRequest) => {
    return http.post<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/${orderId}/assign`, data)
  },

  /** Danh sách tất cả shipment (phân trang, lọc theo status, shipper, return requests) */
  getAllShipments: (params?: {
    page?: number
    size?: number
    status?: string
    shipperId?: number | string
    returnRequested?: boolean
  }) => {
    return http.get<IBackendRes<ShipmentInfoResponse[]>>(`${SHIPMENT_PATH}/admin`, { params })
  },

  /** Chi tiết 1 shipment */
  getShipmentById: (shipmentId: number | string) => {
    return http.get<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/admin/${shipmentId}`)
  },

  /** Shipment theo orderId */
  getShipmentByOrderId: (orderId: number | string) => {
    return http.get<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/admin/order/${orderId}`)
  },

  /** Duyệt trả hàng */
  approveReturn: (shipmentId: number | string, reason?: string) => {
    return http.patch<IBackendRes<ShipmentInfoResponse>>(
      `${SHIPMENT_PATH}/${shipmentId}/approve-return`,
      { reason },
    )
  },

  // ========================== SHIPPER ==========================

  /** Danh sách shipment của shipper hiện tại (có thể lọc theo status) */
  getMyShipments: (params?: { page?: number; size?: number; status?: string }) => {
    return http.get<IBackendRes<ShipmentInfoResponse[]>>(`${SHIPMENT_PATH}/my`, { params })
  },

  /** Lịch sử giao hàng của shipper hiện tại (có thể lọc theo status) */
  getMyShipmentHistory: (params?: { page?: number; size?: number; status?: string }) => {
    return http.get<IBackendRes<ShipmentInfoResponse[]>>(`${SHIPMENT_PATH}/my/history`, { params })
  },

  /** Chi tiết 1 shipment của shipper hiện tại */
  getMyShipmentById: (shipmentId: number | string) => {
    return http.get<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/my/${shipmentId}`)
  },

  /** Thống kê dashboard cho shipper hiện tại */
  getMyDashboardStats: () => {
    return http.get<IBackendRes<ShipperDashboardStatsResponse>>(`${SHIPMENT_PATH}/my/stats`)
  },

  /** Shipper đánh dấu đã lấy hàng */
  markPickedUp: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/${shipmentId}/picked-up`)
  },

  /** Shipper đánh dấu đang giao */
  markOutForDelivery: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfoResponse>>(
      `${SHIPMENT_PATH}/${shipmentId}/out-for-delivery`,
    )
  },

  /** Shipper đánh dấu giao thành công */
  markDelivered: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/${shipmentId}/delivered`)
  },

  /** Shipper đánh dấu giao thất bại */
  markFailed: (shipmentId: number | string, reason?: string) => {
    return http.patch<IBackendRes<ShipmentInfoResponse>>(`${SHIPMENT_PATH}/${shipmentId}/failed`, {
      reason,
    })
  },

  /** Shipper đánh dấu trả hàng */
  markReturned: (shipmentId: number | string, reason?: string) => {
    return http.patch<IBackendRes<ShipmentInfoResponse>>(
      `${SHIPMENT_PATH}/${shipmentId}/returned`,
      { reason },
    )
  },

  // ========================== USER ==========================

  /** User yêu cầu trả hàng */
  requestReturn: (orderId: number | string, reason?: string) => {
    return http.post<IBackendRes<ShipmentInfoResponse>>(
      `${SHIPMENT_PATH}/${orderId}/request-return`,
      { reason },
    )
  },
}
