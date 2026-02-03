'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Facebook, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Routers from '@/constants/routers'
import { AUTH_ME_QUERY_KEY } from '@/constants/query-keys'
import { persistRefreshTokenCookie } from '@/lib/refresh-token-client'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/store/auth'
import type { LoginResponse } from '@/schemas/auth/login'
import { cn, getValidRedirectUrl } from '@/lib/utils'
import { Role } from '@/constants/enum/role'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(50, 'Mật khẩu quá dài'),
})

type LoginFormValues = z.infer<typeof loginSchema>

type SocialButton = {
  label: string
  icon: React.ElementType
  variant?: 'ghost' | 'outline'
}

const socialButtons: SocialButton[] = [
  { label: 'Đăng nhập với Google', icon: Mail, variant: 'outline' },
  { label: 'Đăng nhập với Facebook', icon: Facebook },
]

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await authService.login(values)
      const payload = data.data as LoginResponse

      await persistRefreshTokenCookie(payload.refreshToken)
      setAccessToken(payload.accessToken)
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, payload.user)

      toast.success(data.message || 'Đăng nhập thành công')

      // ✅ Ưu tiên 1: redirectUrl (nếu hợp lệ)
      const redirectUrl = getValidRedirectUrl(searchParams)

      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }

      // ✅ Ưu tiên 2: role-based redirect
      const roles = payload.user.roles ?? []

      if (roles.includes(Role.ADMIN)) {
        window.location.href = Routers.ADMIN
      } else if (roles.includes(Role.STAFF)) {
        window.location.href = Routers.STAFF
      } else if (roles.includes(Role.SHIPPER)) {
        window.location.href = Routers.SHIPPER
      } else {
        window.location.href = Routers.HOME
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Đăng nhập thất bại, thử lại'

      toast.error(message)
    }
  }

  const socials = socialButtons

  return (
    <div className='w-full max-w-lg mx-auto space-y-8'>
      {/* Header - Only visible on mobile/tablet */}
      <div className='md:hidden space-y-2 text-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Chào mừng trở lại</h1>
        <p className='text-sm text-gray-600'>Đăng nhập vào tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-800'>Email</label>
          <Input placeholder='Nhập địa chỉ email của bạn' type='email' {...register('email')} />
          {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-800'>Mật khẩu</label>
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Nhập mật khẩu của bạn'
              {...register('password')}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition'
            >
              {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
            </button>
          </div>
          {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
        </div>

        <Button
          type='submit'
          className='w-full py-6 text-base font-semibold'
          size='lg'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      {/* Divider */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 h-px bg-border'></div>
        <span className='text-sm text-muted-foreground'>Hoặc</span>
        <div className='flex-1 h-px bg-border'></div>
      </div>

      {/* Social Login */}
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
        Chưa có tài khoản?{' '}
        <Link href={Routers.REGISTER} className='font-medium text-primary hover:underline'>
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}
