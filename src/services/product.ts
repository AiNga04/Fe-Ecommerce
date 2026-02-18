import { http } from '@/lib/http'
import { Product, ProductSearchParams, PriceHistory, GalleryImage } from '@/types/product'

const PRODUCT_PATH = '/products'

export const productService = {
  // Public / Search
  getProducts: (params?: ProductSearchParams) => {
    return http.get<IBackendRes<Product[]>>(`${PRODUCT_PATH}`, {
      params,
    })
  },
  getProductById: (id: number | string) => {
    return http.get<IBackendRes<Product>>(`${PRODUCT_PATH}/${id}`)
  },
  getDeletedProducts: (params?: ProductSearchParams) => {
    return http.get<IBackendRes<Product[]>>(`${PRODUCT_PATH}/deleted`, {
      params,
    })
  },

  // CRUD
  createProduct: (data: FormData) => {
    // Note: The backend expects individual @RequestParams, not a JSON blob.
    // Ensure the FormData passed here has keys: 'name', 'price', 'categoryId', 'image', etc.
    return http.post<IBackendRes<Product>>(`${PRODUCT_PATH}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updateProduct: (id: number | string, data: FormData) => {
    return http.put<IBackendRes<Product>>(`${PRODUCT_PATH}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  softDeleteProduct: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${PRODUCT_PATH}/${id}`)
  },
  restoreProduct: (id: number | string) => {
    return http.put<IBackendRes<void>>(`${PRODUCT_PATH}/${id}/restore`)
  },
  hardDeleteProduct: (id: number | string) => {
    return http.delete<IBackendRes<void>>(`${PRODUCT_PATH}/${id}/hard`)
  },

  // Bulk Actions
  softDeleteProducts: (ids: number[]) => {
    return http.post<IBackendRes<number[]>>(`${PRODUCT_PATH}/delete-many`, ids)
  },
  restoreProducts: (ids: number[]) => {
    return http.post<IBackendRes<number[]>>(`${PRODUCT_PATH}/restore-many`, ids)
  },
  hardDeleteProducts: (ids: number[]) => {
    return http.post<IBackendRes<number[]>>(`${PRODUCT_PATH}/hard-delete-many`, ids)
  },

  // Gallery
  uploadGallery: (productId: number | string, data: FormData) => {
    return http.post<IBackendRes<GalleryImage[]>>(`${PRODUCT_PATH}/${productId}/gallery`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  deleteGalleryImage: (productId: number | string, imageId: number | string) => {
    return http.delete<IBackendRes<void>>(`${PRODUCT_PATH}/${productId}/gallery/${imageId}`)
  },
  deleteAllGalleryImages: (productId: number | string) => {
    return http.delete<IBackendRes<number>>(`${PRODUCT_PATH}/${productId}/gallery`)
  },

  // Price History
  getPriceHistory: (id: number | string) => {
    return http.get<IBackendRes<PriceHistory[]>>(`${PRODUCT_PATH}/${id}/price-history`)
  },
}
