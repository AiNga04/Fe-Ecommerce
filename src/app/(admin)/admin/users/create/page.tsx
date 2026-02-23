'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Plus,
  KeyRound,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  X,
} from 'lucide-react'
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
    <div className='pb-10 w-full mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='outline'
          size='icon'
          asChild
          className='h-10 w-10 rounded-full border-slate-200 bg-white hover:bg-slate-50 shadow-sm'
        >
          <Link href='/admin/users'>
            <ChevronLeft className='h-5 w-5 text-slate-600' />
          </Link>
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>Thêm người dùng mới</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Thiết lập hồ sơ người dùng để cấp quyền truy cập vào hệ thống.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Main Grid: 2 Columns for Info */}
        <div className='grid gap-6 md:grid-cols-2 lg:items-start'>
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <KeyRound className='h-5 w-5' /> Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='grid grid-cols-2 gap-4 pb-1.5'>
                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='text-slate-700 font-medium'>
                    Họ & Tên đệm <span className='text-red-500'>*</span>
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                    <Input
                      id='lastName'
                      placeholder='Nguyễn Văn'
                      {...register('lastName', { required: 'Vui lòng nhập họ' })}
                      className='pl-9 h-10 border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 focus:bg-white transition-colors'
                    />
                  </div>
                  {errors.lastName && (
                    <p className='text-xs text-red-500 font-medium'>{errors.lastName.message}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='text-slate-700 font-medium'>
                    Tên <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='A'
                    {...register('firstName', { required: 'Vui lòng nhập tên' })}
                    className='h-10 border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 focus:bg-white transition-colors'
                  />
                  {errors.firstName && (
                    <p className='text-xs text-red-500 font-medium'>{errors.firstName.message}</p>
                  )}
                </div>
              </div>

              <div className='space-y-2 pb-1.5'>
                <Label htmlFor='email' className='text-slate-700 font-medium'>
                  Email đăng nhập <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                  <Input
                    type='email'
                    id='email'
                    placeholder='name@company.com'
                    autoComplete='off'
                    {...register('email', { required: 'Vui lòng nhập email' })}
                    className='pl-9 h-10 border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
                {errors.email && (
                  <p className='text-xs text-red-500 font-medium'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className='text-slate-700 font-medium'>
                  Mật khẩu khởi tạo <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <KeyRound className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                  <Input
                    type='password'
                    id='password'
                    placeholder='••••••••'
                    autoComplete='new-password'
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
                    })}
                    className='pl-9 h-10 border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
                {errors.password && (
                  <p className='text-xs text-red-500 font-medium'>{errors.password.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold flex items-center gap-2'>
                <User className='h-5 w-5' /> Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='text-slate-700 font-medium'>Giới tính</Label>
                  <Controller
                    name='gender'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className='w-full h-10 border-slate-200 focus:ring-emerald-500 bg-slate-50/50'>
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
                  <Label htmlFor='dateOfBirth' className='text-slate-700 font-medium'>
                    Ngày sinh
                  </Label>
                  <div className='relative'>
                    <CalendarIcon className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                    <Input
                      type='date'
                      id='dateOfBirth'
                      {...register('dateOfBirth')}
                      className='pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 bg-slate-50/50 focus:bg-white transition-colors block w-full'
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='text-slate-700 font-medium'>
                    Số điện thoại
                  </Label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                    <Input
                      id='phone'
                      placeholder='09xx...'
                      {...register('phone')}
                      className='pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 bg-slate-50/50 focus:bg-white transition-colors'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label className='text-slate-700 font-medium'>Thành phố</Label>
                  <Controller
                    name='city'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className='w-full h-10 border-slate-200 focus:ring-emerald-500 bg-slate-50/50'>
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
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address' className='text-slate-700 font-medium'>
                  Địa chỉ chi tiết
                </Label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                  <Input
                    id='address'
                    placeholder='Số nhà, tên đường, phường/xã...'
                    {...register('address')}
                    className='pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles Section - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base font-semibold flex items-center gap-2'>
              <Shield className='h-5 w-5' /> Phân quyền truy cập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {Object.values(Role).map((role) => (
                <Controller
                  key={role}
                  name='roles'
                  control={control}
                  render={({ field }) => {
                    const currentRoles = (Array.isArray(field.value) ? field.value : []) as string[]
                    const isChecked = currentRoles.includes(role)
                    return (
                      <label
                        htmlFor={`role-${role}`}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer h-full ${
                          isChecked
                            ? 'border-slate-800 bg-slate-50 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <Checkbox
                          id={`role-${role}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...currentRoles, role])
                            } else {
                              field.onChange(currentRoles.filter((r) => r !== role))
                            }
                          }}
                          className='mt-1 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900'
                        />
                        <div className='flex-1'>
                          <div
                            className={`font-semibold text-sm mb-1 ${
                              isChecked ? 'text-slate-900' : 'text-slate-700'
                            }`}
                          >
                            {role}
                          </div>
                          <div className='text-xs text-slate-500 leading-tight'>
                            {role === Role.ADMIN
                              ? 'Quyền quản trị cao nhất, truy cập mọi tính năng.'
                              : role === Role.STAFF
                                ? 'Quản lý sản phẩm, đơn hàng và nội dung.'
                                : role === Role.SHIPPER
                                  ? 'Xem và cập nhật trạng thái giao hàng.'
                                  : 'Khách hàng mua sắm và quản lý đơn cá nhân.'}
                          </div>
                        </div>
                      </label>
                    )
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-4 pt-4 border-t border-slate-100'>
          <Button
            variant='outline'
            type='button'
            onClick={() => router.back()}
            className='h-11 px-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          >
            <X className='mr-2 h-4 w-4' /> Hủy bỏ
          </Button>
          <Button
            type='submit'
            disabled={createMutation.isPending}
            className='bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 text-base shadow-lg shadow-slate-900/10'
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang xử lý...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' /> Tạo người dùng
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
