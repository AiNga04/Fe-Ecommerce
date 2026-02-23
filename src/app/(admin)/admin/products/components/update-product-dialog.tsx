'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Loader2, Upload, X, ChevronsUpDown, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { productService } from '@/services/product'
import { categoryService } from '@/services/category'
import { sizeService } from '@/services/size'
import { sizeGuideService } from '@/services/size-guide'
import { Product } from '@/types/product'
import { getImageUrl } from '@/lib/utils'

// Zod Schema (Similar to Create, but image is optional)
const formSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Giá không được âm'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  sizeGuideId: z.string().optional(),
  sizeIds: z.array(z.number()).optional(),
  image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface UpdateProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateProductDialog({ product, open, onOpenChange }: UpdateProductDialogProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      sizeGuideId: '',
      sizeIds: [],
      image: undefined,
    },
  })

  // Initialize form when product changes
  useEffect(() => {
    if (product && open) {
      setValue('name', product.name)
      setValue('description', product.description || '')
      setValue('price', product.price)

      // Handle Category
      const catId = typeof product.category === 'object' ? String(product.category?.id) : '' // If string, we might not have ID easily unless we match name, but typically it returns object in detail/list if populated.
      // If it's a string, we might need to rely on the backend sending distinct ID or handle it.
      // Based on previous files, list returns object.

      setValue('categoryId', catId)

      // Handle Size Guide
      setValue('sizeGuideId', product.sizeGuide?.id ? String(product.sizeGuide.id) : '')

      // Handle Sizes
      const currentSizeIds = product.variants?.map((v) => v.sizeId) || []
      setValue('sizeIds', currentSizeIds)

      // Handle Image
      if (product.imageUrl) {
        setPreviewImage(getImageUrl(product.imageUrl))
      } else {
        setPreviewImage(null)
      }
      setValue('image', undefined) // Reset file input
    }
  }, [product, open, setValue])

  // Watch for new image selection
  const imageFileList = watch('image')
  useEffect(() => {
    if (imageFileList && imageFileList.length > 0) {
      const file = imageFileList[0]
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageFileList])

  // Queries
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list({ size: 1000 }),
    enabled: open,
  })
  const categories = categoriesData?.data?.data || []

  const { data: sizesData } = useQuery({
    queryKey: ['sizes'],
    queryFn: () => sizeService.getAll(),
    enabled: open,
  })
  const sizes = sizesData?.data?.data || []

  const { data: sizeGuidesData } = useQuery({
    queryKey: ['sizeGuides'],
    queryFn: () => sizeGuideService.getAll(),
    enabled: open,
  })
  const sizeGuides = sizeGuidesData?.data?.data || []

  // Mutation
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!product) throw new Error('No product selected')
      return productService.updateProduct(product.id, data)
    },
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      if (product) {
        queryClient.invalidateQueries({ queryKey: ['product', product.id] })
      }
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm')
      console.error(error)
    },
  })

  // Submit Handler
  const onSubmit = (data: FormValues) => {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    formData.append('price', String(data.price))
    formData.append('categoryId', data.categoryId)

    // Size Guide
    // Fixed: Handle empty/unselected size guide
    if (data.sizeGuideId && data.sizeGuideId !== '' && data.sizeGuideId !== '_undefined') {
      formData.append('sizeGuideId', data.sizeGuideId)
    }

    // Sizes
    if (data.sizeIds) {
      // Always send sizeIds, even empty list if we want to clear?
      // Backend logic: "currentSizes.removeIf", "Add new sizes".
      // If we send empty list, loop won't run, but removeIf might?
      // Backend: Set<Long> newSizeIdsSet = new HashSet<>(sizeIds);
      // If sizeIds is empty, newSizeIdsSet is empty. removeIf will remove all!
      // So yes, we should send it.
      data.sizeIds.forEach((id) => {
        formData.append('sizeIds', String(id))
      })
    }

    // Image
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0])
    }

    updateMutation.mutate(formData)
  }

  // Selected Sizes Management
  const selectedSizeIds = watch('sizeIds') || []
  const toggleSize = (id: number) => {
    const current = selectedSizeIds
    if (current.includes(id)) {
      setValue(
        'sizeIds',
        current.filter((item) => item !== id),
      )
    } else {
      setValue('sizeIds', [...current, id])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-hidden p-0 gap-0 bg-slate-50 border-none shadow-2xl rounded-2xl'>
        {/* Modern Header */}
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <Pencil className='h-32 w-32 -mr-8 -mt-8' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
              Cập Nhật Sản Phẩm
            </DialogTitle>
            <div className='flex items-center gap-2 mt-1'>
              <span className='bg-slate-800 text-xs px-2 py-0.5 rounded text-slate-300 font-mono'>
                ID: {product?.id}
              </span>
              <DialogDescription className='text-slate-300'>
                Chỉnh sửa thông tin chi tiết của sản phẩm.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col h-full max-h-[calc(90vh-100px)]'
        >
          <ScrollArea className='flex-1 p-6'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
              {/* Left Column: Image Upload */}
              <div className='md:col-span-4 space-y-4'>
                <div className='bg-white p-4 rounded-xl shadow-sm border border-slate-100'>
                  <Label className='text-base font-semibold mb-3 block'>Ảnh sản phẩm</Label>
                  <div className='relative w-full aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-slate-50 group'>
                    {previewImage ? (
                      <>
                        <img
                          src={previewImage}
                          alt='Preview'
                          className='w-full h-full object-cover transition-transform group-hover:scale-105 duration-500'
                        />
                        {/* Only show "remove" if it's a new file? Or allow removing existing image? 
                             Backend logic: if image != null -> replace.
                             We don't strictly have a "delete image" endpoint in this flow, usually just replace.
                             But we can allow clearing the selection of NEW image to revert to OLD image?
                             For now, let's keep it simple: Upload to replace.
                         */}
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                          <div className='text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full'>
                            Nhấn để thay đổi
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors'>
                        <div className='p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform'>
                          <Upload className='h-6 w-6' />
                        </div>
                        <span className='text-xs font-medium'>Tải ảnh lên</span>
                      </div>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      {...register('image')}
                      onChange={(e) => {
                        register('image').onChange(e)
                      }}
                    />
                  </div>
                  <p className='text-[0.7rem] text-muted-foreground text-center mt-2'>
                    Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.
                  </p>
                </div>
              </div>

              {/* Right Column: Input Fields */}
              <div className='md:col-span-8 space-y-6'>
                <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4'>
                  <h3 className='font-semibold text-slate-900 flex items-center gap-2 mb-4'>
                    <span className='h-6 w-1 bg-blue-500 rounded-full'></span>
                    Thông tin cơ bản
                  </h3>
                  <div className='grid gap-2'>
                    <Label htmlFor='name' className='text-slate-700'>
                      Tên sản phẩm <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='name'
                      placeholder='VD: Áo Thun Cotton Premium'
                      {...register('name')}
                      className='h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                    />
                    {errors.name && (
                      <span className='text-red-500 text-xs'>{errors.name.message}</span>
                    )}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='category' className='text-slate-700'>
                        Danh mục <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        onValueChange={(val) => setValue('categoryId', val)}
                        value={watch('categoryId')}
                      >
                        <SelectTrigger
                          id='category'
                          className='w-full h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                        >
                          <SelectValue placeholder='Chọn danh mục' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type='hidden' {...register('categoryId')} />
                      {errors.categoryId && (
                        <span className='text-red-500 text-xs'>{errors.categoryId.message}</span>
                      )}
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='price' className='text-slate-700'>
                        Giá bán <span className='text-red-500'>*</span>
                      </Label>
                      <div className='relative'>
                        <Input
                          id='price'
                          type='number'
                          min='0'
                          className='pl-8 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                          placeholder='0'
                          {...register('price')}
                        />
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium'>
                          ₫
                        </span>
                      </div>
                      {errors.price && (
                        <span className='text-red-500 text-xs'>{errors.price.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4'>
                  <h3 className='font-semibold text-slate-900 flex items-center gap-2 mb-4'>
                    <span className='h-6 w-1 bg-purple-500 rounded-full'></span>
                    Thuộc tính & Mô tả
                  </h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-2'>
                      <Label className='text-slate-700'>Size (Kích thước)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            className='justify-between font-normal h-10 border-slate-200 focus:border-purple-500 focus:ring-purple-500 hover:bg-slate-50'
                          >
                            {selectedSizeIds.length > 0
                              ? `${selectedSizeIds.length} size đã chọn`
                              : 'Chọn size (Tùy chọn)'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[250px] p-0' align='start'>
                          <ScrollArea className='h-[200px] p-2'>
                            {sizes.length === 0 ? (
                              <div className='text-sm text-center py-4 text-muted-foreground'>
                                Chưa có size nào
                              </div>
                            ) : (
                              sizes.map((size) => (
                                <div
                                  key={size.id}
                                  className='flex items-center space-x-2 py-2 px-1 hover:bg-slate-50 rounded cursor-pointer transition-colors'
                                  onClick={() => toggleSize(size.id)}
                                >
                                  <Checkbox
                                    id={`size-${size.id}`}
                                    checked={selectedSizeIds.includes(size.id)}
                                    onCheckedChange={() => toggleSize(size.id)}
                                    className='data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600'
                                  />
                                  <Label
                                    htmlFor={`size-${size.id}`}
                                    className='flex-1 cursor-pointer font-normal'
                                  >
                                    {size.name}{' '}
                                    <span className='text-muted-foreground text-xs'>
                                      ({size.code})
                                    </span>
                                  </Label>
                                </div>
                              ))
                            )}
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='sizeGuide' className='text-slate-700'>
                        Bảng Size
                      </Label>
                      <Select
                        onValueChange={(val) => {
                          const finalVal = val === '_undefined' ? '' : val
                          setValue('sizeGuideId', finalVal)
                        }}
                        value={watch('sizeGuideId') || '_undefined'}
                      >
                        <SelectTrigger
                          id='sizeGuide'
                          className='w-full h-10 border-slate-200 focus:border-purple-500 focus:ring-purple-500'
                        >
                          <SelectValue placeholder='Chọn bảng size' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='_undefined'>Không chọn</SelectItem>
                          {sizeGuides.map((guide) => (
                            <SelectItem key={guide.id} value={String(guide.id)}>
                              {guide.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='description' className='text-slate-700'>
                      Mô tả
                    </Label>
                    <Textarea
                      id='description'
                      placeholder='Mô tả chi tiết về sản phẩm...'
                      className='resize-none h-[100px] border-slate-200 focus:border-purple-500 focus:ring-purple-500'
                      {...register('description')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className='p-6 bg-slate-50 border-t border-slate-100 gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='h-11 px-8 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              className='h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang lưu
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
