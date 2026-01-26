import { Gender } from '@/constants/enum/gender'

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}
