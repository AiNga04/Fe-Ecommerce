export interface Category {
  id: number
  code: string
  name: string
  description?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CategoryCreateRequest {
  code: string
  name: string
  description?: string
}

export interface CategoryUpdateRequest {
  name?: string
  description?: string
  isActive?: boolean
}

export interface CategorySearchParams {
  page?: number
  size?: number
  activeOnly?: boolean
  search?: string
}
