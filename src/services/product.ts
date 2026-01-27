import { http } from '@/lib/http'
import { Product, ProductSearchParams } from '@/types/product'

const PRODUCT_PATH = '/products'

export const productService = {
  getProducts: (params?: ProductSearchParams) => {
    return http.get<IBackendRes<Product[]>>(`${PRODUCT_PATH}`, {
      params,
    })
  },
  getProductById: (id: number | string) => {
    return http.get<IBackendRes<Product>>(`${PRODUCT_PATH}/${id}`)
  },
}
