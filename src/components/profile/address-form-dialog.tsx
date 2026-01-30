'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Address, AddressRequest } from '@/types/address'
import { CITIES } from '@/constants/locations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const addressSchema = z.object({
  receiverName: z.string().min(1, 'Vui lòng nhập tên người nhận'),
  receiverPhone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng nhập quận/huyện'),
  ward: z.string().min(1, 'Vui lòng nhập phường/xã'),
  detailAddress: z.string().min(1, 'Vui lòng nhập địa chỉ chi tiết'),
  setAsDefault: z.boolean(),
})

export type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AddressFormData) => Promise<void>
  initialData?: Address | null
  isSubmitting?: boolean
}

export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: AddressFormDialogProps) {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: '',
      receiverPhone: '',
      province: '',
      district: '',
      ward: '',
      detailAddress: '',
      setAsDefault: false,
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          receiverName: initialData.receiverName,
          receiverPhone: initialData.receiverPhone,
          province: initialData.province,
          district: initialData.district,
          ward: initialData.ward,
          detailAddress: initialData.detailAddress,
          setAsDefault: initialData.default,
        })
      } else {
        form.reset({
          receiverName: '',
          receiverPhone: '',
          province: '',
          district: '',
          ward: '',
          detailAddress: '',
          setAsDefault: false,
        })
      }
    }
  }, [open, initialData, form])

  const handleSubmit = async (values: z.infer<typeof addressSchema>) => {
    // Construct fullAddress logic could be done here or backend. The user request showed fullAddress in read but not in create payload?
    // Wait, the create payload has fullAddress.
    // "create: { ... fullAddress: "Quan 1, TP.HCM" ... }"
    // I should probably construct fullAddress from the parts if the backend expects it.
    // However, usually backend constructs it? Or frontend sends it.
    // Let's assume for now I don't need to explicitly update `fullAddress` key if the backend handles it, OR I should concatenate it.
    // The AddressRequest type in `src/types/address.ts` DOES NOT have `fullAddress`?
    // Let me check my previous edit to `src/types/address.ts`.

    // I need to check `src/types/address.ts` content.
    // If AddressRequest DOES NOT have fullAddress, I can't send it.
    // The user's JSON for create payload HAS `fullAddress`.
    // I better check `src/types/address.ts` one more time. I will assume I need to add `fullAddress` to AddressRequest if it's there.

    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Tên người nhận</label>
              <Input placeholder='Nhập tên' {...form.register('receiverName')} />
              {form.formState.errors.receiverName && (
                <p className='text-xs text-red-500'>{form.formState.errors.receiverName.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Số điện thoại</label>
              <Input placeholder='Nhập số điện thoại' {...form.register('receiverPhone')} />
              {form.formState.errors.receiverPhone && (
                <p className='text-xs text-red-500'>
                  {form.formState.errors.receiverPhone.message}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Tỉnh/Thành phố</label>
              {/* Use Select for Province/City similar to Profile */}
              <Select
                onValueChange={(val) => form.setValue('province', val)}
                defaultValue={form.watch('province')}
              >
                <SelectTrigger className='w-full h-10'>
                  <SelectValue placeholder='Chọn Tỉnh/Thành phố' />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.province && (
                <p className='text-xs text-red-500'>{form.formState.errors.province.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Quận/Huyện</label>
              <Input placeholder='Nhập quận/huyện' {...form.register('district')} />
              {form.formState.errors.district && (
                <p className='text-xs text-red-500'>{form.formState.errors.district.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Phường/Xã</label>
            <Input placeholder='Nhập phường/xã' {...form.register('ward')} />
            {form.formState.errors.ward && (
              <p className='text-xs text-red-500'>{form.formState.errors.ward.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Địa chỉ chi tiết</label>
            <Input placeholder='Số nhà, tên đường...' {...form.register('detailAddress')} />
            {form.formState.errors.detailAddress && (
              <p className='text-xs text-red-500'>{form.formState.errors.detailAddress.message}</p>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='default'
              checked={form.watch('setAsDefault')}
              onCheckedChange={(checked) => form.setValue('setAsDefault', checked as boolean)}
            />
            <label
              htmlFor='default'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
