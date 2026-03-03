'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  User as UserIcon,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { userService } from '@/services/user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { UserStatus, Gender } from '@/types/user'
import { CITIES } from '@/constants/locations'
import { getImageUrl } from '@/lib/utils'

export default function StaffUserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const router = useRouter()

  const {
    data: userResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  })

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
        <Button variant='outline' onClick={() => router.back()}>
          Quay lại danh sách
        </Button>
      </div>
    )

  const user = userResponse.data.data

  return (
    <div className='w-full mx-auto pb-10 space-y-6'>
      {/* Header Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => router.back()}
            className='rounded-full w-10 h-10 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
          >
            <ChevronLeft className='w-5 h-5' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3'>
              {user.lastName} {user.firstName}
              <Badge
                variant={user.status === UserStatus.ACTIVE ? 'default' : 'secondary'}
                className={`px-2.5 py-0.5 text-xs font-semibold ${
                  user.status === UserStatus.ACTIVE
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {user.status}
              </Badge>
            </h1>
            <p className='text-sm text-muted-foreground flex items-center gap-2'>
              Mã người dùng: #{user.id}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Column: Avatar & Quick Info */}
        <div className='md:col-span-1 space-y-6'>
          <Card className='shadow-sm border-slate-200'>
            <CardContent className='p-6'>
              <div className='aspect-square rounded-lg border overflow-hidden bg-slate-50 relative mb-4'>
                {user.avatarUrl ? (
                  <img
                    src={getImageUrl(user.avatarUrl)}
                    alt={user.firstName}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full text-slate-300 bg-slate-100 text-6xl font-bold'>
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <div className='p-4 bg-slate-50 rounded-lg border text-center'>
                  <h3 className='font-bold text-lg text-slate-900'>
                    {user.lastName} {user.firstName}
                  </h3>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>

                  <div className='flex flex-wrap justify-center gap-2 mt-3'>
                    {user.roles &&
                      user.roles.map((role: string) => (
                        <Badge
                          key={role}
                          variant='outline'
                          className='border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100'
                        >
                          {role}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className='bg-white rounded-lg border border-slate-100 p-4 space-y-3 text-sm'>
                  <div className='flex justify-between items-center py-2 border-b border-slate-50 last:border-0'>
                    <span className='text-muted-foreground flex items-center gap-2 font-medium'>
                      <Phone className='w-4 h-4 text-slate-400' /> Điện thoại
                    </span>
                    <span className='font-semibold text-slate-700'>{user.phone || '---'}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-slate-50 last:border-0'>
                    <span className='text-muted-foreground flex items-center gap-2 font-medium'>
                      <UserIcon className='w-4 h-4 text-slate-400' /> Giới tính
                    </span>
                    <span className='font-semibold text-slate-700'>
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
                    <span className='text-muted-foreground flex items-center gap-2 font-medium'>
                      <Calendar className='w-4 h-4 text-slate-400' /> Ngày sinh
                    </span>
                    <span className='font-semibold text-slate-700'>
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN')
                        : '---'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-sm border-slate-200'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-bold flex items-center gap-2 text-slate-800'>
                <Clock className='w-4 h-4 text-slate-400' /> Thông tin hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm space-y-3'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Ngày tham gia</span>
                <span className='font-medium text-slate-700'>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Cập nhật lần cuối</span>
                <span className='font-medium text-slate-700'>
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Address & Details */}
        <div className='md:col-span-2 space-y-6'>
          {/* Address Info */}
          <Card className='shadow-sm border-slate-200'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-slate-800 font-bold'>
                <MapPin className='w-5 h-5 text-blue-500' /> Địa chỉ liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100'>
                  <Label className='text-[10px] uppercase text-slate-400 font-bold tracking-wider'>
                    Thành phố
                  </Label>
                  <p className='text-lg font-bold text-slate-800'>
                    {CITIES.find((c) => c.value === user.city)?.label ||
                      user.city ||
                      'Chưa cập nhật'}
                  </p>
                </div>
                <div className='space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100'>
                  <Label className='text-[10px] uppercase text-slate-400 font-bold tracking-wider'>
                    Địa chỉ chi tiết
                  </Label>
                  <p className='text-lg font-bold text-slate-800'>
                    {user.address || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Card className='bg-slate-50/50 border-dashed border-2 border-slate-200 shadow-none'>
              <CardContent className='p-8 flex flex-col items-center justify-center text-slate-400 text-sm h-40 text-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center'>
                  <Clock className='w-5 h-5 opacity-40' />
                </div>
                <span>Chưa có lịch sử đơn hàng</span>
              </CardContent>
            </Card>
            <Card className='bg-slate-50/50 border-dashed border-2 border-slate-200 shadow-none'>
              <CardContent className='p-8 flex flex-col items-center justify-center text-slate-400 text-sm h-40 text-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center'>
                  <UserIcon className='w-5 h-5 opacity-40' />
                </div>
                <span>Chưa có đánh giá nào</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
