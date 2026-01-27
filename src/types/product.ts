export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  isActive: boolean
  ratingAverage: number | null
  reviewCount: number | null
  createdAt: string
  updatedAt: string
  gallery: string[] | null
}

export interface ProductSearchParams {
  page?: number
  size?: number
  sort?: string
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}
