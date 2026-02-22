import React, { useRef } from 'react'
import { Trash2, Edit2, Loader2, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/utils'
import { GalleryImage } from '@/types/product'
import { toast } from 'sonner'

interface ImageCardProps {
  image: GalleryImage
  isUpdating: boolean
  isDeleting: boolean
  onUpdate: (file: File) => void
  onDelete: () => void
}

export function ImageCard({ image, isUpdating, isDeleting, onUpdate, onDelete }: ImageCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isPending = isUpdating || isDeleting

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh hợp lệ.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dung lượng ảnh không được vượt quá 5MB')
      return
    }

    onUpdate(file)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className='relative aspect-square rounded-lg border bg-slate-50 overflow-hidden group'>
      {/* Loading Overlay */}
      {isPending && (
        <div className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-lg transition-all'>
          <Loader2 className='w-8 h-8 animate-spin text-slate-800' />
          <span className='text-xs font-medium text-slate-700 mt-2'>
            {isUpdating ? 'Đang cập nhật...' : 'Đang xóa...'}
          </span>
        </div>
      )}

      {/* Main Image */}
      {image.url ? (
        <img
          src={getImageUrl(image.url)}
          alt={`Gallery item ${image.id}`}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
            isPending ? 'blur-sm grayscale-30' : ''
          }`}
        />
      ) : (
        <div className='flex items-center justify-center h-full text-slate-300'>
          <ImageOff className='w-12 h-12' />
        </div>
      )}

      {/* Hover Overlay */}
      {!isPending && (
        <div className='absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center gap-3 rounded-lg'>
          {/* Hidden File Input for Update */}
          <input
            type='file'
            ref={inputRef}
            onChange={handleFileChange}
            accept='image/jpeg,image/png,image/webp,image/gif'
            className='hidden'
          />

          <Button
            size='icon'
            className='h-9 w-9 bg-white text-slate-700 hover:text-blue-600 hover:bg-white shadow-sm rounded-full'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              inputRef.current?.click()
            }}
            title='Thay đổi ảnh'
          >
            <Edit2 className='w-4 h-4' />
          </Button>

          <Button
            size='icon'
            variant='destructive'
            className='h-9 w-9 bg-red-600 text-white hover:bg-red-700 shadow-sm rounded-full'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
            title='Xóa ảnh'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  )
}
