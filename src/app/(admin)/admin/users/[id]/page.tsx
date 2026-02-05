'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Gender, Role, City, UserUpdateRequest, UserStatus } from '@/types/user'
import { CITIES } from '@/constants/locations'

export default function EditUserPage() {
  const params = useParams()
  const userId = params.id as string
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserUpdateRequest>()

  const {
    data: userResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  })

  // Pre-fill form
  useEffect(() => {
    if (userResponse?.data?.data) {
      const user = userResponse.data.data
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email, // Often disable editing email, but included for display
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        city: user.city as string, // Cast/Map enum if needed
        gender: user.gender,
        status: user.status,
        roles: user.roles, // Ensure API returns array of strings matching enum
      })
    }
  }, [userResponse, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UserUpdateRequest) => userService.updateUser(userId, data),
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      router.push('/admin/users')
    },
    onError: (error: any) => {
      console.error(error)
      toast.error('Cập nhật thất bại: ' + (error?.response?.data?.message || 'Lỗi không xác định'))
    },
  })

  const onSubmit = (data: UserUpdateRequest) => {
    // Ensure roles is array
    const payload = {
      ...data,
      roles: Array.isArray(data.roles) ? data.roles : data.roles ? [data.roles] : [],
    }
    updateMutation.mutate(payload as UserUpdateRequest)
  }

  if (isLoading)
    return (
      <div className='p-8 flex justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  if (isError || !userResponse?.data?.data)
    return <div className='p-8'>Không tìm thấy người dùng</div>

  const user = userResponse.data.data

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' asChild>
            <Link href='/admin/users'>
              <ChevronLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Sửa người dùng</h1>
            <p className='text-muted-foreground'>ID: #{user.id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>
                  Họ & Tên đệm <span className='text-red-500'>*</span>
                </Label>
                <Input id='lastName' {...register('lastName', { required: 'Vui lòng nhập họ' })} />
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
                  {...register('firstName', { required: 'Vui lòng nhập tên' })}
                />
                {errors.firstName && (
                  <p className='text-xs text-red-500'>{errors.firstName.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' disabled {...register('email')} className='bg-muted' />
                <p className='text-xs text-muted-foreground'>Email không thể thay đổi</p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Mật khẩu mới</Label>
                <Input
                  type='password'
                  id='password'
                  placeholder='Để trống nếu không đổi'
                  {...register('password', {
                    minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                  })}
                />
                {errors.password && (
                  <p className='text-xs text-red-500'>{errors.password.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Trạng thái</Label>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserStatus.PENDING}>Chờ duyệt</SelectItem>
                        <SelectItem value={UserStatus.ACTIVE}>Hoạt động</SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>Không hoạt động</SelectItem>
                        <SelectItem value={UserStatus.LOCKED}>Đã khóa</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value as string}>
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
            <Button type='submit' disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
