export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
  avatarUrl?: string
  status: 'ACTIVE' | 'INACTIVE'
  dateOfBirth?: string
  gender?: string
  phone?: string
  address?: string
  city?: string
  createdAt: string
  updatedAt: string
}

export interface UserUpdateRequest {
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  dateOfBirth?: string
  gender?: string
}
