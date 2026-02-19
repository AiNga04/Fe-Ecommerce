import { Category } from './category'

export * from './category'

export interface Size {
  id: number
  name: string
  code: string
  description?: string
}

export interface SizeGuide {
  id: number
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
}

export interface InventoryAuditLog {
  id: number
  productId: number
  productName: string
  changedByUserId: number
  changedByUserName: string
  oldStock: number
  newStock: number
  reason: string
  changedAt: string
}

export interface GalleryImage {
  id: number
  url: string
}

export interface ProductVariant {
  id: number
  sizeId: number
  sizeName: string
  sizeCode: string
  quantity: number
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  imageUrl?: string
  category?: Category | string
  stock?: number // Derived from variants or separate field? Backend seems to remove simple stock field but likely still useful for display if aggregated
  isActive: boolean
  ratingAverage?: number
  reviewCount?: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  gallery?: GalleryImage[]
  sizeGuide?: SizeGuide
  variants?: ProductVariant[]
  productSizes?: ProductVariant[] // Backend uses productSizes in some places, let's unify or check mapper
}

export interface PriceHistory {
  oldPrice: number
  newPrice: number
  changedAt: string
  changedBy?: string // Username or email
}

export interface GlobalPriceHistory extends PriceHistory {
  productId: number
  productName: string
  productImage?: string
}

export interface ProductCriteria {
  name?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minStock?: number
  isActive?: boolean
}

export interface ProductSearchParams extends ProductCriteria {
  page?: number
  size?: number
  sort?: string
}
