export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  size: string
  image: string
  isReviewed?: boolean
}

export interface Order {
  id: number
  code: string
  totalPrice: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELED' | 'COMPLETED'
  paymentMethod: string
  paymentStatus: string
  shippingFee: number
  discountAmount: number
  shippingDiscount: number
  voucherCode: string | null
  shippingVoucherCode: string | null
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingTrackingCode: string | null
  shippingCarrier: string | null
  createdAt: string
  confirmedAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  canceledAt: string | null
  items: OrderItem[]
}

export interface OrderSearchParams {
  page?: number
  size?: number
  status?: string
  paymentStatus?: string
  shipmentStatus?: string
}
