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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Loader2, FolderPlus, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { categoryService } from '@/services/category'
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '@/types/category'

const createSchema = z.object({
  code: z.string().min(1, 'Mã danh mục là bắt buộc'),
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
})

const updateSchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

// Union type for form values
type FormValues = {
  code?: string
  name: string
  description?: string
  isActive?: boolean
}

interface CategoryDialogProps {
  category?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ category, open, onOpenChange }: CategoryDialogProps) {
  const isEditing = !!category
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEditing ? updateSchema : createSchema) as any,
    defaultValues: {
      code: '',
      name: '',
      description: '',
      isActive: true,
    },
  })

  // Determine active state for edit mode
  const isActive = watch('isActive')

  useEffect(() => {
    if (open) {
      if (category) {
        // Editing
        setValue('code', category.code)
        setValue('name', category.name)
        setValue('description', category.description || '')
        setValue('isActive', category.isActive)
      } else {
        // Creating
        reset({
          code: '',
          name: '',
          description: '',
          isActive: true,
        })
      }
    }
  }, [category, open, setValue, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (isEditing && category) {
        const updateData: CategoryUpdateRequest = {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
        }
        return categoryService.update(category.id, updateData)
      } else {
        const createData: CategoryCreateRequest = {
          code: data.code || '',
          name: data.name,
          description: data.description,
        }
        return categoryService.create(createData)
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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
      <DialogContent className='sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white'>
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            {isEditing ? (
              <Pencil className='h-24 w-24 -mr-4 -mt-4' />
            ) : (
              <FolderPlus className='h-24 w-24 -mr-4 -mt-4' />
            )}
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-xl font-bold flex items-center gap-2'>
              {isEditing ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục Mới'}
            </DialogTitle>
            <DialogDescription className='text-slate-300 mt-1'>
              {isEditing
                ? `Chỉnh sửa thông tin danh mục #${category?.id}`
                : 'Thêm danh mục sản phẩm mới vào hệ thống'}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
          {/* Code Field - ReadOnly in Edit Mode */}
          <div className='grid gap-2'>
            <Label htmlFor='code' className='text-slate-700'>
              Mã danh mục <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='code'
              placeholder='VD: A01'
              {...register('code')}
              disabled={isEditing}
              className={`h-10 ${isEditing ? 'bg-slate-100 text-slate-500' : ''}`}
            />
            {errors.code && <span className='text-red-500 text-xs'>{errors.code.message}</span>}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='name' className='text-slate-700'>
              Tên danh mục <span className='text-red-500'>*</span>
            </Label>
            <Input id='name' placeholder='VD: Áo Thun' {...register('name')} className='h-10' />
            {errors.name && <span className='text-red-500 text-xs'>{errors.name.message}</span>}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description' className='text-slate-700'>
              Mô tả
            </Label>
            <Textarea
              id='description'
              placeholder='Mô tả ngắn về danh mục...'
              {...register('description')}
              className='resize-none h-20'
            />
          </div>

          {isEditing && (
            <div className='flex items-center justify-between border p-3 rounded-lg bg-slate-50'>
              <div className='space-y-0.5'>
                <Label className='text-base'>Trạng thái hoạt động</Label>
                <div className='text-xs text-muted-foreground'>
                  {isActive ? 'Danh mục đang hiển thị' : 'Danh mục đang bị ẩn'}
                </div>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>
          )}

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
