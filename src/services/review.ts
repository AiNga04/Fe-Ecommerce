import { http } from '@/lib/http'
import { IBackendRes } from '@/types/glubal'
import { ReviewResponse } from '@/types/review'
import { IPageResponse } from './inventory'

const REVIEW_PATH = '/reviews'

export const reviewService = {
  // Admin/Staff: List all
  getAll: (page: number = 0, size: number = 10) => {
    return http.get<IBackendRes<IPageResponse<ReviewResponse>>>(REVIEW_PATH, {
      params: { page, size },
    })
  },

  // Admin/Staff: List reported
  getReported: (page: number = 0, size: number = 10) => {
    return http.get<IBackendRes<IPageResponse<ReviewResponse>>>(`${REVIEW_PATH}/reported`, {
      params: { page, size },
    })
  },

  // Admin/Staff: List hidden
  getHidden: (page: number = 0, size: number = 10) => {
    return http.get<IBackendRes<IPageResponse<ReviewResponse>>>(`${REVIEW_PATH}/hidden`, {
      params: { page, size },
    })
  },

  // Admin/Staff: Hide/Unhide
  hide: (id: number | string) => {
    return http.patch<IBackendRes<void>>(`${REVIEW_PATH}/${id}/hide`)
  },
  unhide: (id: number | string) => {
    return http.patch<IBackendRes<void>>(`${REVIEW_PATH}/${id}/unhide`)
  },

  // Admin/Staff: Delete
  delete: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${REVIEW_PATH}/${id}`)
  },
}
