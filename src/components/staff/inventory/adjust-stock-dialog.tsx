'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { inventoryService, AdjustStockRequest } from '@/services/inventory'
import { productService } from '@/services/product'
import { Product, ProductVariant } from '@/types/product'
import { toast } from 'sonner'
import { AlertCircle, Loader2, Package, History } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface AdjustStockDialogProps {
  productId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AdjustStockDialog({
  productId,
  isOpen,
  onClose,
  onSuccess,
}: AdjustStockDialogProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [selectedSizeId, setSelectedSizeId] = useState<string>('')
  const [quantityChange, setQuantityChange] = useState<number>(0)
  const [reason, setReason] = useState('')
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'SUBTRACT'>('ADD')

  useEffect(() => {
    if (isOpen && productId) {
      const fetchProduct = async () => {
        setIsLoading(true)
        try {
          const res = await productService.getProductById(productId)
          if (res.data.success) {
            const prod = res.data.data
            setProduct(prod || null)

            // Set default size if available
            const variants = prod?.productSizes || prod?.variants || []
            if (variants.length > 0) {
              setSelectedSizeId(variants[0].sizeId.toString())
            }
          }
        } catch (error) {
          console.error('Fetch product error:', error)
          toast.error('Không thể tải thông tin sản phẩm')
        } finally {
          setIsLoading(false)
        }
      }
      fetchProduct()
    } else {
      setProduct(null)
      setSelectedSizeId('')
      setQuantityChange(0)
      setReason('')
    }
  }, [isOpen, productId])

  const handleAdjust = async () => {
    if (!productId || !selectedSizeId || quantityChange === 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    setIsSubmitting(true)
    try {
      const finalChange = adjustmentType === 'ADD' ? quantityChange : -quantityChange
      const res = await inventoryService.adjustStock(productId, {
        sizeId: parseInt(selectedSizeId),
        quantityChange: finalChange,
        reason: reason || 'Điều chỉnh kho hàng định kỳ',
      })

      if (res.data.success) {
        toast.success('Cập nhật tồn kho thành công')
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Adjust stock error:', error)
      toast.error('Có lỗi xảy ra khi cập nhật tồn kho')
    } finally {
      setIsSubmitting(false)
    }
  }

  const variants = product?.productSizes || product?.variants || []
  const currentVariant = variants.find(
    (v: ProductVariant) => v.sizeId.toString() === selectedSizeId,
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Package className='w-5 h-5 text-blue-600' />
            Điều chỉnh tồn kho
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='py-12 flex justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
          </div>
        ) : (
          <div className='space-y-6 py-4'>
            {/* Product Info Summary */}
            <div className='bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4'>
              <div className='w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0'>
                {product?.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=''
                    className='w-full h-full object-cover rounded-lg'
                  />
                ) : (
                  <Package className='w-6 h-6 text-slate-300' />
                )}
              </div>
              <div className='flex flex-col min-w-0'>
                <span className='font-bold text-slate-900 truncate'>{product?.name}</span>
                <span className='text-xs text-slate-500'>Mã SP: {product?.id}</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='font-bold text-slate-700'>Kích thước</Label>
                <Select value={selectedSizeId} onValueChange={setSelectedSizeId}>
                  <SelectTrigger className='bg-white'>
                    <SelectValue placeholder='Chọn size' />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((v: ProductVariant) => (
                      <SelectItem key={v.sizeId} value={v.sizeId.toString()}>
                        Size {v.sizeName} ({v.quantity} hiện có)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label className='font-bold text-slate-700'>Loại điều chỉnh</Label>
                <div className='flex p-1 bg-slate-100 rounded-lg'>
                  <button
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${adjustmentType === 'ADD' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setAdjustmentType('ADD')}
                  >
                    Nhập kho (+)
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${adjustmentType === 'SUBTRACT' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setAdjustmentType('SUBTRACT')}
                  >
                    Xuất kho (-)
                  </button>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='font-bold text-slate-700'>Số lượng thay đổi</Label>
              <Input
                type='number'
                min='1'
                className='bg-white font-bold'
                value={quantityChange}
                onChange={(e) => setQuantityChange(Math.abs(parseInt(e.target.value) || 0))}
              />
              <p className='text-[11px] text-slate-400'>
                Tồn kho sau thay đổi:{' '}
                <span className='font-bold text-slate-700'>
                  {adjustmentType === 'ADD'
                    ? (currentVariant?.quantity || 0) + quantityChange
                    : Math.max(0, (currentVariant?.quantity || 0) - quantityChange)}
                </span>
              </p>
            </div>

            <div className='space-y-2'>
              <Label className='font-bold text-slate-700'>Lý do điều chỉnh</Label>
              <Textarea
                placeholder='Ví dụ: Nhập hàng mới, Kiểm kê định kỳ, Hàng lỗi...'
                className='bg-white min-h-[80px]'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className='p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3'>
              <AlertCircle className='w-5 h-5 text-amber-600 shrink-0' />
              <p className='text-xs text-amber-700 leading-relaxed font-medium'>
                Lưu ý: Hành động này sẽ được ghi lại vào nhật ký vận hành và không thể hoàn tác. Vui
                lòng kiểm tra kỹ số lượng thực tế.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className='border-t pt-4'>
          <Button variant='ghost' onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button
            className={`${adjustmentType === 'ADD' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'} min-w-[140px] shadow-md`}
            onClick={handleAdjust}
            disabled={isSubmitting || quantityChange === 0 || !selectedSizeId}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
