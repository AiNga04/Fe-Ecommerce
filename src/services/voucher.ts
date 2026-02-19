import { http } from '@/lib/http'
import {
  Voucher,
  VoucherCreateRequest,
  VoucherResponse,
  VoucherUpdateRequest,
} from '@/types/voucher'

const VOUCHER_PATH = '/vouchers'

export const voucherService = {
  // ADMIN + STAFF: List all vouchers
  getAll: (page: number = 0, size: number = 20) => {
    return http.get<IBackendRes<VoucherResponse[]>>(`${VOUCHER_PATH}?page=${page}&size=${size}`)
  },

  // ADMIN + STAFF: Get by ID
  getById: (id: number | string) => {
    return http.get<IBackendRes<VoucherResponse>>(`${VOUCHER_PATH}/${id}`)
  },

  // ADMIN: Create Draft
  create: (data: VoucherCreateRequest) => {
    return http.post<IBackendRes<VoucherResponse>>(`${VOUCHER_PATH}`, data)
  },

  // ADMIN: Update
  update: (id: number | string, data: VoucherUpdateRequest) => {
    return http.put<IBackendRes<VoucherResponse>>(`${VOUCHER_PATH}/${id}`, data)
  },

  // ADMIN: Deactivate (Soft delete/Independent logic)
  deactivate: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${VOUCHER_PATH}/${id}`)
  },

  // ADMIN + STAFF: Activate
  activate: (id: number | string) => {
    return http.put<IBackendRes<void>>(`${VOUCHER_PATH}/${id}/activate`, {})
  },

  // USER: List active vouchers
  listActive: (page: number = 0, size: number = 20) => {
    return http.get<IBackendRes<VoucherResponse[]>>(
      `${VOUCHER_PATH}/active?page=${page}&size=${size}`,
    )
  },
}
