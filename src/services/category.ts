import { http } from '@/lib/http'
import { Category, CategorySearchParams } from '@/types/category'

const CATEGORY_PATH = '/categories'

export const categoryService = {
  list: (params?: CategorySearchParams) => {
    return http.get<IBackendRes<Category[]>>(`${CATEGORY_PATH}`, { params })
  },
  getById: (id: number | string) => {
    return http.get<IBackendRes<Category>>(`${CATEGORY_PATH}/${id}`)
  },
  create: (data: Partial<Category>) => {
    return http.post<IBackendRes<Category>>(`${CATEGORY_PATH}`, data)
  },
  update: (id: number | string, data: Partial<Category>) => {
    return http.put<IBackendRes<Category>>(`${CATEGORY_PATH}/${id}`, data)
  },
  delete: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${CATEGORY_PATH}/${id}`)
  },
}
