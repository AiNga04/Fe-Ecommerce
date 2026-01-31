'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cartService } from '@/services/cart'
import { CartItem } from '@/types/cart'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([]) // Array of Cart IDs

  // Actions
  const [confirmAction, setConfirmAction] = useState<{
    type: 'DELETE_ITEM' | 'DELETE_BULK' | 'CLEAR_CART'
    id?: number
  } | null>(null)

  const updateGlobalCartCount = useCartStore((state) => state.fetchCount)

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart()
      if (response.data.success && response.data.data) {
        setCartItems(response.data.data)
        // Ensure selectedIds only contains existing items
        setSelectedIds((prev) =>
          prev.filter((id) => response.data.data!.find((item) => item.id === id)),
        )
        updateGlobalCartCount()
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQuantity = async (id: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity < 1) return

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: newQuantity, subtotal: item.productPrice * newQuantity }
          : item,
      ),
    )

    try {
      await cartService.updateCart(id, { quantity: newQuantity })
    } catch (error) {
      toast.error('Cập nhật số lượng thất bại')
      fetchCart()
    }
  }

  const initiateRemoveItem = (id: number) => {
    setConfirmAction({ type: 'DELETE_ITEM', id })
  }

  const initiateBulkDelete = () => {
    if (selectedIds.length === 0) return
    setConfirmAction({ type: 'DELETE_BULK' })
  }

  const initiateClearCart = () => {
    setConfirmAction({ type: 'CLEAR_CART' })
  }

  const handleConfirm = async () => {
    if (!confirmAction) return

    try {
      if (confirmAction.type === 'DELETE_ITEM' && confirmAction.id) {
        const res = await cartService.deleteCartItem(confirmAction.id)
        if (res.data.success) {
          setCartItems((prev) => prev.filter((item) => item.id !== confirmAction.id))
          setSelectedIds((prev) => prev.filter((id) => id !== confirmAction.id))
          toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
        }
      } else if (confirmAction.type === 'DELETE_BULK') {
        const res = await cartService.deleteCartItems(selectedIds)
        if (res.data.success) {
          setCartItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          setSelectedIds([])
          toast.success(`Đã xóa ${selectedIds.length} sản phẩm`)
        }
      } else if (confirmAction.type === 'CLEAR_CART') {
        const res = await cartService.clearCart()
        if (res.data.success) {
          setCartItems([])
          setSelectedIds([])
          toast.success('Đã làm trống giỏ hàng')
        }
      }
      // Update global count
      updateGlobalCartCount()
    } catch (error) {
      toast.error('Thực hiện thất bại')
      console.error(error)
    } finally {
      setConfirmAction(null)
    }
  }

  // Checkbox logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(cartItems.map((item) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    }
  }

  const handleCheckout = () => {
    if (selectedIds.length === 0) return
    const url = `/checkout?items=${selectedIds.join(',')}`
    router.push(url)
  }

  // Calculation
  const selectedCartItems = cartItems.filter((item) => selectedIds.includes(item.id))
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.subtotal, 0)

  if (isLoading) return <LoadingOverlay />

  if (cartItems.length === 0) {
    return (
      <div className='container max-w-7xl mx-auto px-4 py-16 text-center'>
        <div className='bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6'>
          <ShoppingBag className='w-10 h-10 text-gray-400' />
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Giỏ hàng của bạn đang trống</h2>
        <p className='text-muted-foreground mb-8'>
          Hãy chọn những món đồ yêu thích để thêm vào giỏ hàng nhé!
        </p>
        <Button asChild size='lg'>
          <Link href='/products'>Tiếp tục mua sắm</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8 md:py-12'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Giỏ hàng ({cartItems.length})</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart List */}
        <div className='lg:col-span-2 space-y-4'>
          {/* Header Row with Select All */}
          <div className='flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm'>
            <Checkbox
              checked={selectedIds.length === cartItems.length && cartItems.length > 0}
              onCheckedChange={(c) => handleSelectAll(!!c)}
              id='select-all'
            />
            <label htmlFor='select-all' className='font-medium cursor-pointer'>
              Chọn tất cả ({cartItems.length})
            </label>

            {selectedIds.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='ml-auto text-red-500 hover:text-red-600 hover:bg-red-50'
                onClick={initiateBulkDelete}
              >
                <Trash2 className='w-4 h-4 mr-2' /> Xóa {selectedIds.length} sản phẩm
              </Button>
            )}
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 border rounded-xl bg-white shadow-sm transition-colors ${selectedIds.includes(item.id) ? 'border-primary ring-1 ring-primary/20' : 'hover:border-gray-300'}`}
            >
              <div className='flex items-center'>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(c) => handleToggleOne(item.id, !!c)}
                />
              </div>

              <div className='relative w-24 h-24 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0'>
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.productName}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>

              <div className='flex-1 flex flex-col justify-between'>
                <div className='flex justify-between items-start gap-2'>
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className='font-medium text-gray-900 hover:text-primary line-clamp-2'
                    >
                      {item.productName}
                    </Link>
                    <div className='text-sm text-gray-500 mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded'>
                      Size: {item.sizeName}
                    </div>
                  </div>
                  <button
                    onClick={() => initiateRemoveItem(item.id)}
                    className='text-gray-400 hover:text-red-500 p-1'
                    title='Xóa'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>

                <div className='flex justify-between items-end mt-2'>
                  <div className='font-bold text-primary'>{formatCurrency(item.productPrice)}</div>

                  <div className='flex items-center border rounded-lg h-8'>
                    <button
                      className='px-2 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50'
                      onClick={() => updateQuantity(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className='w-3 h-3' />
                    </button>
                    <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                    <button
                      className='px-2 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600'
                      onClick={() => updateQuantity(item.id, item.quantity, 1)}
                    >
                      <Plus className='w-3 h-3' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className='flex justify-between pt-4'>
            <Button
              variant='outline'
              className='text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200'
              onClick={initiateClearCart}
            >
              <Trash2 className='w-4 h-4 mr-2' /> Xóa tất cả giỏ hàng
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-white p-6 rounded-2xl border shadow-sm sticky top-24'>
            <h3 className='font-bold text-lg mb-4'>Tổng cộng</h3>

            <div className='space-y-3 mb-6'>
              <div className='flex justify-between text-gray-600'>
                <span>Đã chọn</span>
                <span>{selectedIds.length} sản phẩm</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Tạm tính</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className='border-t pt-3 flex justify-between font-bold text-lg text-gray-900'>
                <span>Thành tiền</span>
                <span className='text-primary'>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <Button
              className='w-full h-12 text-base font-semibold'
              size='lg'
              disabled={selectedIds.length === 0}
              onClick={handleCheckout}
            >
              Mua Hàng ({selectedIds.length}) <ArrowRight className='ml-2 w-4 h-4' />
            </Button>

            <div className='mt-4 text-center'>
              <Link
                href='/products'
                className='text-sm text-gray-500 hover:text-primary hover:underline'
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'DELETE_ITEM'
                ? 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?'
                : confirmAction?.type === 'DELETE_BULK'
                  ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn không?`
                  : 'Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className='bg-red-500 hover:bg-red-600'>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
