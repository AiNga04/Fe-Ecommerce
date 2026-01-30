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
  gallery: { id: number; url: string }[] | null
  sizeGuide: {
    id: number
    name: string
    description: string
    imageUrl: string
  } | null
  variants: {
    id: number
    sizeId: number
    sizeName: string
    sizeCode: string
    quantity: number
  }[]
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
