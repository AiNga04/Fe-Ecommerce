'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Ruler, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { sizeGuideService } from '@/services/size-guide'
import { SizeGuide } from '@/types/product'
import { getImageUrl } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(1, 'Tên bảng size là bắt buộc'),
  description: z.string().optional(),
  image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SizeGuideDialogProps {
  sizeGuide?: SizeGuide | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SizeGuideDialog({ sizeGuide, open, onOpenChange }: SizeGuideDialogProps) {
  const isEditing = !!sizeGuide
  const queryClient = useQueryClient()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image: undefined,
    },
  })

  useEffect(() => {
    if (open) {
      if (sizeGuide) {
        setValue('name', sizeGuide.name)
        setValue('description', sizeGuide.description || '')
        if (sizeGuide.imageUrl) {
          setPreviewImage(getImageUrl(sizeGuide.imageUrl))
        } else {
          setPreviewImage(null)
        }
      } else {
        reset({
          name: '',
          description: '',
          image: undefined,
        })
        setPreviewImage(null)
      }
    }
  }, [sizeGuide, open, setValue, reset])

  // Watch for image changes
  const imageFileList = watch('image')
  useEffect(() => {
    if (imageFileList && imageFileList.length > 0) {
      const file = imageFileList[0]
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageFileList])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0])
      }

      if (isEditing && sizeGuide) {
        return sizeGuideService.update(sizeGuide.id, formData)
      } else {
        return sizeGuideService.create(formData)
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Cập nhật bảng size thành công' : 'Thêm bảng size thành công')
      queryClient.invalidateQueries({ queryKey: ['sizeGuides'] })
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra')
      console.error(error)
    },
  })

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white'>
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <Ruler className='h-32 w-32 -mr-6 -mt-6' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-xl font-bold flex items-center gap-2'>
              {isEditing ? 'Cập Nhật Bảng Size' : 'Thêm Bảng Size Mới'}
            </DialogTitle>
            <DialogDescription className='text-slate-300 mt-1'>
              {isEditing
                ? `Chỉnh sửa thông tin bảng size #${sizeGuide?.id}`
                : 'Tải lên bảng size để áp dụng cho sản phẩm'}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name' className='text-slate-700'>
                  Tên bảng size <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  placeholder='VD: Áo Thun Nam'
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
                  placeholder='Mô tả ngắn...'
                  {...register('description')}
                  className='resize-none h-24'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-slate-700'>Hình ảnh</Label>
              <div className='border-2 border-dashed border-slate-200 rounded-lg aspect-[3/4] flex flex-col items-center justify-center relative bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group overflow-hidden'>
                {previewImage ? (
                  <div className='relative w-full h-full'>
                    <img
                      src={previewImage}
                      alt='Preview'
                      className='w-full h-full object-contain'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <span className='text-white text-xs bg-black/60 px-2 py-1 rounded'>
                        Thay đổi ảnh
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='text-center p-4'>
                    <Upload className='h-8 w-8 text-slate-400 mx-auto mb-2 group-hover:scale-110 transition-transform' />
                    <span className='text-xs text-slate-500 block'>Nhấn để tải ảnh lên</span>
                  </div>
                )}
                <input
                  type='file'
                  accept='image/*'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  {...register('image')}
                />
              </div>
            </div>
          </div>

          <DialogFooter className='pt-2'>
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
