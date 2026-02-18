'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Plus, Upload, X, Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { productService } from '@/services/product'
import { categoryService } from '@/services/category'
import { sizeService } from '@/services/size'
import { sizeGuideService } from '@/services/size-guide'
import { cn } from '@/lib/utils'

// Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Giá không được âm'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  sizeGuideId: z.string().optional(),
  sizeIds: z.array(z.number()).optional(),
  image: z.any().optional(), // FileList validation is tricky with z.any(), manual check is easier
})

type FormValues = z.infer<typeof formSchema>

interface CreateProductDialogProps {
  trigger?: React.ReactNode
}

export function CreateProductDialog({ trigger }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false)
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
    resolver: zodResolver(formSchema) as any, // Cast to any to avoid strict type mismatch with z.coerce
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

  // Watch for image changes
  const imageFileList = watch('image')
  useEffect(() => {
    if (imageFileList && imageFileList.length > 0) {
      const file = imageFileList[0]
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewImage(null)
    }
  }, [imageFileList])

  // Queries
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list({ size: 1000 }),
  })
  const categories = categoriesData?.data?.data || []

  const { data: sizesData } = useQuery({
    queryKey: ['sizes'],
    queryFn: () => sizeService.getAll(),
  })
  const sizes = sizesData?.data?.data || []

  const { data: sizeGuidesData } = useQuery({
    queryKey: ['sizeGuides'],
    queryFn: () => sizeGuideService.getAll(),
  })
  const sizeGuides = sizeGuidesData?.data?.data || []

  // Mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => productService.createProduct(data),
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setOpen(false)
      reset()
      setPreviewImage(null)
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi tạo sản phẩm')
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
    if (data.sizeGuideId) formData.append('sizeGuideId', data.sizeGuideId)

    // Handle Sizes (List<Long>) based on backend request: @RequestParam("sizeIds") List<Long> sizeIds
    // Standard way for Spring/Servlet to receive list via FormData is to append same key multiple times
    if (data.sizeIds && data.sizeIds.length > 0) {
      data.sizeIds.forEach((id) => {
        formData.append('sizeIds', String(id))
      })
    }

    // Image
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0])
    } else {
      toast.error('Vui lòng chọn ảnh sản phẩm')
      return
    }

    createMutation.mutate(formData)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className='gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:shadow-lg rounded-full px-6'>
            <Plus className='h-4 w-4' /> Thêm sản phẩm
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-hidden p-0 gap-0 bg-slate-50 border-none shadow-2xl rounded-2xl'>
        {/* Modern Header */}
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <Plus className='h-32 w-32 -mr-8 -mt-8' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
              Tạo Sản Phẩm Mới
            </DialogTitle>
            <DialogDescription className='text-slate-300 mt-1'>
              Điền thông tin chi tiết để thêm sản phẩm vào kho hàng của bạn.
            </DialogDescription>
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
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='h-8 w-8 rounded-full'
                            onClick={(e) => {
                              e.stopPropagation()
                              setValue('image', undefined)
                              setPreviewImage(null)
                            }}
                          >
                            <X className='h-4 w-4' />
                          </Button>
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
                          className='h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
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
                          className='h-10 border-slate-200 focus:border-purple-500 focus:ring-purple-500'
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
              onClick={() => setOpen(false)}
              className='h-11 px-8 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              className='h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang xử lý
                </>
              ) : (
                'Tạo sản phẩm'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
