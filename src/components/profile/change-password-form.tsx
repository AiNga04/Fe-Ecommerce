'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth'
import { toast } from 'sonner'
import { ChangePasswordRequest } from '@/types/auth'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    setIsSubmitting(true)
    const payload: ChangePasswordRequest = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    }

    try {
      const response = await authService.changePassword(payload)
      // Note: Assuming standard response structure. Adjust if response.data.success etc.
      if (response.data.success) {
        toast.success(response.data.message || 'Đổi mật khẩu thành công')
        form.reset()
      } else {
        toast.error(response.data.message || 'Đổi mật khẩu thất bại')
      }
    } catch (error: any) {
      // Checking for common error structure. Adjust as needed based on implementation.
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-8'>
      <div className='mb-6'>
        <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>Đổi mật khẩu</h2>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <label className='font-bold text-xs uppercase text-gray-500'>Mật khẩu hiện tại</label>
          <Input
            type='password'
            placeholder='Nhập mật khẩu hiện tại'
            {...form.register('currentPassword')}
          />
          {form.formState.errors.currentPassword && (
            <p className='text-sm text-red-500'>{form.formState.errors.currentPassword.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='font-bold text-xs uppercase text-gray-500'>Mật khẩu mới</label>
          <Input
            type='password'
            placeholder='Nhập mật khẩu mới'
            {...form.register('newPassword')}
          />
          {form.formState.errors.newPassword && (
            <p className='text-sm text-red-500'>{form.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='font-bold text-xs uppercase text-gray-500'>Nhập lại mật khẩu mới</label>
          <Input
            type='password'
            placeholder='Nhập lại mật khẩu mới'
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword && (
            <p className='text-sm text-red-500'>{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type='submit'
          className='bg-black hover:bg-gray-800 text-white font-medium px-8 h-11 rounded-lg mt-2'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </div>
  )
}
