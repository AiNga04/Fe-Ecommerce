export interface CartItem {
  id: number
  productId: number
  productName: string
  productPrice: number
  quantity: number
  subtotal: number
  sizeId: number
  sizeName: string
  image: string
}

export interface AddToCartRequest {
  productId: number
  quantity: number
  sizeId: number
}

export interface UpdateCartRequest {
  quantity: number
}
