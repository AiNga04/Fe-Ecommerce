export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
  SHIPPER = 'SHIPPER',
}

import { City } from '@/constants/locations'
export { City } from '@/constants/locations'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  dateOfBirth?: string
  gender?: Gender
  roles: string[]
  phone?: string
  address?: string
  city?: City | string
  avatarUrl?: string
  status: UserStatus
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface UserCreateRequest {
  firstName: string
  lastName: string
  email: string
  password?: string
  gender?: Gender
  dateOfBirth?: string
  phone?: string
  address?: string
  city?: City | string
  roles?: string[]
}

export interface UserUpdateRequest {
  firstName?: string
  lastName?: string
  email?: string // Usually email is not updatable or requires special handling
  password?: string
  gender?: Gender
  dateOfBirth?: string
  phone?: string
  address?: string
  city?: City | string
  roles?: string[]
  avatarUrl?: string
  status?: UserStatus
}

export interface UserSearchCriteria {
  page?: number
  size?: number
  sort?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  role?: string
  city?: string
  status?: string
}

export interface UserUpdateProfileRequest {
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  dateOfBirth?: string
  gender?: string
}
