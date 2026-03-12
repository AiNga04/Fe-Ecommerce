'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth'
import { toast } from 'sonner'
import { Mail, AlertTriangle } from 'lucide-react'

const changeEmailSchema = z.object({
  newEmail: z.string().email('Email không hợp lệ'),
})

interface ChangeEmailFormProps {
  currentEmail?: string
}

export function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: '',
    },
  })

  const handleSubmit = async (values: z.infer<typeof changeEmailSchema>) => {
    if (values.newEmail === currentEmail) {
      toast.error('Email mới phải khác email hiện tại')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.changeEmail({ newEmail: values.newEmail })
      if (response.data.success) {
        toast.success(response.data.message || 'Đổi email thành công! Vui lòng kiểm tra hộp thư mới để kích hoạt.')
        form.reset()
      } else {
        toast.error(response.data.message || 'Đổi email thất bại')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi email'
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
          <div className='p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100'>
            <Mail className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900'>Đổi email</h2>
            <p className='text-xs text-muted-foreground'>Cập nhật địa chỉ email tài khoản</p>
          </div>
        </div>
      </div>

      {/* Warning banner */}
      <div className='mx-6 md:mx-8 mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3'>
        <AlertTriangle className='w-5 h-5 text-amber-600 shrink-0 mt-0.5' />
        <div className='text-sm text-amber-800'>
          <p className='font-semibold'>Lưu ý quan trọng</p>
          <p className='text-amber-700 mt-0.5'>
            Sau khi đổi email, tài khoản sẽ chuyển sang trạng thái chờ kích hoạt. Bạn cần xác nhận email mới để có thể đăng nhập lại.
          </p>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='px-6 md:px-8 py-6 space-y-5'>
          {currentEmail && (
            <div className='space-y-1.5'>
              <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
                Email hiện tại
              </label>
              <div className='px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium'>
                {currentEmail}
              </div>
            </div>
          )}

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Email mới
            </label>
            <Input
              type='email'
              placeholder='Nhập email mới'
              {...form.register('newEmail')}
              className='border-slate-200 focus:border-slate-400'
            />
            {form.formState.errors.newEmail && (
              <p className='text-xs text-red-500'>
                {form.formState.errors.newEmail.message}
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
            {isSubmitting ? 'Đang xử lý...' : 'Đổi email'}
          </Button>
        </div>
      </form>
    </div>
  )
}
