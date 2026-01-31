import { http } from '@/lib/http'
import { CartItem, AddToCartRequest, UpdateCartRequest } from '@/types/cart'

const CART_PATH = '/carts'

export const cartService = {
  getCart: () => {
    return http.get<IBackendRes<CartItem[]>>(CART_PATH)
  },
  addToCart: (data: AddToCartRequest) => {
    return http.post<IBackendRes<CartItem>>(CART_PATH, data)
  },
  updateCart: (id: number, data: UpdateCartRequest) => {
    return http.put<IBackendRes<CartItem>>(`${CART_PATH}/${id}`, data)
  },
  deleteCartItem: (id: number) => {
    return http.delete<IBackendRes<void>>(`${CART_PATH}/${id}`)
  },
  deleteCartItems: (ids: number[]) => {
    return http.delete<IBackendRes<void>>(`${CART_PATH}/items`, {
      data: { cartItemIds: ids },
    })
  },
  clearCart: () => {
    return http.delete<IBackendRes<void>>(`${CART_PATH}/clear`)
  },
}
