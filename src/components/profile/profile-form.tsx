'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, UserUpdateRequest } from '@/types/user'
import { Edit2, Save, X } from 'lucide-react'
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
      gender: values.gender,
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
    <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
          Thông tin tài khoản
        </h2>
        <Button
          variant={isEditing ? 'ghost' : 'outline'}
          size='sm'
          onClick={toggleEdit}
          disabled={isUpdating}
          className='gap-2'
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

      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='font-bold text-xs uppercase text-gray-500'>Họ</label>
              <Input
                placeholder='Nhập họ'
                {...form.register('lastName')}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50 border-none px-0 shadow-none' : ''}
              />
              {form.formState.errors.lastName && (
                <p className='text-sm text-red-500'>{form.formState.errors.lastName.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <label className='font-bold text-xs uppercase text-gray-500'>Tên</label>
              <Input
                placeholder='Nhập tên'
                {...form.register('firstName')}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50 border-none px-0 shadow-none' : ''}
              />
              {form.formState.errors.firstName && (
                <p className='text-sm text-red-500'>{form.formState.errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='font-bold text-xs uppercase text-gray-500'>Email</label>
            <Input
              placeholder='example@gmail.com'
              {...form.register('email')}
              disabled
              className='bg-gray-50 border-none px-0 shadow-none'
            />
          </div>

          <div className='space-y-2'>
            <label className='font-bold text-xs uppercase text-gray-500'>Số điện thoại</label>
            <Input
              placeholder='Chưa cập nhật'
              {...form.register('phone')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50 border-none px-0 shadow-none' : ''}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='font-bold text-xs uppercase text-gray-500'>Ngày sinh</label>
              <Input
                type={isEditing ? 'date' : 'text'}
                placeholder='Chưa cập nhật'
                {...form.register('dateOfBirth')}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50 border-none px-0 shadow-none' : ''}
              />
            </div>

            <div className='space-y-2'>
              <label className='font-bold text-xs uppercase text-gray-500'>Giới tính</label>
              {isEditing ? (
                <Select
                  onValueChange={(val) => form.setValue('gender', val)}
                  defaultValue={form.watch('gender')}
                >
                  <SelectTrigger className='w-full'>
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
                        : 'Khác'
                  }
                  disabled
                  className='bg-gray-50 border-none px-0 shadow-none'
                  placeholder='Chưa cập nhật'
                />
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='font-bold text-xs uppercase text-gray-500'>Địa chỉ</label>
            <Input
              placeholder='Chưa cập nhật'
              {...form.register('address')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50 border-none px-0 shadow-none' : ''}
            />
          </div>
          <div className='space-y-2'>
            <label className='font-bold text-xs uppercase text-gray-500'>Thành phố</label>
            {isEditing ? (
              <Select
                onValueChange={(val) => form.setValue('city', val)}
                defaultValue={form.watch('city')}
              >
                <SelectTrigger className='w-full'>
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
                className={!isEditing ? 'bg-gray-50 border-none px-0 shadow-none' : ''}
              />
            )}
          </div>
        </div>

        {isEditing && (
          <div className='flex gap-2 pt-2'>
            <Button
              type='submit'
              className='bg-black hover:bg-gray-800 text-white font-medium px-6 h-11 rounded-lg gap-2'
              disabled={isUpdating}
            >
              <Save className='w-4 h-4' />
              {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
            <Button type='button' variant='ghost' onClick={toggleEdit} className='h-11 rounded-lg'>
              Hủy
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
