import { http } from '@/lib/http'
import { Size } from '@/types/product'

const SIZE_PATH = '/sizes'

export interface SizeRequest {
  code: string
  name: string
  description?: string
}

export const sizeService = {
  getAll: () => {
    return http.get<IBackendRes<Size[]>>(`${SIZE_PATH}`)
  },
  getById: (id: number | string) => {
    return http.get<IBackendRes<Size>>(`${SIZE_PATH}/${id}`)
  },
  create: (data: SizeRequest) => {
    return http.post<IBackendRes<Size>>(`${SIZE_PATH}`, data)
  },
  update: (id: number | string, data: SizeRequest) => {
    return http.put<IBackendRes<Size>>(`${SIZE_PATH}/${id}`, data)
  },
  delete: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${SIZE_PATH}/${id}`)
  },
}
