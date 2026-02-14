'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, CalendarIcon, Plus, KeyRound, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { userService } from '@/services/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { Calendar } from '@/components/ui/calendar' // Use standard date input for simplicity if calendar component issues arise, but let's try standard input first for robustness.
import { Gender, Role, City, UserCreateRequest } from '@/types/user'
import { Checkbox } from '@/components/ui/checkbox'
import { CITIES } from '@/constants/locations'

export default function CreateUserPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserCreateRequest>({
    defaultValues: {
      roles: [Role.USER], // Default role
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: UserCreateRequest) => userService.createUser(data),
    onSuccess: () => {
      toast.success('Tạo người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      router.push('/admin/users')
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(
        'Tạo người dùng thất bại: ' + (error?.response?.data?.message || 'Lỗi không xác định'),
      )
    },
  })

  const onSubmit = (data: UserCreateRequest) => {
    // Ensure roles is array
    const payload = {
      ...data,
      roles: Array.isArray(data.roles) ? data.roles : [data.roles],
    }
    createMutation.mutate(payload as UserCreateRequest)
  }

  return (
    <div className='pb-10'>
      <div className='flex items-center gap-4 mb-8'>
        <Button
          variant='outline'
          size='icon'
          asChild
          className='h-10 w-10 rounded-full border-slate-200 bg-white hover:bg-slate-50'
        >
          <Link href='/admin/users'>
            <ChevronLeft className='h-5 w-5 text-slate-600' />
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
            Thêm người dùng mới
          </h1>
          <p className='text-slate-500 font-medium'>Tạo tài khoản khách hàng hoặc nhân viên mới</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-8'>
          {/* Account Info */}
          <Card className='border-none shadow-md overflow-hidden'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-blue-50 text-blue-600'>
                  <KeyRound className='h-5 w-5' />
                </div>
                Tài khoản
              </CardTitle>
              <CardDescription>Thiết lập thông tin đăng nhập và định danh cơ bản.</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-6 md:grid-cols-2 pt-2'>
              <div className='space-y-2'>
                <Label htmlFor='lastName' className='text-slate-700'>
                  Họ & Tên đệm <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='lastName'
                  placeholder='Ví dụ: Nguyễn Văn'
                  {...register('lastName', { required: 'Vui lòng nhập họ' })}
                  className='border-slate-200 focus-visible:ring-blue-500'
                />
                {errors.lastName && (
                  <p className='text-xs text-red-500 font-medium'>{errors.lastName.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='firstName' className='text-slate-700'>
                  Tên <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='firstName'
                  placeholder='Ví dụ: A'
                  {...register('firstName', { required: 'Vui lòng nhập tên' })}
                  className='border-slate-200 focus-visible:ring-blue-500'
                />
                {errors.firstName && (
                  <p className='text-xs text-red-500 font-medium'>{errors.firstName.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email' className='text-slate-700'>
                  Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='example@mail.com'
                  autoComplete="off"
                  {...register('email', { required: 'Vui lòng nhập email' })}
                  className='border-slate-200 focus-visible:ring-blue-500'
                />
                {errors.email && (
                  <p className='text-xs text-red-500 font-medium'>{errors.email.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password' className='text-slate-700'>
                  Mật khẩu <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='password'
                  id='password'
                  placeholder='••••••'
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                  })}
                  className='border-slate-200 focus-visible:ring-blue-500'
                />
                {errors.password && (
                  <p className='text-xs text-red-500 font-medium'>{errors.password.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal & Contact */}
          <Card className='border-none shadow-md overflow-hidden'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-green-50 text-green-600'>
                  <CalendarIcon className='h-5 w-5' />
                </div>
                Cá nhân & Liên hệ
              </CardTitle>
              <CardDescription>Thông tin chi tiết và địa chỉ giao hàng.</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-6 md:grid-cols-2 pt-2'>
              <div className='space-y-2'>
                <Label className='text-slate-700'>Giới tính</Label>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className='w-full border-slate-200 focus:ring-green-500'>
                        <SelectValue placeholder='Chọn giới tính' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Nam</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                        <SelectItem value={Gender.OTHER}>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dateOfBirth' className='text-slate-700'>
                  Ngày sinh
                </Label>
                <Input
                  type='date'
                  id='dateOfBirth'
                  {...register('dateOfBirth')}
                  className='border-slate-200 focus-visible:ring-green-500'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone' className='text-slate-700'>
                  Số điện thoại
                </Label>
                <Input
                  id='phone'
                  placeholder='09xx xxx xxx'
                  {...register('phone')}
                  className='border-slate-200 focus-visible:ring-green-500'
                />
              </div>

              <div className='space-y-2'>
                <Label className='text-slate-700'>Thành phố</Label>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className='w-full border-slate-200 focus:ring-green-500'>
                        <SelectValue placeholder='Chọn thành phố' />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                        <SelectItem value={City.OTHER}>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address' className='text-slate-700'>
                  Địa chỉ chi tiết
                </Label>
                <Input
                  id='address'
                  placeholder='Số nhà, tên đường, phường/xã...'
                  {...register('address')}
                  className='border-slate-200 focus-visible:ring-green-500'
                />
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card className='border-none shadow-md overflow-hidden'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-purple-50 text-purple-600'>
                  <CheckCheckbox className='h-5 w-5' />
                </div>
                Phân quyền
              </CardTitle>
              <CardDescription>Gán vai trò và quyền hạn trên hệ thống.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100'>
                {Object.values(Role).map((role) => (
                  <div key={role} className='flex items-center space-x-3'>
                    <Controller
                      name='roles'
                      control={control}
                      render={({ field }) => {
                        const currentRoles = (
                          Array.isArray(field.value) ? field.value : []
                        ) as string[]
                        return (
                          <Checkbox
                            id={`role-${role}`}
                            checked={currentRoles.includes(role)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...currentRoles, role])
                              } else {
                                field.onChange(currentRoles.filter((r) => r !== role))
                              }
                            }}
                            className='data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600'
                          />
                        )
                      }}
                    />
                    <Label
                      htmlFor={`role-${role}`}
                      className='cursor-pointer text-sm font-medium text-slate-700'
                    >
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='flex items-center justify-end gap-4'>
            <Button
              variant='ghost'
              type='button'
              onClick={() => router.back()}
              className='text-slate-500 hover:text-slate-700'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending}
              className='bg-slate-900 hover:bg-slate-800 text-white min-w-[140px] shadow-lg shadow-slate-200'
            >
              {createMutation.isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <div className='flex items-center'>
                  <Plus className='mr-2 h-4 w-4' /> Tạo người dùng
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

function CheckCheckbox(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
      <path d='m9 12 2 2 4-4' />
    </svg>
  )
}
