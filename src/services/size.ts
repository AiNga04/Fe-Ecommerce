import { http } from '@/lib/http'
import { Size } from '@/types/product'

const SIZE_PATH = '/sizes'

export const sizeService = {
  getAll: () => {
    return http.get<IBackendRes<Size[]>>(`${SIZE_PATH}`)
  },
  getById: (id: number | string) => {
    return http.get<IBackendRes<Size>>(`${SIZE_PATH}/${id}`)
  },
  create: (data: Partial<Size>) => {
    return http.post<IBackendRes<Size>>(`${SIZE_PATH}`, data)
  },
  update: (id: number | string, data: Partial<Size>) => {
    return http.put<IBackendRes<Size>>(`${SIZE_PATH}/${id}`, data)
  },
  delete: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${SIZE_PATH}/${id}`)
  },
}
