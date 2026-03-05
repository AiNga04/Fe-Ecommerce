import React, { useState, useCallback } from 'react'
import { Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { toast } from 'sonner'

import { productService } from '@/services/product'
import { GalleryImage } from '@/types/product'
import { ImageCard } from './image-card'
import { UploadButton } from './upload-button'

interface GalleryManagerProps {
  productId: number | string
  initialGallery?: GalleryImage[]
}

export function GalleryManager({ productId, initialGallery = [] }: GalleryManagerProps) {
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery)
  const [isUploading, setIsUploading] = useState(false)

  // Track specific images being updated or deleted { [imageId]: boolean }
  const [updatingIds, setUpdatingIds] = useState<Record<number, boolean>>({})
  const [deletingIds, setDeletingIds] = useState<Record<number, boolean>>({})

  // Global delete all state
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)

  // Single Delete state
  const [imageToDelete, setImageToDelete] = useState<number | null>(null)

  // Handlers
  const handleUpload = async (files: File[]) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      files.forEach((file) => formData.append('images', file))

      const res = await productService.uploadGallery(productId, formData)
      if (res.data?.data) {
        setGallery((prev) => [...prev, ...(res.data?.data || [])])
        toast.success('Đã tải lên ảnh thành công')
      }
    } catch (error) {
      toast.error('Tải lên ảnh thất bại, vui lòng thử lại')
      console.error('Upload Error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdate = async (imageId: number, file: File) => {
    // Optimistic UI update
    const tempUrl = URL.createObjectURL(file)
    const originalImage = gallery.find((img) => img.id === imageId)

    setGallery((prev) => prev.map((img) => (img.id === imageId ? { ...img, url: tempUrl } : img)))
    setUpdatingIds((prev) => ({ ...prev, [imageId]: true }))

    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await productService.updateGalleryImage(productId, imageId, formData)

      if (res.data?.data) {
        const updatedImg = res.data.data
        // Confirm with server URL
        setGallery((prev) =>
          prev.map((img) => (img.id === imageId ? { ...img, url: updatedImg.url } : img)),
        )
        toast.success('Cập nhật ảnh thành công')
      }
    } catch (error) {
      // Rollback
      if (originalImage) {
        setGallery((prev) =>
          prev.map((img) => (img.id === imageId ? { ...img, url: originalImage.url } : img)),
        )
      }
      toast.error('Cập nhật thất bại')
      console.error('Update Error:', error)
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [imageId]: false }))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    setDeletingIds((prev) => ({ ...prev, [imageToDelete]: true }))
    setImageToDelete(null)

    try {
      await productService.deleteGalleryImage(productId, imageToDelete)
      setGallery((prev) => prev.filter((img) => img.id !== imageToDelete))
      toast.success('Đã xóa ảnh')
    } catch (error) {
      toast.error('Xóa ảnh thất bại')
      console.error('Delete Error:', error)
    } finally {
      setDeletingIds((prev) => ({ ...prev, [imageToDelete]: false }))
    }
  }

  const handleDeleteAllConfirm = async () => {
    setIsDeletingAll(true)
    setShowDeleteAllConfirm(false)

    try {
      await productService.deleteAllGalleryImages(productId)
      setGallery([])
      toast.success('Đã xóa toàn bộ thư viện ảnh')
    } catch (error) {
      toast.error('Xóa tất cả ảnh thất bại')
      console.error('Delete All Error:', error)
    } finally {
      setIsDeletingAll(false)
    }
  }

  return (
    <div className='bg-white rounded-lg border shadow-sm'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b gap-4'>
        <div>
          <h3 className='text-lg font-semibold flex items-center gap-2 text-slate-900'>
            <ImageIcon className='w-5 h-5 text-slate-500' />
            Thư viện ảnh ({gallery.length})
          </h3>
          <p className='text-sm text-slate-500 mt-1'>
            Quản lý và cập nhật hình ảnh chi tiết cho sản phẩm
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {gallery.length > 0 && (
            <Button
              variant='outline'
              className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm transition-colors h-10 px-4 rounded-md'
              onClick={() => setShowDeleteAllConfirm(true)}
              disabled={isDeletingAll || isUploading}
            >
              <Trash2 className='w-4 h-4 mr-2' />
              Xóa tất cả
            </Button>
          )}
          <UploadButton
            onUpload={handleUpload}
            isUploading={isUploading || isDeletingAll}
            maxFiles={10}
            maxSizeMB={5}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className='p-6 min-h-[200px]'>
        {gallery.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {gallery.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                isUpdating={!!updatingIds[img.id]}
                isDeleting={!!deletingIds[img.id] || isDeletingAll}
                onUpdate={(file) => handleUpdate(img.id, file)}
                onDelete={() => setImageToDelete(img.id)}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full py-16 px-4 bg-slate-50 rounded-lg border border-dashed text-slate-400'>
            <ImageIcon className='w-12 h-12 mb-3 text-slate-300' />
            <p className='text-sm text-center'>Chưa có ảnh nào trong thư viện.</p>
            <p className='text-xs text-center mt-1'>
              Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Delete Single Confirm */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa ảnh này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Ảnh sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700'
              onClick={handleDeleteConfirm}
            >
              Xóa Ảnh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirm */}
      <AlertDialog open={showDeleteAllConfirm} onOpenChange={setShowDeleteAllConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-red-600'>Xóa TOÀN BỘ thư viện ảnh?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xóa toàn bộ {gallery.length} ảnh của sản phẩm này. Hành động này không thể
              hoàn tác!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700'
              onClick={handleDeleteAllConfirm}
            >
              Tôi chắc chắn, Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
