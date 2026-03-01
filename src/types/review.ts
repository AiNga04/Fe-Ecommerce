export interface ReviewResponse {
  id: number
  productId: number
  orderId: number
  userId: number
  userName: string
  rating: number
  content: string
  images: string[]
  hidden: boolean
  reportCount: number
  createdAt: string
  updatedAt: string
}
