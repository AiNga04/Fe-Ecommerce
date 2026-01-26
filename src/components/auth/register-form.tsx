'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Facebook, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth'
import { cn } from '@/lib/utils'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Nhập tên'),
    lastName: z.string().min(1, 'Nhập họ'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
    agree: z.boolean().refine((val) => val === true, {
      message: 'Bạn cần đồng ý điều khoản',
    }),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu không khớp',
  })

type RegisterFormValues = z.infer<typeof registerSchema>

type SocialButton = {
  label: string
  icon: React.ElementType
  variant?: 'ghost' | 'outline'
}

const socialButtons: SocialButton[] = [
  { label: 'Đăng ký với Google', icon: Mail, variant: 'outline' },
  { label: 'Đăng ký với Facebook', icon: Facebook },
]

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
      agree: false,
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
      toast.success(res.message || 'Đăng ký thành công, kiểm tra email')
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

  const socials = socialButtons

  return (
    <div className='w-full max-w-lg mx-auto space-y-8'>
      <div className='md:hidden space-y-2 text-center'>
        <h2 className='text-2xl font-semibold text-gray-900'>Tạo tài khoản mới</h2>
        <p className='text-sm text-gray-600'>Bắt đầu miễn phí</p>
      </div>

      <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Họ</label>
            <Input placeholder='Nhập họ' type='text' {...form.register('lastName')} />
            {form.formState.errors.lastName && (
              <p className='text-sm text-destructive'>{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Tên</label>
            <Input placeholder='Nhập tên' type='text' {...form.register('firstName')} />
            {form.formState.errors.firstName && (
              <p className='text-sm text-destructive'>{form.formState.errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-800'>Email</label>
          <Input placeholder='nhapemail@domain.com' type='email' {...form.register('email')} />
          {form.formState.errors.email && (
            <p className='text-sm text-destructive'>{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Mật khẩu</label>
            <div className='relative'>
              <Input
                placeholder='Nhập mật khẩu'
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition'
              >
                {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className='text-sm text-destructive'>{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Xác nhận mật khẩu</label>
            <div className='relative'>
              <Input
                placeholder='Nhập lại mật khẩu'
                type={showPassword ? 'text' : 'password'}
                {...form.register('confirmPassword')}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition'
              >
                {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-start gap-2 pt-2'>
          <Checkbox
            id='terms'
            checked={form.watch('agree')}
            onCheckedChange={(checked) =>
              form.setValue('agree', Boolean(checked), {
                shouldValidate: true,
              })
            }
          />
          <label htmlFor='terms' className='text-sm text-gray-600 leading-snug cursor-pointer'>
            Tôi đồng ý với{' '}
            <Link href='/terms' className='font-medium text-primary'>
              điều khoản
            </Link>{' '}
            và{' '}
            <Link href='/privacy' className='font-medium text-primary'>
              chính sách bảo mật
            </Link>
            .
          </label>
        </div>

        <Button
          className='w-full py-6 text-base font-semibold'
          size='lg'
          type='submit'
          disabled={isPending}
        >
          {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>
      </form>

      {/* Divider */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 h-px bg-border'></div>
        <span className='text-sm text-muted-foreground'>Hoặc</span>
        <div className='flex-1 h-px bg-border'></div>
      </div>

      <div className='grid gap-3'>
        {socials.map((social) => {
          const Icon = social.icon
          return (
            <Button
              key={social.label}
              type='button'
              variant={social.variant ?? 'secondary'}
              className={cn(
                'w-full justify-center gap-2 py-5 text-base hover:bg-muted/80',
                social.variant === 'outline' && 'bg-white border-2',
                social.label.includes('Google') && 'text-blue-600 hover:text-blue-700',
                social.label.includes('Facebook') &&
                  'bg-blue-600 text-white hover:bg-blue-700 hover:text-white',
              )}
            >
              <Icon className='size-5' />
              {social.label}
            </Button>
          )
        })}
      </div>

      <p className='text-center text-sm text-gray-600'>
        Đã có tài khoản?{' '}
        <Link href='/auth/login' className='font-medium text-primary hover:underline'>
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
