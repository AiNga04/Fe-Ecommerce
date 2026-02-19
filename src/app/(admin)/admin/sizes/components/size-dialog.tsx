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
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Ruler, SquareDashedMousePointer } from 'lucide-react'
import { toast } from 'sonner'
import { sizeService, SizeRequest } from '@/services/size'
import { Size } from '@/types/product'

const formSchema = z.object({
  code: z.string().min(1, 'Mã kích thước là bắt buộc'),
  name: z.string().min(1, 'Tên kích thước là bắt buộc'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SizeDialogProps {
  size?: Size | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SizeDialog({ size, open, onOpenChange }: SizeDialogProps) {
  const isEditing = !!size
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (size) {
        setValue('code', size.code)
        setValue('name', size.name)
        setValue('description', size.description || '')
      } else {
        reset({
          code: '',
          name: '',
          description: '',
        })
      }
    }
  }, [size, open, setValue, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const requestData: SizeRequest = {
        code: data.code,
        name: data.name,
        description: data.description,
      }

      if (isEditing && size) {
        return sizeService.update(size.id, requestData)
      } else {
        return sizeService.create(requestData)
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Cập nhật kích thước thành công' : 'Thêm kích thước mới thành công')
      queryClient.invalidateQueries({ queryKey: ['sizes'] })
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
      <DialogContent className='sm:max-w-[450px] p-0 gap-0 overflow-hidden bg-white'>
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <SquareDashedMousePointer className='h-24 w-24 -mr-4 -mt-4' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-xl font-bold flex items-center gap-2'>
              {isEditing ? 'Cập Nhật Kích Thước' : 'Thêm Kích Thước Mới'}
            </DialogTitle>
            <DialogDescription className='text-slate-300 mt-1'>
              {isEditing
                ? `Chỉnh sửa thông tin kích thước #${size?.id}`
                : 'Tạo kích thước mới (ví dụ: S, M, L, 40, 41...)'}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='code' className='text-slate-700'>
              Mã kích thước <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='code'
              placeholder='VD: S, M, XL, 40...'
              {...register('code')}
              className='h-10 font-mono'
            />
            {errors.code && <span className='text-red-500 text-xs'>{errors.code.message}</span>}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='name' className='text-slate-700'>
              Tên hiển thị <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              placeholder='VD: Size S, Size 40...'
              {...register('name')}
              className='h-10'
            />
            {errors.name && <span className='text-red-500 text-xs'>{errors.name.message}</span>}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description' className='text-slate-700'>
              Mô tả
            </Label>
            <Textarea
              id='description'
              placeholder='Mô tả thêm...'
              {...register('description')}
              className='resize-none h-20'
            />
          </div>

          <DialogFooter className='pt-4'>
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
                'Tạo mới'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
