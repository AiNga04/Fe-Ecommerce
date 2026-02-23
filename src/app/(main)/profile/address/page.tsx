'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, MapPin, Trash2, CheckCircle, MapPinned, Phone, User } from 'lucide-react'
import { toast } from 'sonner'
import { addressService } from '@/services/address'
import { userService } from '@/services/user'
import { Address, AddressRequest } from '@/types/address'
import { User as UserType } from '@/types/user'
import { ProfileSidebar } from '@/components/profile/profile-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const [user, setUser] = useState<UserType | null>(null)
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
      const provinceLabel = getProvinceLabel(data.province)
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
          <div className='bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
            {/* Header */}
            <div className='px-6 md:px-8 py-5 flex justify-between items-center border-b border-slate-100'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100'>
                  <MapPin className='w-5 h-5 text-emerald-600' />
                </div>
                <div>
                  <h2 className='text-lg font-bold text-slate-900'>Sổ địa chỉ</h2>
                  <p className='text-xs text-muted-foreground'>
                    {addresses.length > 0
                      ? `${addresses.length} địa chỉ đã lưu`
                      : 'Quản lý địa chỉ giao hàng'}
                  </p>
                </div>
              </div>
              <Button
                size='sm'
                onClick={handleAddAddress}
                className='gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              >
                <Plus className='w-4 h-4' /> Thêm mới
              </Button>
            </div>

            {/* Content */}
            <div className='p-6 md:p-8'>
              {addresses.length === 0 ? (
                <div className='text-center py-16 px-4'>
                  <div className='bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100'>
                    <MapPinned className='w-10 h-10 text-slate-300' />
                  </div>
                  <h3 className='text-lg font-semibold text-slate-900 mb-2'>Chưa có địa chỉ nào</h3>
                  <p className='text-muted-foreground text-sm mb-4'>
                    Hãy thêm địa chỉ giao hàng để đặt hàng nhanh hơn.
                  </p>
                  <Button variant='outline' onClick={handleAddAddress} className='gap-2'>
                    <Plus className='w-4 h-4' /> Thêm địa chỉ đầu tiên
                  </Button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {addresses.map((addr, index) => (
                    <div
                      key={addr.id}
                      className={`border rounded-xl p-5 relative group transition-all duration-200 hover:shadow-md ${
                        addr.default
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className='flex justify-between items-start gap-4'>
                        <div className='flex-1 min-w-0'>
                          {/* Title + Badge */}
                          <div className='flex items-center gap-2.5 mb-3'>
                            <h3 className='font-semibold text-slate-900'>
                              {addr.default ? 'Địa chỉ mặc định' : `Địa chỉ ${index + 1}`}
                            </h3>
                            {addr.default && (
                              <Badge
                                variant='outline'
                                className='bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold gap-1'
                              >
                                <CheckCircle className='w-3 h-3' /> Mặc định
                              </Badge>
                            )}
                          </div>

                          {/* Info Grid */}
                          <div className='space-y-2 text-sm'>
                            <div className='flex items-center gap-2 text-slate-700'>
                              <User className='w-3.5 h-3.5 text-slate-400 flex-shrink-0' />
                              <span className='font-medium'>{addr.receiverName}</span>
                            </div>
                            <div className='flex items-center gap-2 text-slate-600'>
                              <Phone className='w-3.5 h-3.5 text-slate-400 flex-shrink-0' />
                              <span>{addr.receiverPhone}</span>
                            </div>
                            <div className='flex items-start gap-2 text-slate-600'>
                              <MapPin className='w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5' />
                              <span>
                                {addr.detailAddress}, {addr.ward}, {addr.district},{' '}
                                {getProvinceLabel(addr.province)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className='flex flex-col items-end gap-2 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
                          <div className='flex gap-1.5'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEditAddress(addr)}
                              className='h-8 w-8 p-0 border-slate-200 hover:bg-slate-50'
                            >
                              <Edit2 className='w-3.5 h-3.5 text-slate-600' />
                            </Button>
                            {!addr.default && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleDeleteClick(addr.id)}
                                className='h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-slate-200'
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
                              className='text-[11px] h-7 px-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium'
                            >
                              Đặt mặc định
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
