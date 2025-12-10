'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Facebook, Github, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Gender } from '@/constants/enum/gender'
import { authService } from '@/services/auth'
import { cn } from '@/lib/utils'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Nhập tên'),
    lastName: z.string().min(1, 'Nhập họ'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(8, 'Tối thiểu 8 ký tự'),
    gender: z.nativeEnum(Gender, { required_error: 'Chọn giới tính' }),
    dateOfBirth: z.string().min(1, 'Chọn ngày sinh'),
    phone: z.string().min(9, 'Số điện thoại chưa hợp lệ'),
    address: z.string().min(5, 'Địa chỉ tối thiểu 5 ký tự'),
    city: z.string().min(2, 'Nhập thành phố'),
    agree: z.literal(true, {
      errorMap: () => ({ message: 'Bạn cần đồng ý điều khoản' }),
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
      gender: undefined,
      dateOfBirth: '',
      phone: '',
      address: '',
      city: '',
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
        gender: values.gender,
        dateOfBirth: format(new Date(values.dateOfBirth), 'yyyy-MM-dd'),
        phone: values.phone,
        address: values.address,
        city: values.city,
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
    <div className='space-y-6 rounded-2xl border bg-white p-8 shadow-sm'>
      <div className='space-y-2 text-center'>
        <p className='text-sm text-primary font-medium uppercase tracking-wide'>Bắt đầu miễn phí</p>
        <h2 className='text-2xl font-semibold text-gray-900'>Tạo tài khoản mới</h2>
        <p className='text-sm text-gray-600'>
          Đã có tài khoản?{' '}
          <Link href='/auth/login' className='font-medium text-primary'>
            Đăng nhập
          </Link>
        </p>
      </div>

      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Họ</label>
            <div className='relative'>
              <UserRound className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
              <Input
                className='pl-10'
                placeholder='Nhập họ'
                type='text'
                {...form.register('lastName')}
              />
            </div>
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

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Mật khẩu</label>
            <Input
              placeholder='Nhập mật khẩu'
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className='text-sm text-destructive'>{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Xác nhận mật khẩu</label>
            <Input
              placeholder='Nhập lại mật khẩu'
              type={showPassword ? 'text' : 'password'}
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='text-xs text-primary underline'
            >
              {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Giới tính</label>
            <Select
              onValueChange={(val) =>
                form.setValue('gender', val as Gender, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn giới tính' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Nam</SelectItem>
                <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                <SelectItem value={Gender.OTHER}>Khác</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.gender && (
              <p className='text-sm text-destructive'>{form.formState.errors.gender.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Ngày sinh</label>
            <Input type='date' {...form.register('dateOfBirth')} />
            {form.formState.errors.dateOfBirth && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Số điện thoại</label>
            <Input placeholder='Nhập số điện thoại' {...form.register('phone')} />
            {form.formState.errors.phone && (
              <p className='text-sm text-destructive'>{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-800'>Thành phố</label>
            <Input placeholder='VD: HO_CHI_MINH' {...form.register('city')} />
            {form.formState.errors.city && (
              <p className='text-sm text-destructive'>{form.formState.errors.city.message}</p>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-800'>Địa chỉ</label>
          <Input placeholder='Số nhà, đường, quận' {...form.register('address')} />
          {form.formState.errors.address && (
            <p className='text-sm text-destructive'>{form.formState.errors.address.message}</p>
          )}
        </div>

        <div className='flex items-start gap-2'>
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
        {form.formState.errors.agree && (
          <p className='text-sm text-destructive'>{form.formState.errors.agree.message}</p>
        )}

        <Button className='w-full' size='lg' type='submit' disabled={isPending}>
          {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>
      </form>

      <div className='grid gap-3'>
        {socials.map((social) => {
          const Icon = social.icon
          return (
            <Button
              key={social.label}
              type='button'
              variant={social.variant ?? 'secondary'}
              className={cn(
                'w-full justify-center gap-2',
                social.variant === 'outline' && 'bg-white',
              )}
            >
              <Icon className='size-4' />
              {social.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
