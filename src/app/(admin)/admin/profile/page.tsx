'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { userService } from '@/services/user'
import { User, UserUpdateRequest, UserUpdateProfileRequest } from '@/types/user'
import { AdminProfileSidebar } from '@/components/admin/admin-profile-sidebar'
import { ProfileForm } from '@/components/profile/profile-form'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { LoadingOverlay } from '@/components/common/loading-overlay'

export default function AdminProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchUser = async () => {
    try {
      const response = await userService.getMyInfo()
      if (response.data.success && response.data.data) {
        setUser(response.data.data)
      } else {
        toast.error('Failed to load user data')
      }
    } catch (error) {
      console.error('Fetch user error:', error)
      toast.error('Could not fetch user profile')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleUpdateProfile = async (data: UserUpdateRequest): Promise<boolean> => {
    if (!user) return false

    setIsUpdating(true)
    try {
      const payload: UserUpdateProfileRequest = {
        firstName: data.firstName || user.firstName || '',
        lastName: data.lastName || user.lastName || '',
        phone: data.phone,
        address: data.address,
        city: data.city as string,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender ? data.gender.toString() : undefined,
      }

      const response = await userService.updateMyInfo(payload)
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || 'Cập nhật hồ sơ thành công')
        setUser(response.data.data)
        return true
      } else {
        toast.error(response.data.message || 'Cập nhật hồ sơ thất bại')
        return false
      }
    } catch (error) {
      console.error('Update user error:', error)
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ')
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const response = await userService.updateMyAvatar(file)
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || 'Cập nhật ảnh đại diện thành công')
        setUser(response.data.data)
      } else {
        toast.error(response.data.message || 'Cập nhật ảnh đại diện thất bại')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('Có lỗi xảy ra khi tải ảnh lên')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <div className='w-full space-y-8 animate-in fade-in duration-500'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight text-slate-900'>Hồ sơ của tôi</h2>
        <p className='text-sm text-slate-500 font-medium'>
          Quản lý thông tin quản trị viên và thiết lập bảo mật.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
        {/* Left Sidebar */}
        <div className='md:col-span-4 lg:col-span-3'>
          <AdminProfileSidebar
            user={user}
            activeTab='account'
            onAvatarUpload={handleAvatarUpload}
            isUploading={isUploading}
          />
        </div>

        <div className='md:col-span-8 lg:col-span-9 space-y-6'>
          <ProfileForm user={user} onSubmit={handleUpdateProfile} isUpdating={isUpdating} />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
