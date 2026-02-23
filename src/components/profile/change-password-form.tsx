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
import { Lock } from 'lucide-react'

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
      if (response.data.success) {
        toast.success(response.data.message || 'Đổi mật khẩu thành công')
        form.reset()
      } else {
        toast.error(response.data.message || 'Đổi mật khẩu thất bại')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
      {/* Header */}
      <div className='px-6 md:px-8 py-5 border-b border-slate-100'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100'>
            <Lock className='w-5 h-5 text-amber-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900'>Đổi mật khẩu</h2>
            <p className='text-xs text-muted-foreground'>Cập nhật mật khẩu để bảo mật tài khoản</p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='px-6 md:px-8 py-6 space-y-5'>
          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Mật khẩu hiện tại
            </label>
            <Input
              type='password'
              placeholder='Nhập mật khẩu hiện tại'
              {...form.register('currentPassword')}
              className='border-slate-200 focus:border-slate-400'
            />
            {form.formState.errors.currentPassword && (
              <p className='text-xs text-red-500'>
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Mật khẩu mới
            </label>
            <Input
              type='password'
              placeholder='Nhập mật khẩu mới'
              {...form.register('newPassword')}
              className='border-slate-200 focus:border-slate-400'
            />
            {form.formState.errors.newPassword && (
              <p className='text-xs text-red-500'>{form.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Nhập lại mật khẩu mới
            </label>
            <Input
              type='password'
              placeholder='Nhập lại mật khẩu mới'
              {...form.register('confirmPassword')}
              className='border-slate-200 focus:border-slate-400'
            />
            {form.formState.errors.confirmPassword && (
              <p className='text-xs text-red-500'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50/50'>
          <Button
            type='submit'
            className='bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 h-10 rounded-lg shadow-sm'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </form>
    </div>
  )
}
