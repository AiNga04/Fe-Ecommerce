export interface Address {
  id: number
  receiverName: string
  receiverPhone: string
  fullAddress: string
  province: string
  district: string
  ward: string
  detailAddress: string
  default: boolean
}

export interface AddressRequest {
  receiverName: string
  receiverPhone: string
  fullAddress: string
  province: string
  district: string
  ward: string
  detailAddress: string
  setAsDefault: boolean
}
