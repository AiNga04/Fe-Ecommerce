import { Gender } from '@/constants/enum/gender'

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  gender: Gender
  password: string
  phone: string
  address: string
  city: string
}
