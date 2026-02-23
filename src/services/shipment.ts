import { http } from '@/lib/http'
import { IBackendRes } from '@/types/glubal'

const SHIPMENT_PATH = '/shipments'

export interface ShipmentInfo {
  shipmentId: number
  orderId: number
  orderCode: string
  status: string
  carrier: string
  trackingCode: string
  attempts: number
  note: string
  returnRequested: boolean
  assignedAt: string
  pickedUpAt: string
  deliveredAt: string
  failedAt: string
  returnedAt: string
}

export interface AssignShipmentRequest {
  shipperId: number
  carrierCode?: string
}

export const shipmentService = {
  assignShipper: (orderId: number | string, data: AssignShipmentRequest) => {
    return http.post<IBackendRes<ShipmentInfo>>(`${SHIPMENT_PATH}/${orderId}/assign`, data)
  },
}
