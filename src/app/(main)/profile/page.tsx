'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { userService } from '@/services/user'
import { User, UserUpdateRequest, UserUpdateProfileRequest } from '@/types/user'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { ProfileForm } from '@/components/profile/profile-form'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { LoadingOverlay } from '@/components/common/loading-overlay'

export default function ProfilePage() {
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
        city: data.city as string, // Ensure compatibility
        dateOfBirth: data.dateOfBirth,
        gender: data.gender ? data.gender.toString() : undefined, // Ensure enum to string if needed or type matches
      }

      const response = await userService.updateMyInfo(payload)
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || 'Profile updated successfully')
        setUser(response.data.data)
        return true
      } else {
        toast.error(response.data.message || 'Failed to update profile')
        return false
      }
    } catch (error) {
      console.error('Update user error:', error)
      toast.error('An error occurred while updating profile')
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
        toast.success(response.data.message || 'Avatar updated successfully')
        setUser(response.data.data)
      } else {
        toast.error(response.data.message || 'Failed to update avatar')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('An error occurred while uploading avatar')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8 md:py-12'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8'>
        {/* Left Sidebar */}
        <div className='md:col-span-4 lg:col-span-3'>
          <ProfileSidebar
            user={user}
            activeTab='account'
            onAvatarUpload={handleAvatarUpload}
            isUploading={isUploading}
          />
        </div>

        {/* Right Content */}
        <div className='md:col-span-8 lg:col-span-9'>
          <ProfileForm user={user} onSubmit={handleUpdateProfile} isUpdating={isUpdating} />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
