import { create } from 'zustand'
import { cartService } from '@/services/cart'

interface CartState {
  count: number
  fetchCount: () => Promise<void>
  setCount: (count: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  fetchCount: async () => {
    try {
      const res = await cartService.getCart()
      if (res.data.success && res.data.data) {
        set({ count: res.data.data.length })
      }
    } catch (error) {
      // if error (e.g. 401), count remains 0 or handle logic
      set({ count: 0 })
    }
  },
  setCount: (count) => set({ count }),
}))
