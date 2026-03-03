'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Archive, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { inventoryService } from '@/services/inventory'

interface AdjustProductStockDialogProps {
  children: React.ReactNode
  productId: number
  variants: Array<{
    id: number
    sizeId: number
    sizeName: string
    quantity: number
  }>
}

export function AdjustProductStockDialog({
  children,
  productId,
  variants,
}: AdjustProductStockDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Form State
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null)
  const [quantityChange, setQuantityChange] = useState<string>('')
  const [reason, setReason] = useState('')

  // Derived stock
  const selectedVariant = variants?.find((v) => v.sizeId === selectedSizeId)
  const currentQuantity = selectedVariant?.quantity || 0
  const parsedChange = Number(quantityChange) || 0
  const projectedQuantity = currentQuantity + parsedChange

  // Mutation: Adjust Stock
  const adjustMutation = useMutation({
    mutationFn: (payload: any) => inventoryService.adjustStock(productId, payload),
    onSuccess: () => {
      toast.success('Điều chỉnh tồn kho thành công!')
      setOpen(false)
      setSelectedSizeId(null)
      setQuantityChange('')
      setReason('')
      queryClient.invalidateQueries({ queryKey: ['product', productId.toString()] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi điều chỉnh tồn kho')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSizeId) return toast.error('Vui lòng chọn kích cỡ')
    if (!quantityChange || isNaN(Number(quantityChange)))
      return toast.error('Số lượng thay đổi không hợp lệ')
    if (projectedQuantity < 0) return toast.error('Số lượng tồn không thể âm')
    if (!reason.trim()) return toast.error('Vui lòng nhập lý do')

    adjustMutation.mutate({
      quantityChange: Number(quantityChange),
      sizeId: selectedSizeId,
      reason: reason.trim(),
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && adjustMutation.isPending) return
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(() => {
        setSelectedSizeId(null)
        setQuantityChange('')
        setReason('')
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-hidden p-0 gap-0 bg-slate-50 border-none shadow-2xl rounded-2xl'>
        {/* Modern Dark Header */}
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <Archive className='h-32 w-32 -mr-8 -mt-8' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
              Điều chỉnh Tồn kho
            </DialogTitle>
            <div className='flex items-center gap-2 mt-1'>
              <span className='bg-slate-800 text-xs px-2 py-0.5 rounded text-slate-300 font-mono'>
                SP #{productId}
              </span>
              <DialogDescription className='text-slate-300'>
                Kiểm kê hoặc nhập / xuất số lượng tồn kho.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col'>
          <div className='p-6 space-y-6'>
            {/* Size Selection Card */}
            <div className='bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4'>
              <h3 className='font-semibold text-slate-900 flex items-center gap-2'>
                <span className='h-6 w-1 bg-blue-500 rounded-full'></span>
                Phân loại
              </h3>
              <div className='grid gap-2'>
                <Label className='text-slate-700'>
                  Kích thước <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={selectedSizeId ? selectedSizeId.toString() : ''}
                  onValueChange={(val) => setSelectedSizeId(Number(val))}
                >
                  <SelectTrigger className='w-full h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'>
                    <SelectValue placeholder='Chọn kích thước...' />
                  </SelectTrigger>
                  <SelectContent>
                    {!variants || variants.length === 0 ? (
                      <div className='p-2 text-sm text-slate-500'>Sản phẩm không có size</div>
                    ) : (
                      variants.map((v) => (
                        <SelectItem key={v.sizeId} value={v.sizeId.toString()}>
                          {v.sizeName} — Tồn: {v.quantity}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity & Preview Card */}
            <div className='bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4'>
              <h3 className='font-semibold text-slate-900 flex items-center gap-2'>
                <span className='h-6 w-1 bg-emerald-500 rounded-full'></span>
                Số lượng & Lý do
              </h3>
              <div className='grid gap-2'>
                <Label className='text-slate-700'>
                  Thay đổi số lượng <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='number'
                  placeholder='Ví dụ: 10 (Nhập), -5 (Xuất/Hư hỏng)'
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  className='h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500'
                />
                {selectedSizeId !== null && (
                  <div className='flex items-center justify-between mt-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-xs'>
                    <span className='text-slate-500'>
                      Tồn hiện tại: <strong className='text-slate-900'>{currentQuantity}</strong>
                    </span>
                    <span className='text-slate-500'>
                      Tồn sau:{' '}
                      <strong
                        className={cn(
                          'text-slate-900',
                          projectedQuantity < 0 && 'text-red-500',
                          parsedChange > 0 && 'text-emerald-600',
                        )}
                      >
                        {projectedQuantity}
                      </strong>
                      {parsedChange !== 0 && (
                        <span
                          className={cn(
                            'ml-1',
                            parsedChange > 0 ? 'text-emerald-500' : 'text-red-400',
                          )}
                        >
                          ({parsedChange > 0 ? '+' : ''}
                          {parsedChange})
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className='grid gap-2'>
                <Label className='text-slate-700'>
                  Lý do điều chỉnh <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  placeholder='Nhập hàng đợt 2, Hệ thống lệch tồn, Hàng lỗi trả về...'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className='h-20 resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500'
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className='p-6 bg-slate-50 border-t border-slate-100 gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={adjustMutation.isPending}
              className='h-11 px-8 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={adjustMutation.isPending}
              className='h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
            >
              {adjustMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang xử lý
                </>
              ) : (
                'Xác nhận điều chỉnh'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
