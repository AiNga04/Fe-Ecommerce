import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ImagePlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface UploadButtonProps {
  onUpload: (files: File[]) => void
  isUploading?: boolean
  maxFiles?: number
  maxSizeMB?: number
}

export function UploadButton({
  onUpload,
  isUploading = false,
  maxFiles = 10,
  maxSizeMB = 5,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (files.length > maxFiles) {
      toast.error(`Bạn chỉ có thể chọn tối đa ${maxFiles} ảnh cùng lúc`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    const validFiles: File[] = []
    const invalidFormatFiles: string[] = []
    const invalidSizeFiles: string[] = []

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        invalidFormatFiles.push(file.name)
      } else if (file.size > maxSizeMB * 1024 * 1024) {
        invalidSizeFiles.push(file.name)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFormatFiles.length > 0) {
      toast.error(
        `Vui lòng chọn đúng định dạng ảnh. \nCác file lỗi: ${invalidFormatFiles.join(', ')}`,
      )
    }
    if (invalidSizeFiles.length > 0) {
      toast.error(
        `Dung lượng ảnh không được vượt quá ${maxSizeMB}MB. \nCác file lỗi: ${invalidSizeFiles.join(
          ', ',
        )}`,
      )
    }

    if (validFiles.length > 0) {
      onUpload(validFiles)
    }

    // Reset input so the same files can be selected again
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        type='file'
        ref={inputRef}
        onChange={handleFileChange}
        accept='image/jpeg,image/png,image/webp,image/gif'
        multiple
        className='hidden'
        disabled={isUploading}
      />
      <Button
        variant='outline'
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className='gap-2 bg-slate-50 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 shadow-sm transition-all h-10 px-4 rounded-md font-medium w-full sm:w-auto'
      >
        {isUploading ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin text-slate-500' />
            <span>Đang tải lên...</span>
          </>
        ) : (
          <>
            <ImagePlus className='w-4 h-4 text-slate-500' />
            <span>Thêm ảnh</span>
          </>
        )}
      </Button>
    </>
  )
}
