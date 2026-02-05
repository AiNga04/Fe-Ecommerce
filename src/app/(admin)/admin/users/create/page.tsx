'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Loader2, CalendarIcon } from 'lucide-react'
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
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='outline' size='icon' asChild>
          <Link href='/admin/users'>
            <ChevronLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-3xl font-bold tracking-tight'>Thêm người dùng mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>Thông tin đăng nhập và định danh cơ bản</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>
                  Họ & Tên đệm <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='lastName'
                  placeholder='Nguyễn Văn'
                  {...register('lastName', { required: 'Vui lòng nhập họ' })}
                />
                {errors.lastName && (
                  <p className='text-xs text-red-500'>{errors.lastName.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>
                  Tên <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='firstName'
                  placeholder='A'
                  {...register('firstName', { required: 'Vui lòng nhập tên' })}
                />
                {errors.firstName && (
                  <p className='text-xs text-red-500'>{errors.firstName.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>
                  Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='example@mail.com'
                  {...register('email', { required: 'Vui lòng nhập email' })}
                />
                {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>
                  Mật khẩu <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='password'
                  id='password'
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                  })}
                />
                {errors.password && (
                  <p className='text-xs text-red-500'>{errors.password.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân & Liên hệ</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label>Giới tính</Label>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
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
                <Label htmlFor='dateOfBirth'>Ngày sinh</Label>
                <Input type='date' id='dateOfBirth' {...register('dateOfBirth')} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Số điện thoại</Label>
                <Input id='phone' placeholder='09xxxx' {...register('phone')} />
              </div>

              <div className='space-y-2'>
                <Label>Thành phố</Label>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
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
                <Label htmlFor='address'>Địa chỉ chi tiết</Label>
                <Input
                  id='address'
                  placeholder='Số nhà, đường, phường/xã...'
                  {...register('address')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân quyền</CardTitle>
              <CardDescription>Chọn vai trò cho người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-4'>
                {Object.values(Role).map((role) => (
                  <div key={role} className='flex items-center space-x-2'>
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
                          />
                        )
                      }}
                    />
                    <Label htmlFor={`role-${role}`} className='cursor-pointer'>
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end gap-4'>
            <Button variant='outline' type='button' onClick={() => router.back()}>
              Hủy bỏ
            </Button>
            <Button type='submit' disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Tạo người dùng
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
