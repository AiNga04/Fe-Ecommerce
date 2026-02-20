'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, MapPin, Trash2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { addressService } from '@/services/address'
import { userService } from '@/services/user'
import { Address, AddressRequest } from '@/types/address'
import { User } from '@/types/user'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { Button } from '@/components/ui/button'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { AddressFormDialog, AddressFormData } from '@/components/profile/address-form-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CITIES } from '@/constants/locations'

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete states
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    try {
      const [userRes, addressRes] = await Promise.all([
        userService.getMyInfo(),
        addressService.getMyAddresses(),
      ])

      if (userRes.data.success && userRes.data.data) {
        setUser(userRes.data.data)
      }

      if (addressRes.data.success && addressRes.data.data) {
        setAddresses(addressRes.data.data)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleAddAddress = () => {
    setEditingAddress(null)
    setIsDialogOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const response = await addressService.deleteAddress(deleteId)
      if (response.data.success) {
        toast.success(response.data.message || 'Xóa địa chỉ thành công')
        setAddresses((prev) => prev.filter((addr) => addr.id !== deleteId))
      } else {
        toast.error(response.data.message || 'Xóa địa chỉ thất bại')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa địa chỉ')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const response = await addressService.setDefault(id)
      if (response.data.success) {
        toast.success('Đã đặt làm địa chỉ mặc định')
        // Refresh list or manually update state
        // Manual update is faster: set all default=false, then set target default=true
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            default: addr.id === id,
          })),
        )
      } else {
        toast.error(response.data.message || 'Thất bại')
      }
    } catch (error) {
      toast.error('Lỗi khi đặt địa chỉ mặc định')
    }
  }

  const getProvinceLabel = (code: string) => {
    return CITIES.find((c) => c.value === code)?.label || code
  }

  const handleFormSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true)
    try {
      // Construct fullAddress: detail, ward, district, province
      // We need to resolve Province Label for full address? Or just use the value?
      // User payload example: "Thủ Đức, TP.HCM" (District, ProvinceLabel).
      // Let's format it: `${detail}, ${ward}, ${district}, ${provinceLabel}`
      const provinceLabel = getProvinceLabel(data.province)
      // Usually backend handles fullAddress construction, but user provided it in payload.
      // So let's construct it.
      const fullAddress = `${data.district}, ${provinceLabel}` // Following user example "Thủ Đức, TP.HCM" style approx.
      // Or cleaner: `${data.detailAddress}, ${data.ward}, ${data.district}, ${provinceLabel}`
      // User's example:
      // fullAddress: "Thủ Đức, TP.HCM" (Short)
      // detailAddress: "123/4 Nguyễn Thị Định"
      // ward: "Hiệp Bình Chánh"
      // Let's create a full descriptive string.
      const constructedFullAddress = `${data.detailAddress}, ${data.ward}, ${data.district}, ${provinceLabel}`

      const payload = {
        ...data,
        fullAddress: constructedFullAddress,
      }

      let response
      if (editingAddress) {
        response = await addressService.updateAddress(editingAddress.id, payload)
      } else {
        response = await addressService.createAddress(payload)
      }

      if (response.data.success) {
        toast.success(
          editingAddress ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ mới thành công',
        )
        setIsDialogOpen(false)
        // Reload addresses to be safe and get correct server-side data
        const addrRes = await addressService.getMyAddresses()
        if (addrRes.data.success && addrRes.data.data) {
          setAddresses(addrRes.data.data)
        }
      } else {
        toast.error(response.data.message || 'Thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <div className='container max-w-10xl mx-auto px-4 py-8 md:py-12'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8'>
        {/* Left Sidebar */}
        <div className='md:col-span-4 lg:col-span-3'>
          <ProfileSidebar
            user={user}
            activeTab='address'
            onAvatarUpload={handleAvatarUpload}
            isUploading={isUploading}
          />
        </div>

        {/* Right Content */}
        <div className='md:col-span-8 lg:col-span-9'>
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[500px] relative'>
            <div className='flex justify-between items-center mb-8'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <MapPin className='w-5 h-5' />
                Địa chỉ
              </h2>
              <Button
                size='icon'
                className='rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'
                onClick={handleAddAddress}
              >
                <Plus className='w-5 h-5' />
              </Button>
            </div>

            <div className='grid grid-cols-1 gap-4'>
              {addresses.map((addr, index) => (
                <div
                  key={addr.id}
                  className='border rounded-xl p-6 relative group hover:border-gray-400 transition-colors bg-white'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='font-bold text-gray-900 text-lg'>
                          {addr.id === 1 || addr.default
                            ? 'Địa chỉ mặc định'
                            : `Địa chỉ ${index + 1}`}
                        </h3>
                        {addr.default && (
                          <span className='bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1'>
                            <CheckCircle className='w-3 h-3' /> Default
                          </span>
                        )}
                      </div>

                      <div className='space-y-1 text-sm text-gray-600'>
                        <p>
                          <span className='font-semibold text-gray-900'>Người nhận:</span>{' '}
                          {addr.receiverName}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>SĐT:</span>{' '}
                          {addr.receiverPhone}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>Địa chỉ:</span>{' '}
                          {addr.detailAddress}, {addr.ward}
                        </p>
                        <p className='pl-[52px]'>
                          {addr.district}, {getProvinceLabel(addr.province)}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditAddress(addr)}
                          className='h-8 w-8 p-0'
                        >
                          <Edit2 className='w-3.5 h-3.5' />
                        </Button>
                        {!addr.default && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDeleteClick(addr.id)}
                            className='h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </Button>
                        )}
                      </div>
                      {!addr.default && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleSetDefault(addr.id)}
                          className='text-xs h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        >
                          Đặt làm mặc định
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {addresses.length === 0 && (
                <div className='text-center py-12 text-gray-500'>
                  Chưa có địa chỉ nào. Hãy thêm địa chỉ mới!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddressFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa địa chỉ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className='bg-red-500 hover:bg-red-600'
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
