'use client'

import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { inventoryService } from '@/services/inventory'
import { productService } from '@/services/product'

interface AdjustStockDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AdjustStockDialog({ children, onSuccess }: AdjustStockDialogProps) {
  const [open, setOpen] = useState(false)
  const [comboboxOpen, setComboboxOpen] = useState(false)

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null)
  const [quantityChange, setQuantityChange] = useState<string>('')
  const [reason, setReason] = useState('')

  // Query: Products for Combobox
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['admin-products-search', comboboxOpen],
    queryFn: () => productService.getProducts({ page: 0, size: 200 }),
    enabled: comboboxOpen,
  })

  const productsList = Array.isArray(productsData?.data?.data)
    ? productsData.data.data
    : (productsData?.data?.data as any)?.items || []
  const selectedProduct = productsList.find((p: any) => p.id === selectedProductId)

  // Query: Selected Product Details (for variants/sizes)
  const { data: productDetailsData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['admin-product-details', selectedProductId],
    queryFn: () => productService.getProductById(selectedProductId!),
    enabled: !!selectedProductId,
  })

  const selectedProductDetails = productDetailsData?.data?.data

  // Determine available sizes from selected product's variants
  const availableSizes =
    selectedProductDetails?.variants?.map((v: any) => ({
      id: v.sizeId,
      name: v.sizeName,
      currentQuantity: v.quantity,
    })) || []

  // Derived current stock state for helper display
  const selectedSizeInfo = availableSizes.find((s: any) => s.id === selectedSizeId)
  const currentQuantity = selectedSizeInfo?.currentQuantity || 0
  const parsedChange = Number(quantityChange) || 0
  const projectedQuantity = currentQuantity + parsedChange

  // Mutation: Adjust Stock
  const adjustMutation = useMutation({
    mutationFn: (data: { productId: number; payload: any }) =>
      inventoryService.adjustStock(data.productId, data.payload),
    onSuccess: () => {
      toast.success('Điều chỉnh tồn kho thành công!')
      setOpen(false)
      if (onSuccess) onSuccess()
      // Reset form
      setSelectedProductId(null)
      setSelectedSizeId(null)
      setQuantityChange('')
      setReason('')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi điều chỉnh tồn kho')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) return toast.error('Vui lòng chọn sản phẩm')
    if (!selectedSizeId) return toast.error('Vui lòng chọn kích cỡ')
    if (!quantityChange || isNaN(Number(quantityChange)))
      return toast.error('Số lượng thay đổi không hợp lệ')
    if (projectedQuantity < 0) return toast.error('Số lượng tồn không thể âm')
    if (!reason.trim()) return toast.error('Vui lòng nhập lý do')

    adjustMutation.mutate({
      productId: selectedProductId,
      payload: {
        quantityChange: Number(quantityChange),
        sizeId: selectedSizeId,
        reason: reason.trim(),
      },
    })
  }

  // Handle dialog interaction
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && adjustMutation.isPending) return // Prevent close while submitting
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(() => {
        setSelectedProductId(null)
        setSelectedSizeId(null)
        setQuantityChange('')
        setReason('')
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Điều chỉnh Tồn kho</DialogTitle>
            <DialogDescription>
              Kiểm kê hoặc điều chỉnh số lượng tồn kho (Nhập hàng, Thất thoát, Bồi thường...)
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {/* Search Product Combobox */}
            <div className='flex flex-col gap-2'>
              <Label>
                Sản phẩm <span className='text-red-500'>*</span>
              </Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={comboboxOpen}
                    className='w-full justify-between font-normal'
                  >
                    {selectedProduct
                      ? `${selectedProduct.code} - ${selectedProduct.name}`
                      : isLoadingProducts && comboboxOpen
                        ? 'Đang tải...'
                        : 'Chọn sản phẩm...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0 sm:w-[400px]'>
                  <Command>
                    <CommandInput placeholder='Tìm theo mã hoặc tên...' />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                      <CommandGroup>
                        {productsList.map((product: any) => (
                          <CommandItem
                            key={product.id}
                            value={`${product.code} ${product.name}`}
                            onSelect={() => {
                              setSelectedProductId(product.id)
                              setSelectedSizeId(null) // reset size when product changes
                              setComboboxOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProductId === product.id ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            <span className='font-mono text-xs text-slate-500 mr-2'>
                              {product.code}
                            </span>
                            <span className='truncate'>{product.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Select Size */}
            <div className='flex flex-col gap-2'>
              <Label>
                Phân loại / Kích cỡ <span className='text-red-500'>*</span>
              </Label>
              <Select
                disabled={!selectedProductId}
                value={selectedSizeId ? selectedSizeId.toString() : ''}
                onValueChange={(val) => setSelectedSizeId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn kích cỡ tương ứng' />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.length === 0 && selectedProductId ? (
                    <div className='p-2 text-sm text-slate-500'>Sản phẩm không có size</div>
                  ) : (
                    availableSizes.map((sz: any) => (
                      <SelectItem key={sz.id} value={sz.id.toString()}>
                        {sz.name} (Tồn: {sz.currentQuantity})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Change */}
            <div className='flex flex-col gap-2'>
              <Label>
                Thay đổi số lượng <span className='text-red-500'>*</span>
              </Label>
              <div className='flex gap-2 items-center'>
                <Input
                  type='number'
                  placeholder='Ví dụ: 10 (Nhập), -5 (Xuất/Hư hỏng)'
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  className='flex-1'
                />
              </div>
              {selectedSizeId !== null && (
                <p className='text-xs text-slate-500 mt-1 flex justify-between'>
                  <span>
                    Tồn hiện tại: <strong className='text-slate-900'>{currentQuantity}</strong>
                  </span>
                  <span>
                    Tồn sau:{' '}
                    <strong
                      className={cn('text-slate-900', projectedQuantity < 0 && 'text-red-500')}
                    >
                      {projectedQuantity}
                    </strong>
                  </span>
                </p>
              )}
            </div>

            {/* Reason */}
            <div className='flex flex-col gap-2'>
              <Label>
                Lý do điều chỉnh <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                placeholder='Nhập hàng đợt 2, Hệ thống lệch tồn, Hàng lỗi trả về...'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className='h-20 resize-none'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={adjustMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={adjustMutation.isPending}
              className='bg-indigo-600 hover:bg-indigo-700'
            >
              {adjustMutation.isPending ? <Loader2 className='w-4 h-4 animate-spin mr-2' /> : null}
              Xác nhận
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
