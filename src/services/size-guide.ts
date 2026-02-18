import { http } from '@/lib/http'
import { SizeGuide } from '@/types/product'

const SIZE_GUIDE_PATH = '/size-guides'

export const sizeGuideService = {
  getAll: () => {
    return http.get<IBackendRes<SizeGuide[]>>(`${SIZE_GUIDE_PATH}`)
  },
  getById: (id: number | string) => {
    return http.get<IBackendRes<SizeGuide>>(`${SIZE_GUIDE_PATH}/${id}`)
  },
  // Create/Update uses FormData because of Image
  create: (data: FormData) => {
    return http.post<IBackendRes<SizeGuide>>(`${SIZE_GUIDE_PATH}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  update: (id: number | string, data: FormData) => {
    return http.put<IBackendRes<SizeGuide>>(`${SIZE_GUIDE_PATH}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  delete: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${SIZE_GUIDE_PATH}/${id}`)
  },
}
