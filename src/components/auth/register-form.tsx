'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth'
import Routers from '@/constants/routers'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().min(1, 'Vui lòng nhập họ'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu không khớp',
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      }

      const res = await authService.register(payload)
      return res.data
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Đăng ký thành công, vui lòng kiểm tra email')
      router.push('/auth/login')
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại'
      toast.error(message)
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    await mutateAsync(values)
  }

  return (
    <div className='w-full max-w-md mx-auto lg:mx-0'>
      {/* Header for Mobile only */}
      <div className='lg:hidden space-y-4 mb-8 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-slate-900'>Tạo tài khoản</h1>
        <p className='text-lg text-slate-500'>Bắt đầu hành trình của bạn</p>
      </div>

      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-base font-bold text-slate-900'>Họ</label>
            <Input
              placeholder='Nhập họ'
              {...form.register('lastName')}
              className='h-14 bg-slate-100/80 border-transparent rounded-xl focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-200 text-base px-5'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-base font-bold text-slate-900'>Tên</label>
            <Input
              placeholder='Nhập tên'
              {...form.register('firstName')}
              className='h-14 bg-slate-100/80 border-transparent rounded-xl focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-200 text-base px-5'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-base font-bold text-slate-900'>Email</label>
          <Input
            placeholder='Nhập địa chỉ email của bạn'
            type='email'
            {...form.register('email')}
            className='h-14 bg-slate-100/80 border-transparent rounded-xl focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-200 text-base px-5'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-base font-bold text-slate-900'>Mật khẩu</label>
          <div className='relative'>
            <Input
              placeholder='Nhập mật khẩu'
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
              className='h-14 bg-slate-100/80 border-transparent rounded-xl focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-200 text-base px-5 pr-12'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition'
            >
              {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
            </button>
          </div>
        </div>

        <Button
          className='w-full h-14 text-lg font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg transition-all active:scale-[0.98]'
          type='submit'
          disabled={isPending}
        >
          {isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
        </Button>
      </form>

      {/* Divider */}
      <div className='relative my-10 text-center'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-slate-200'></div>
        </div>
        <span className='relative bg-white px-4 text-sm font-medium text-slate-400 uppercase tracking-widest'>
          Hoặc
        </span>
      </div>

      {/* Social Login */}
      <div className='space-y-4'>
        <Button
          variant='outline'
          className='w-full h-14 justify-center gap-3 rounded-xl border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-all'
        >
          <Image
            src='https://www.svgrepo.com/show/475656/google-color.svg'
            width={20}
            height={20}
            alt='Google'
          />
          Đăng ký với Google
        </Button>
        <Button className='w-full h-14 justify-center gap-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition-all shadow-md'>
          <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24'>
            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
          </svg>
          Đăng ký với Facebook
        </Button>
      </div>

      <p className='mt-10 text-center text-base font-medium text-slate-500'>
        Đã có tài khoản?{' '}
        <Link
          href={Routers.LOGIN}
          className='text-slate-900 border-b-2 border-slate-900 font-bold hover:text-black hover:border-black transition-all pb-0.5 ml-1'
        >
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  )
}
