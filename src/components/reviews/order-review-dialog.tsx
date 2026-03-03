'use client'

import React, { useState, useRef } from 'react'
import { toast } from 'sonner'
import { reviewService } from '@/services/review'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

import { ReviewResponse } from '@/types/review'

interface OrderReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: number
  productId: number
  productName: string
  existingReview?: ReviewResponse
  onReviewSuccess: () => void
}

export function OrderReviewDialog({
  open,
  onOpenChange,
  orderId,
  productId,
  productName,
  existingReview,
  onReviewSuccess,
}: OrderReviewDialogProps) {
  const [rating, setRating] = useState<number>(existingReview?.rating || 5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [content, setContent] = useState(existingReview?.content || '')
  // For simplicity when editing, we won't load old image blobs into File[],
  // we could let backend keep old images or require re-upload,
  // but standard usually just resets images or appends to old.
  // Let's reset images for editing for now to keep it simple, or user can re-upload.
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingReview?.images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      // Limit to 5 images max
      if (images.length + filesArray.length > 5) {
        toast.error('Chỉ được tải lên tối đa 5 ảnh')
        return
      }
      setImages((prev) => [...prev, ...filesArray])

      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá')
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append(
        'data',
        JSON.stringify({
          productId,
          orderId,
          rating,
          content: content.trim(),
        }),
      )

      images.forEach((image) => {
        formData.append('images', image)
      })

      let res
      if (existingReview) {
        // Exclude images array from JSON payload if we want backend to not override them automatically,
        // or just let backend handle updateReview logic.
        res = await reviewService.updateReview(existingReview.id, formData)
      } else {
        res = await reviewService.createReview(formData)
      }

      if (res.data.success) {
        toast.success('Đánh giá sản phẩm thành công!')
        onReviewSuccess()
        onOpenChange(false)
        // Reset form
        setRating(5)
        setContent('')
        setImages([])
        setPreviewUrls([])
      } else {
        toast.error(res.data.message || 'Đánh giá thất bại')
      }
    } catch (error: any) {
      console.error('Submit review error:', error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] bg-white'>
        <DialogHeader>
          <DialogTitle>{existingReview ? 'Sửa đánh giá' : 'Đánh giá sản phẩm'}</DialogTitle>
          <DialogDescription className='line-clamp-1'>{productName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 pt-4'>
          {/* Rating */}
          <div className='flex flex-col items-center gap-2'>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className='p-1 transition-transform hover:scale-110 focus:outline-none'
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-100 text-slate-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <span className='text-sm font-medium text-slate-600'>
              {rating === 1 && 'Rất tệ'}
              {rating === 2 && 'Tệ'}
              {rating === 3 && 'Bình thường'}
              {rating === 4 && 'Tốt'}
              {rating === 5 && 'Tuyệt vời'}
            </span>
          </div>

          {/* Content */}
          <div className='space-y-2'>
            <Label>Nhận xét chi tiết</Label>
            <Textarea
              placeholder='Hãy chia sẻ cảm nhận của bạn về chất lượng sản phẩm, form dáng, chất liệu...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='min-h-[100px] resize-none'
            />
          </div>

          {/* Images */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>Hình ảnh thực tế (Tối đa 5 ảnh)</Label>
              <span className='text-xs text-muted-foreground'>{images.length}/5</span>
            </div>

            <div className='flex flex-wrap gap-3'>
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className='relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group'
                >
                  <Image
                    src={url}
                    alt={`Preview ${index}`}
                    fill
                    className='object-cover'
                    unoptimized
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors bg-slate-50'
                >
                  <Upload className='w-5 h-5 mb-1' />
                  <span className='text-[10px] font-medium'>Thêm ảnh</span>
                </button>
              )}
            </div>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleImageChange}
              accept='image/jpeg,image/png,image/webp'
              multiple
              className='hidden'
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              className='bg-slate-900 hover:bg-slate-800 text-white'
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Đang lưu...
                </>
              ) : existingReview ? (
                'Lưu thay đổi'
              ) : (
                'Gửi đánh giá'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
