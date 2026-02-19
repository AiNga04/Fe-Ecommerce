'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2, TicketPercent, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { voucherService } from '@/services/voucher'
import {
  Voucher,
  VoucherCreateRequest,
  VoucherScope,
  VoucherType,
  VoucherUpdateRequest,
} from '@/types/voucher'
import { format } from 'date-fns'

// Helper to handle date-time-local input
const toDateTimeLocal = (dateString?: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm")
}

const formSchema = z
  .object({
    code: z.string().min(3, 'Mã voucher phải có ít nhất 3 ký tự').max(50),
    name: z.string().min(1, 'Tên voucher là bắt buộc'),
    description: z.string().optional(),
    type: z.nativeEnum(VoucherType),
    discountValue: z.coerce.number().min(0, 'Giá trị giảm phải lớn hơn hoặc bằng 0'),
    maxDiscountAmount: z.coerce.number().optional(),
    minOrderValue: z.coerce.number().optional(),
    maxUsage: z.coerce.number().optional(),
    maxUsagePerUser: z.coerce.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === VoucherType.PERCENTAGE && data.discountValue > 100) {
        return false
      }
      return true
    },
    {
      message: 'Giảm giá phần trăm không được quá 100%',
      path: ['discountValue'],
    },
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate)
      }
      return true
    },
    {
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
      path: ['endDate'],
    },
  )

type FormValues = z.infer<typeof formSchema>

interface VoucherDialogProps {
  voucher?: Voucher | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoucherDialog({ voucher, open, onOpenChange }: VoucherDialogProps) {
  const isEditing = !!voucher
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: '',
      name: '',
      description: '',
      type: VoucherType.PERCENTAGE,
      discountValue: 0,
    },
  })

  const type = watch('type')

  useEffect(() => {
    if (open) {
      if (voucher) {
        setValue('code', voucher.code)
        setValue('name', voucher.name)
        setValue('description', voucher.description || '')
        setValue('type', voucher.type)
        setValue('discountValue', voucher.discountValue)
        setValue('maxDiscountAmount', voucher.maxDiscountAmount || undefined)
        setValue('minOrderValue', voucher.minOrderValue || undefined)
        setValue('maxUsage', voucher.maxUsage || undefined)
        setValue('maxUsagePerUser', voucher.maxUsagePerUser || undefined)
        setValue('startDate', toDateTimeLocal(voucher.startDate))
        setValue('endDate', toDateTimeLocal(voucher.endDate))
      } else {
        reset({
          code: '',
          name: '',
          description: '',
          type: VoucherType.PERCENTAGE,
          discountValue: 0,
        })
      }
    }
  }, [voucher, open, setValue, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      // Backend expects ISO strings, usually input[datetime-local] gives something close but let's ensure
      // Actually backend handles standard ISO.
      // We might need to append ':00' if it's missing seconds or rely on backend parser.
      // Let's assume input value is fine or convert to ISO.

      const formatIso = (val?: string) => (val ? new Date(val).toISOString() : undefined)

      if (isEditing && voucher) {
        const updateData: VoucherUpdateRequest = {
          name: data.name,
          description: data.description,
          type: data.type,
          discountValue: data.discountValue,
          maxDiscountAmount: data.maxDiscountAmount,
          minOrderValue: data.minOrderValue,
          maxUsage: data.maxUsage,
          maxUsagePerUser: data.maxUsagePerUser,
          startDate: formatIso(data.startDate),
          endDate: formatIso(data.endDate),
        }
        return voucherService.update(voucher.id, updateData)
      } else {
        const createData: VoucherCreateRequest = {
          code: data.code,
          name: data.name,
          description: data.description,
          type: data.type,
          scope: VoucherScope.GLOBAL,
          discountValue: data.discountValue,
          maxDiscountAmount: data.maxDiscountAmount,
          minOrderValue: data.minOrderValue,
          maxUsage: data.maxUsage,
          maxUsagePerUser: data.maxUsagePerUser,
          startDate: formatIso(data.startDate),
          endDate: formatIso(data.endDate),
        }
        return voucherService.create(createData)
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Cập nhật voucher thành công' : 'Tạo voucher nháp thành công')
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra'
      toast.error(message)
    },
  })

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] p-0 gap-0 overflow-hidden bg-white max-h-[90vh] overflow-y-auto'>
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <TicketPercent className='h-32 w-32 -mr-6 -mt-6' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-xl font-bold flex items-center gap-2'>
              {isEditing ? 'Cập Nhật Mã Giảm Giá' : 'Thêm Mã Giảm Giá Mới'}
            </DialogTitle>
            <DialogDescription className='text-slate-300 mt-1'>
              {isEditing
                ? `Chỉnh sửa thông tin voucher #${voucher?.code}`
                : 'Thiết lập các điều kiện và giá trị giảm giá cho voucher mới'}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Basic Info */}
            <div className='space-y-4'>
              <h3 className='font-semibold border-b pb-2 text-slate-900'>Thông tin chung</h3>
              <div className='grid gap-2'>
                <Label htmlFor='code' className='text-slate-700'>
                  Mã Voucher <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='code'
                  placeholder='VD: SUMMER2024'
                  {...register('code')}
                  disabled={isEditing}
                  className={`font-mono ${isEditing ? 'bg-slate-100' : ''}`}
                />
                {errors.code && <span className='text-red-500 text-xs'>{errors.code.message}</span>}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='name' className='text-slate-700'>
                  Tên chương trình <span className='text-red-500'>*</span>
                </Label>
                <Input id='name' placeholder='VD: Giảm giá mùa hè' {...register('name')} />
                {errors.name && <span className='text-red-500 text-xs'>{errors.name.message}</span>}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='description' className='text-slate-700'>
                  Mô tả
                </Label>
                <Textarea
                  id='description'
                  placeholder='Chi tiết về chương trình...'
                  {...register('description')}
                  className='resize-none h-20'
                />
              </div>
            </div>

            {/* Discount Config */}
            <div className='space-y-4'>
              <h3 className='font-semibold border-b pb-2 text-slate-900'>Thiết lập giảm giá</h3>
              <div className='grid gap-2'>
                <Label htmlFor='type' className='text-slate-700'>
                  Loại giảm giá
                </Label>
                <Select
                  onValueChange={(val) => setValue('type', val as VoucherType)}
                  defaultValue={type}
                  value={watch('type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại giảm giá' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VoucherType.PERCENTAGE}>Theo phần trăm (%)</SelectItem>
                    <SelectItem value={VoucherType.FIXED_AMOUNT}>Số tiền cố định (VNĐ)</SelectItem>
                    <SelectItem value={VoucherType.FREESHIP}>Miễn phí vận chuyển</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='discountValue' className='text-slate-700'>
                    Giá trị giảm {type === VoucherType.PERCENTAGE ? '(%)' : '(VNĐ)'}
                  </Label>
                  <Input id='discountValue' type='number' {...register('discountValue')} />
                  {errors.discountValue && (
                    <span className='text-red-500 text-xs'>{errors.discountValue.message}</span>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='minOrderValue' className='text-slate-700'>
                    Đơn tối thiểu (VNĐ)
                  </Label>
                  <Input
                    id='minOrderValue'
                    type='number'
                    {...register('minOrderValue')}
                    placeholder='0'
                  />
                </div>
              </div>

              {type === VoucherType.PERCENTAGE && (
                <div className='grid gap-2'>
                  <Label htmlFor='maxDiscountAmount' className='text-slate-700'>
                    Giảm tối đa (VNĐ)
                  </Label>
                  <Input
                    id='maxDiscountAmount'
                    type='number'
                    {...register('maxDiscountAmount')}
                    placeholder='Không giới hạn'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Để trống nếu không giới hạn mức giảm tối đa
                  </p>
                </div>
              )}

              {type === VoucherType.FREESHIP && (
                <div className='text-xs text-blue-600 bg-blue-50 p-2 rounded'>
                  * Với voucher Freeship, giá trị giảm là số tiền ship tối đa được hỗ trợ.
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Usage Limits */}
            <div className='space-y-4'>
              <h3 className='font-semibold border-b pb-2 text-slate-900'>Giới hạn sử dụng</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='maxUsage' className='text-slate-700'>
                    Tổng số lượng
                  </Label>
                  <Input
                    id='maxUsage'
                    type='number'
                    {...register('maxUsage')}
                    placeholder='Không giới hạn'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='maxUsagePerUser' className='text-slate-700'>
                    Lượt dùng/Người
                  </Label>
                  <Input
                    id='maxUsagePerUser'
                    type='number'
                    {...register('maxUsagePerUser')}
                    placeholder='Không giới hạn'
                  />
                </div>
              </div>
            </div>

            {/* Time Config */}
            <div className='space-y-4'>
              <h3 className='font-semibold border-b pb-2 text-slate-900'>Thời gian áp dụng</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='startDate' className='text-slate-700'>
                    Bắt đầu
                  </Label>
                  <Input id='startDate' type='datetime-local' {...register('startDate')} />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='endDate' className='text-slate-700'>
                    Kết thúc
                  </Label>
                  <Input id='endDate' type='datetime-local' {...register('endDate')} />
                  {errors.endDate && (
                    <span className='text-red-500 text-xs'>{errors.endDate.message}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='pt-2 border-t mt-4'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              type='submit'
              className='bg-slate-900 hover:bg-slate-800 text-white'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang lưu
                </>
              ) : isEditing ? (
                'Lưu thay đổi'
              ) : (
                'Tạo Voucher'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
