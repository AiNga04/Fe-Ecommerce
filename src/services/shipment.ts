import { http } from '@/lib/http'
import { IBackendRes } from '@/types/glubal'
import { ShipmentStatus } from '@/constants/enum/shipment-status'

const SHIPMENT_PATH = '/shipments'

export interface ShipmentInfo {
  shipmentId: number
  orderId: number
  orderCode: string
  status: ShipmentStatus
  carrier: string
  trackingCode: string
  shipperId: number | null
  shipperName: string | null
  shipperPhone: string | null
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  attempts: number
  note: string | null
  returnRequested: boolean
  assignedAt: string | null
  pickedUpAt: string | null
  deliveredAt: string | null
  failedAt: string | null
  returnedAt: string | null
  orderStatus: string | null
  completedAt: string | null
}

export interface ShipperChartData {
  date: string // YYYY-MM-DD
  deliveredCount: number
  failedCount: number
  returnedCount: number
  codCollected: number
}

export interface ShipperDashboardStatsResponse {
  pendingPickups: number
  inProgress: number
  deliveredToday: number
  failedToday: number
  codCollectedToday: number
  totalDelivered: number
  totalFailed: number
  totalReturned: number
  chartData: ShipperChartData[]
}

export interface AssignShipmentRequest {
  shipperId: number
  carrierCode?: string
}

export interface ShipmentFailRequest {
  reason: string
}

export const shipmentService = {
  // ADMIN / STAFF
  assignShipper: (orderId: number | string, data: AssignShipmentRequest) => {
    return http.post<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${orderId}/assign`, data)
  },

  getAllShipments: (params: {
    page?: number
    size?: number
    status?: ShipmentStatus
    shipperId?: number
    returnRequested?: boolean
  }) => {
    return http.get<IBackendRes<ShipmentInfo[]>>(`${SHIPMENT_PATH}/admin`, { params })
  },

  // SHIPPER
  getMyShipments: (params: { page?: number; size?: number; status?: ShipmentStatus }) => {
    return http.get<IBackendRes<ShipmentInfo[]>>(`${SHIPMENT_PATH}/my`, { params })
  },

  getMyHistory: (params: { page?: number; size?: number; status?: ShipmentStatus }) => {
    return http.get<IBackendRes<ShipmentInfo[]>>(`${SHIPMENT_PATH}/my/history`, {
      params,
    })
  },

  getMyDashboardStats: (params: { from?: string; to?: string }) => {
    return http.get<IBackendRes<ShipperDashboardStatsResponse>>(`${SHIPMENT_PATH}/my/stats`, {
      params,
    })
  },

  getMyShipmentById: (shipmentId: number | string) => {
    return http.get<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/my/${shipmentId}`)
  },

  // ACTIONS
  markPickedUp: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${shipmentId}/picked-up`, {})
  },

  markOutForDelivery: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfo>>(
      `${SHIPMENT_PATH}/${shipmentId}/out-for-delivery`,
      {},
    )
  },

  markDelivered: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${shipmentId}/delivered`, {})
  },

  markFailed: (shipmentId: number | string, data: ShipmentFailRequest) => {
    return http.patch<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${shipmentId}/failed`, data)
  },

  markReturned: (shipmentId: number | string, data: ShipmentFailRequest) => {
    return http.patch<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${shipmentId}/returned`, data)
  },
  userRequestReturn: (orderId: number | string, reason: string) => {
    return http.post<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${orderId}/request-return`, {
      reason,
    })
  },
  approveReturn: (shipmentId: number | string) => {
    return http.patch<IBackendRes<ShipmentInfo>>(
      `${SHIPMENT_PATH}/${shipmentId}/approve-return`,
      {},
    )
  },
  rejectReturn: (shipmentId: number | string, reason: string) => {
    return http.patch<IBackendRes<ShipmentInfo>>(
      `${SHIPMENT_PATH}/${shipmentId}/reject-return`,
      reason,
    )
  },
}
