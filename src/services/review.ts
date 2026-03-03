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

  // User: Create review
  createReview: (data: FormData) => {
    return http.post<IBackendRes<ReviewResponse>>(`${REVIEW_PATH}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // User: Update review
  updateReview: (id: number | string, data: FormData) => {
    return http.put<IBackendRes<ReviewResponse>>(`${REVIEW_PATH}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // User/All: Get reviews by product
  getByProduct: (productId: number | string, page: number = 0, size: number = 10) => {
    return http.get<IBackendRes<any>>(`${REVIEW_PATH}/product/${productId}`, {
      params: { page, size },
    })
  },

  // User: Get my reviews by product
  getMyReviewsByProduct: (productId: number | string, page: number = 0, size: number = 10) => {
    return http.get<IBackendRes<IPageResponse<ReviewResponse>>>(
      `${REVIEW_PATH}/my/product/${productId}`,
      {
        params: { page, size },
      },
    )
  },

  // User: Report review
  reportReview: (id: number | string) => {
    return http.post<IBackendRes<void>>(`${REVIEW_PATH}/${id}/report`, {})
  },
}
