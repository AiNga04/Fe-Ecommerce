'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, UserUpdateRequest, Gender } from '@/types/user'
import { Edit2, Save, X, UserCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CITIES } from '@/constants/locations'

const profileSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().min(1, 'Vui lòng nhập họ'),
  displayName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
})

interface ProfileFormProps {
  user: User | null
  onSubmit: (data: UserUpdateRequest) => Promise<boolean> | void
  isUpdating: boolean
}

export function ProfileForm({ user, onSubmit, isUpdating }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
    },
  })

  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
      })
    }
  }, [user, form])

  const handleSubmit = async (values: z.infer<typeof profileSchema>) => {
    const updateData: UserUpdateRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      address: values.address,
      city: values.city,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender as Gender,
    }

    const result = await onSubmit(updateData)
    if (result === true) {
      setIsEditing(false)
    }
  }

  const toggleEdit = () => {
    if (isEditing) {
      form.reset()
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
      {/* Header */}
      <div className='px-6 md:px-8 py-5 flex justify-between items-center border-b border-slate-100'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100'>
            <UserCircle className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900'>Thông tin tài khoản</h2>
            <p className='text-xs text-muted-foreground'>Quản lý thông tin cá nhân của bạn</p>
          </div>
        </div>
        <Button
          variant={isEditing ? 'ghost' : 'outline'}
          size='sm'
          onClick={toggleEdit}
          disabled={isUpdating}
          className={`gap-2 transition-all ${
            isEditing ? 'text-slate-500 hover:text-slate-700' : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isEditing ? (
            <>
              <X className='w-4 h-4' /> Hủy
            </>
          ) : (
            <>
              <Edit2 className='w-4 h-4' /> Chỉnh sửa
            </>
          )}
        </Button>
      </div>

      {/* Form Body */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='px-6 md:px-8 py-6 space-y-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-1.5'>
              <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
                Họ
              </label>
              <Input
                placeholder='Nhập họ'
                {...form.register('lastName')}
                disabled={!isEditing}
                className={
                  !isEditing
                    ? 'bg-slate-50 border-transparent shadow-none text-slate-700'
                    : 'border-slate-200 focus:border-slate-400'
                }
              />
              {form.formState.errors.lastName && (
                <p className='text-xs text-red-500'>{form.formState.errors.lastName.message}</p>
              )}
            </div>

            <div className='space-y-1.5'>
              <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
                Tên
              </label>
              <Input
                placeholder='Nhập tên'
                {...form.register('firstName')}
                disabled={!isEditing}
                className={
                  !isEditing
                    ? 'bg-slate-50 border-transparent shadow-none text-slate-700'
                    : 'border-slate-200 focus:border-slate-400'
                }
              />
              {form.formState.errors.firstName && (
                <p className='text-xs text-red-500'>{form.formState.errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Email
            </label>
            <Input
              placeholder='example@gmail.com'
              {...form.register('email')}
              disabled
              className='bg-slate-50 border-transparent shadow-none text-slate-500'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Số điện thoại
            </label>
            <Input
              placeholder='Chưa cập nhật'
              {...form.register('phone')}
              disabled={!isEditing}
              className={
                !isEditing
                  ? 'bg-slate-50 border-transparent shadow-none text-slate-700'
                  : 'border-slate-200 focus:border-slate-400'
              }
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-1.5'>
              <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
                Ngày sinh
              </label>
              <Input
                type={isEditing ? 'date' : 'text'}
                placeholder='Chưa cập nhật'
                {...form.register('dateOfBirth')}
                disabled={!isEditing}
                className={
                  !isEditing
                    ? 'bg-slate-50 border-transparent shadow-none text-slate-700'
                    : 'border-slate-200 focus:border-slate-400'
                }
              />
            </div>

            <div className='space-y-1.5'>
              <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
                Giới tính
              </label>
              {isEditing ? (
                <Select
                  onValueChange={(val) => form.setValue('gender', val)}
                  defaultValue={form.watch('gender')}
                >
                  <SelectTrigger className='w-full border-slate-200'>
                    <SelectValue placeholder='Chọn giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MALE'>Nam</SelectItem>
                    <SelectItem value='FEMALE'>Nữ</SelectItem>
                    <SelectItem value='OTHER'>Khác</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={
                    form.watch('gender') === 'MALE'
                      ? 'Nam'
                      : form.watch('gender') === 'FEMALE'
                        ? 'Nữ'
                        : form.watch('gender') === 'OTHER'
                          ? 'Khác'
                          : ''
                  }
                  disabled
                  className='bg-slate-50 border-transparent shadow-none text-slate-700'
                  placeholder='Chưa cập nhật'
                />
              )}
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Địa chỉ
            </label>
            <Input
              placeholder='Chưa cập nhật'
              {...form.register('address')}
              disabled={!isEditing}
              className={
                !isEditing
                  ? 'bg-slate-50 border-transparent shadow-none text-slate-700'
                  : 'border-slate-200 focus:border-slate-400'
              }
            />
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-xs uppercase tracking-wider text-slate-400'>
              Thành phố
            </label>
            {isEditing ? (
              <Select
                onValueChange={(val) => form.setValue('city', val)}
                defaultValue={form.watch('city')}
              >
                <SelectTrigger className='w-full border-slate-200'>
                  <SelectValue placeholder='Chọn thành phố' />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder='Chưa cập nhật'
                value={
                  CITIES.find((c) => c.value === form.watch('city'))?.label ||
                  form.watch('city') ||
                  ''
                }
                disabled={!isEditing}
                className='bg-slate-50 border-transparent shadow-none text-slate-700'
              />
            )}
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className='px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3'>
            <Button
              type='submit'
              className='bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 h-10 rounded-2xl gap-2 shadow-sm'
              disabled={isUpdating}
            >
              <Save className='w-4 h-4' />
              {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={toggleEdit}
              className='h-10 rounded-2xl text-slate-500'
            >
              Hủy
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
