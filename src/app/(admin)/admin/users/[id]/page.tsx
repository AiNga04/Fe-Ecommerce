'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Clock,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Undo2,
  Camera,
  Save,
  CalendarIcon,
  KeyRound,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Gender, Role, City, UserUpdateRequest, UserStatus } from '@/types/user'
import { CITIES } from '@/constants/locations'
import { getImageUrl } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(searchParams.get('mode') === 'edit')

  const avatarInputRef = React.useRef<HTMLInputElement>(null)

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

  // Pre-fill form when entering edit mode or data loads
  useEffect(() => {
    if (userResponse?.data?.data) {
      const user = userResponse.data.data
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        city: user.city as string,
        gender: user.gender,
        status: user.status,
        roles: user.roles,
      })
    }
  }, [userResponse, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UserUpdateRequest) => userService.updateUser(userId, data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công')
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsEditing(false)
    },
    onError: (error: any) => {
      console.error(error)
      toast.error('Cập nhật thất bại: ' + (error?.response?.data?.message || 'Lỗi không xác định'))
    },
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.updateUserAvatarByAdmin(userId, file),
    onSuccess: () => {
      toast.success('Cập nhật ảnh đại diện thành công')
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error('Lỗi upload ảnh: ' + (error?.response?.data?.message || 'Có lỗi xảy ra'))
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File quá lớn. Vui lòng chọn ảnh < 5MB')
        return
      }
      updateAvatarMutation.mutate(file)
    }
  }

  const onSubmit = (data: UserUpdateRequest) => {
    const payload = {
      ...data,
      roles: Array.isArray(data.roles) ? data.roles : data.roles ? [data.roles] : [],
    }
    updateMutation.mutate(payload as UserUpdateRequest)
  }

  if (isLoading)
    return (
      <div className='flex h-[50vh] w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )

  if (isError || !userResponse?.data?.data)
    return (
      <div className='flex h-[50vh] flex-col items-center justify-center gap-4'>
        <AlertCircle className='h-12 w-12 text-destructive' />
        <p className='text-lg font-medium text-muted-foreground'>Không tìm thấy người dùng</p>
        <Button variant='outline' asChild>
          <Link href='/admin/users'>Quay lại danh sách</Link>
        </Button>
      </div>
    )

  const user = userResponse.data.data

  // --- View Mode UI ---
  if (!isEditing) {
    return (
      <div className='space-y-8 pb-10'>
        {/* Navigation & Actions */}
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            size='sm'
            asChild
            className='gap-1 pl-0 text-muted-foreground hover:text-foreground transition-colors'
          >
            <Link href='/admin/users'>
              <ChevronLeft className='h-4 w-4' /> Quay lại danh sách
            </Link>
          </Button>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsEditing(true)}
              className='shadow-sm hover:shadow-md transition-all'
            >
              <Edit className='mr-2 h-4 w-4' /> Chỉnh sửa
            </Button>
          </div>
        </div>

        {/* Hero Section - Clean & Impressive */}
        <div className='relative overflow-hidden rounded-3xl bg-white shadow-lg border border-slate-100'>
          {/* Decorative Background Pattern */}
          <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 opacity-80' />
          <div className='absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl' />
          <div className='absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-100/50 blur-3xl' />

          <div className='relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-10'>
            {/* Avatar with Ring & Shadow */}
            <div className='group relative'>
              <div className='h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white transition-transform duration-300 group-hover:scale-105'>
                {user.avatarUrl ? (
                  <img
                    src={getImageUrl(user.avatarUrl)}
                    alt={user.firstName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-slate-100 text-5xl font-bold text-slate-300'>
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div
                className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white ${
                  user.status === UserStatus.ACTIVE ? 'bg-green-500' : 'bg-slate-400'
                }`}
              />
            </div>

            {/* User Info & Stats */}
            <div className='flex-1 text-center md:text-left space-y-4'>
              <div>
                <div className='flex items-center justify-center md:justify-start gap-3 mb-2'>
                  <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900'>
                    {user.lastName} {user.firstName}
                  </h1>
                  <Badge
                    variant={user.status === UserStatus.ACTIVE ? 'default' : 'secondary'}
                    className={`px-3 py-1 text-sm font-semibold shadow-sm ${
                      user.status === UserStatus.ACTIVE
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {user.status}
                  </Badge>
                </div>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium'>
                  <span className='flex items-center gap-1.5'>
                    <div className='p-1.5 rounded-full bg-blue-50 text-blue-600'>
                      <Mail className='h-4 w-4' />
                    </div>
                    {user.email}
                  </span>
                  <span className='hidden md:inline text-slate-300'>|</span>
                  <span className='flex items-center gap-1.5'>
                    <div className='p-1.5 rounded-full bg-purple-50 text-purple-600'>
                      <Shield className='h-4 w-4' />
                    </div>
                    ID: #{user.id}
                  </span>
                </div>
              </div>

              {/* Roles */}
              <div className='flex flex-wrap justify-center md:justify-start gap-2 pt-2'>
                {user.roles &&
                  user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant='outline'
                      className='border-indigo-100 bg-indigo-50/50 text-indigo-700 px-3 py-1 hover:bg-indigo-100 transition-colors'
                    >
                      {role}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Card: Personal Info */}
          <div className='group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform'>
                <UserIcon className='h-6 w-6' />
              </div>
              <h3 className='font-bold text-lg text-slate-800'>Thông tin cá nhân</h3>
            </div>
            <div className='space-y-5'>
              <div className='flex justify-between items-center py-2 border-b border-slate-50 last:border-0'>
                <span className='text-sm text-slate-500'>Ngày sinh</span>
                <span className='font-medium text-slate-900'>
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN')
                    : '---'}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-slate-50 last:border-0'>
                <span className='text-sm text-slate-500'>Giới tính</span>
                <span className='font-medium text-slate-900'>
                  {user.gender === Gender.MALE
                    ? 'Nam'
                    : user.gender === Gender.FEMALE
                      ? 'Nữ'
                      : user.gender === Gender.OTHER
                        ? 'Khác'
                        : '---'}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-slate-50 last:border-0'>
                <span className='text-sm text-slate-500'>Điện thoại</span>
                <span className='font-medium text-slate-900'>{user.phone || '---'}</span>
              </div>
            </div>
          </div>

          {/* Card: Address */}
          <div className='group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform'>
                <MapPin className='h-6 w-6' />
              </div>
              <h3 className='font-bold text-lg text-slate-800'>Địa chỉ liên hệ</h3>
            </div>
            <div className='space-y-4'>
              <div className='bg-slate-50 p-4 rounded-xl border border-slate-100'>
                <span className='block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1'>
                  Thành phố
                </span>
                <span className='block font-medium text-slate-900 text-lg'>
                  {CITIES.find((c) => c.value === user.city)?.label || user.city || 'Chưa cập nhật'}
                </span>
              </div>
              <div className='bg-slate-50 p-4 rounded-xl border border-slate-100'>
                <span className='block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1'>
                  Địa chỉ chi tiết
                </span>
                <span className='block font-medium text-slate-900'>
                  {user.address || 'Chưa cập nhật địa chỉ'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: System Info */}
          <div className='group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2.5 rounded-xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition-transform'>
                <Clock className='h-6 w-6' />
              </div>
              <h3 className='font-bold text-lg text-slate-800'>Hoạt động</h3>
            </div>
            <div className='space-y-5'>
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm text-slate-500'>Đã tham gia</span>
                <div className='text-right'>
                  <span className='block font-bold text-slate-900'>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className='text-xs text-slate-400'>
                    {new Date(user.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <Separator className='bg-slate-100' />
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm text-slate-500'>Cập nhật gần nhất</span>
                <div className='text-right'>
                  <span className='block font-bold text-slate-900'>
                    {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className='text-xs text-slate-400'>
                    {new Date(user.updatedAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              {user.deletedAt && (
                <div className='mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4' />
                  Đã xóa vào: {new Date(user.deletedAt).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Edit Mode UI (Redesigned) ---
  return (
    <div className='pb-10'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setIsEditing(false)}
            className='h-10 w-10 rounded-full border-slate-200 bg-white hover:bg-slate-50'
          >
            <ChevronLeft className='h-5 w-5 text-slate-600' />
          </Button>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Chỉnh sửa thông tin
            </h1>
            <p className='text-slate-500 font-medium'>
              Cập nhật hồ sơ cho {user.lastName} {user.firstName}
            </p>
          </div>
        </div>
      </div>

      <div className='mb-8 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm'>
        <div className='relative group'>
          <div className='h-32 w-32 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden bg-slate-100'>
            {user.avatarUrl ? (
              <img
                src={getImageUrl(user.avatarUrl)}
                alt={user.firstName}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-slate-100 text-5xl font-bold text-slate-300'>
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <button
            type='button'
            onClick={() => avatarInputRef.current?.click()}
            disabled={updateAvatarMutation.isPending}
            className='absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed'
          >
            {updateAvatarMutation.isPending ? (
              <Loader2 className='h-8 w-8 text-white animate-spin' />
            ) : (
              <Camera className='h-8 w-8 text-white' />
            )}
          </button>

          {/* Status Badge Positioned absolutely */}
          <div
            className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${
              user.status === UserStatus.ACTIVE ? 'bg-green-500' : 'bg-slate-400'
            }`}
          />
        </div>

        <div className='text-center'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => avatarInputRef.current?.click()}
            disabled={updateAvatarMutation.isPending}
          >
            {updateAvatarMutation.isPending ? 'Đang tải lên...' : 'Thay đổi ảnh đại diện'}
          </Button>
          <p className='text-xs text-slate-400 mt-2'>Hỗ trợ: JPG, PNG, WEBP (Max 5MB)</p>
        </div>

        <input
          type='file'
          ref={avatarInputRef}
          className='hidden'
          accept='image/*'
          onChange={handleFileChange}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-8'>
          {/* Section 1: Thông tin định danh */}
          <Card className='border-none shadow-md overflow-hidden'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl flex items-center gap-2'>
                <UserIcon className='h-5 w-5 text-blue-500' /> Thông tin cơ bản
              </CardTitle>
              <CardDescription>Các thông tin định danh chính của người dùng.</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-6 md:grid-cols-2 pt-2'>
              <div className='space-y-2'>
                <Label htmlFor='lastName' className='text-slate-700'>
                  Họ & Tên đệm <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='lastName'
                  {...register('lastName', { required: 'Vui lòng nhập họ' })}
                  className='border-slate-200 focus-visible:ring-blue-500'
                  placeholder='Ví dụ: Nguyễn Văn'
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
                  {...register('firstName', { required: 'Vui lòng nhập tên' })}
                  className='border-slate-200 focus-visible:ring-blue-500'
                  placeholder='Ví dụ: A'
                />
                {errors.firstName && (
                  <p className='text-xs text-red-500 font-medium'>{errors.firstName.message}</p>
                )}
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='email' className='text-slate-700'>
                  Email đăng nhập
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
                  <Input
                    id='email'
                    {...register('email')}
                    disabled
                    className='pl-10 border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed'
                  />
                </div>
                <p className='text-xs text-muted-foreground'>Email không thể thay đổi</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Thông tin cá nhân & Liên hệ */}
          <Card className='border-none shadow-md overflow-hidden'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-green-500' /> Cá nhân & Liên hệ
              </CardTitle>
              <CardDescription>Thông tin liên lạc và địa chỉ giao hàng.</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-6 md:grid-cols-2 pt-2'>
              <div className='space-y-2'>
                <Label className='text-slate-700'>Giới tính</Label>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value as string}>
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
                  className='border-slate-200 focus-visible:ring-green-500'
                  placeholder='Số nhà, tên đường, phường/xã...'
                  {...register('address')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Phân quyền */}
          <Card className='border-none shadow-md overflow-hidden'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl flex items-center gap-2'>
                <Shield className='h-5 w-5 text-purple-500' /> Phân quyền hệ thống
              </CardTitle>
              <CardDescription>Cấp quyền truy cập cho người dùng này.</CardDescription>
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
                      className='text-sm font-medium cursor-pointer text-slate-700'
                    >
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className='flex items-center justify-end gap-4 pt-4'>
            <Button
              variant='ghost'
              type='button'
              onClick={() => setIsEditing(false)}
              className='text-slate-500 hover:text-slate-700'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={updateMutation.isPending}
              className='bg-slate-900 hover:bg-slate-800 text-white min-w-[140px] shadow-lg shadow-slate-200'
            >
              {updateMutation.isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Save className='mr-2 h-4 w-4' />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
