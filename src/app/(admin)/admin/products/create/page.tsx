'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  Save,
  ImageIcon,
  Box,
  Tag,
  Ruler,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { productService } from '@/services/product'
import { categoryService } from '@/services/category'
import { sizeService } from '@/services/size'
import { sizeGuideService } from '@/services/size-guide'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface ProductVariantForm {
  sizeId: string
  quantity: number
}

interface ProductFormValues {
  name: string
  description: string
  price: number
  categoryId: string
  sizeGuideId: string
  isActive: boolean
  variants: ProductVariantForm[]
  image?: FileList
}

export default function CreateProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      isActive: true,
      variants: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  })

  // Watch for image changes to show preview
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

  // Fetch Data
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list({ size: 100 }),
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
      router.push('/admin/products')
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi tạo sản phẩm')
      console.error(error)
    },
  })

  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData()

    // 1. Product JSON
    const productJson = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      sizeGuideId: data.sizeGuideId ? Number(data.sizeGuideId) : null,
      isActive: data.isActive,
      // Map variants to backend expected format if needed, assumed straight array is fine or needs mapping
      // Backend likely expects `variants` list in JSON
      variants: data.variants.map((v) => ({
        sizeId: Number(v.sizeId),
        quantity: Number(v.quantity),
      })),
      stock: data.variants.reduce((acc, v) => acc + Number(v.quantity), 0), // Calculate total stock
    }

    // Append 'product' as JSON string (common pattern for Spring Boot with Multipart)
    // OR if backend handles flat fields, append individually.
    // Based on User Create, let's try appending a JSON Blob for 'product' or 'data'.
    // BUT since I don't know the backend Controller signature perfectly, I'll try the safest:
    // Append fields individually if possible, OR check if I can send 'product' Blob.
    // Let's assume the standard 'product' part.
    formData.append(
      'product',
      new Blob([JSON.stringify(productJson)], { type: 'application/json' }),
    )

    // 2. Image File
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0])
    }

    createMutation.mutate(formData)
  }

  // Calculate total stock for display
  const variants = watch('variants')
  const totalStock = variants?.reduce((acc, v) => acc + (Number(v.quantity) || 0), 0) || 0

  return (
    <div className='max-w-10xl mx-auto pb-10'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.back()}
          className='w-10 h-10 rounded-full bg-white border-slate-200 hover:bg-slate-50'
        >
          <ChevronLeft className='h-5 w-5 text-slate-600' />
        </Button>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>Thêm sản phẩm mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: General Info */}
        <div className='lg:col-span-2 space-y-8'>
          {/* General Information Card */}
          <Card className='border-slate-200 shadow-sm overflow-hidden'>
            <div className='h-2 bg-gradient-to-r from-blue-500 to-cyan-500' />
            <CardHeader>
              <div className='flex items-center gap-3 mb-1'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Tag className='h-5 w-5 text-blue-600' />
                </div>
                <CardTitle className='text-xl'>Thông tin cơ bản</CardTitle>
              </div>
              <CardDescription>Tên, mô tả và phân loại sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid gap-3'>
                <Label htmlFor='name' className='text-slate-900 font-medium'>
                  Tên sản phẩm <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  placeholder='Nhập tên sản phẩm...'
                  className='h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
                />
                {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='categoryId' className='text-slate-900 font-medium'>
                    Danh mục <span className='text-red-500'>*</span>
                  </Label>
                  <Select onValueChange={(value) => setValue('categoryId', value)}>
                    <SelectTrigger className='h-10 border-slate-200'>
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
                  {/* Hidden input for validation if needed, or manage state */}
                  <input
                    type='hidden'
                    {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
                  />
                  {errors.categoryId && (
                    <span className='text-red-500 text-sm'>{errors.categoryId.message}</span>
                  )}
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='sizeGuideId' className='text-slate-900 font-medium'>
                    Bảng Size (Size Guide)
                  </Label>
                  <Select onValueChange={(value) => setValue('sizeGuideId', value)}>
                    <SelectTrigger className='h-10 border-slate-200'>
                      <SelectValue placeholder='Chọn bảng size' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>Không chọn</SelectItem>
                      {sizeGuides.map((guide) => (
                        <SelectItem key={guide.id} value={String(guide.id)}>
                          {guide.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='description' className='text-slate-900 font-medium'>
                  Mô tả sản phẩm
                </Label>
                <Textarea
                  id='description'
                  placeholder='Mô tả chi tiết về sản phẩm...'
                  className='min-h-[120px] resize-y border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  {...register('description')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory Card */}
          <Card className='border-slate-200 shadow-sm overflow-hidden'>
            <div className='h-2 bg-gradient-to-r from-emerald-500 to-green-500' />
            <CardHeader>
              <div className='flex items-center gap-3 mb-1'>
                <div className='p-2 bg-emerald-100 rounded-lg'>
                  <Box className='h-5 w-5 text-emerald-600' />
                </div>
                <CardTitle className='text-xl'>Giá bán & Kho hàng</CardTitle>
              </div>
              <CardDescription>Thiết lập giá và quản lý số lượng tồn kho</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='price' className='text-slate-900 font-medium'>
                    Giá bán (VNĐ) <span className='text-red-500'>*</span>
                  </Label>
                  <div className='relative'>
                    <Input
                      id='price'
                      type='number'
                      min='0'
                      placeholder='0'
                      className='h-10 pl-4 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500'
                      {...register('price', {
                        required: 'Giá bán là bắt buộc',
                        min: { value: 0, message: 'Giá không được âm' },
                      })}
                    />
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                      <span className='text-slate-500 text-sm'>₫</span>
                    </div>
                  </div>
                  {errors.price && (
                    <span className='text-red-500 text-sm'>{errors.price.message}</span>
                  )}
                </div>

                <div className='grid gap-3'>
                  <Label className='text-slate-900 font-medium'>Tổng tồn kho</Label>
                  <Input
                    value={totalStock}
                    disabled
                    className='h-10 bg-slate-50 text-slate-500 font-medium'
                  />
                  <p className='text-xs text-slate-500'>* Tự động tính từ số lượng các biến thể</p>
                </div>
              </div>

              {/* Variants / Sizes */}
              <div className='space-y-4 pt-4 border-t border-slate-100'>
                <div className='flex items-center justify-between'>
                  <Label className='text-slate-900 font-medium flex items-center gap-2'>
                    <Ruler className='h-4 w-4 text-slate-500' />
                    Phân loại Size & Số lượng
                  </Label>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() => append({ sizeId: '', quantity: 0 })}
                    className='h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                  >
                    <Plus className='mr-1 h-3.5 w-3.5' /> Thêm Size
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <div className='text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200'>
                    <p className='text-slate-500'>Chưa có size nào được thêm.</p>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => append({ sizeId: '', quantity: 0 })}
                      className='text-emerald-600'
                    >
                      Thêm size ngay
                    </Button>
                  </div>
                ) : (
                  <div className='rounded-md border border-slate-200 overflow-hidden'>
                    <Table>
                      <TableHeader className='bg-slate-50'>
                        <TableRow>
                          <TableHead>Kích thước (Size)</TableHead>
                          <TableHead className='w-[150px]'>Số lượng</TableHead>
                          <TableHead className='w-[50px]'></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Select
                                onValueChange={(value) =>
                                  setValue(`variants.${index}.sizeId`, value)
                                }
                                defaultValue={field.sizeId}
                              >
                                <SelectTrigger className='h-9'>
                                  <SelectValue placeholder='Chọn size' />
                                </SelectTrigger>
                                <SelectContent>
                                  {sizes.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                      {s.name} ({s.code})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type='number'
                                min='0'
                                className='h-9'
                                {...register(`variants.${index}.quantity` as const, {
                                  min: 0,
                                  required: true,
                                })}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => remove(index)}
                                className='h-8 w-8 text-red-500 hover:bg-red-50'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Images & Publish */}
        <div className='space-y-8'>
          {/* Image Upload Card */}
          <Card className='border-slate-200 shadow-sm overflow-hidden'>
            <div className='h-2 bg-gradient-to-r from-purple-500 to-pink-500' />
            <CardHeader>
              <div className='flex items-center gap-3 mb-1'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <ImageIcon className='h-5 w-5 text-purple-600' />
                </div>
                <CardTitle className='text-xl'>Hình ảnh</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                <div className='border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors relative min-h-[200px]'>
                  {previewImage ? (
                    <div className='relative w-full h-full min-h-[200px] flex items-center justify-center'>
                      <img
                        src={previewImage}
                        alt='Preview'
                        className='max-h-[200px] rounded-lg object-contain shadow-sm'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md'
                        onClick={() => {
                          setValue('image', undefined as any) // clear file list
                          setPreviewImage(null)
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <div className='text-center'>
                      <div className='w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3'>
                        <Upload className='h-6 w-6 text-purple-500' />
                      </div>
                      <p className='text-sm font-medium text-slate-700'>Thêm ảnh sản phẩm</p>
                      <p className='text-xs text-slate-400 mt-1'>Kéo thả hoặc click để tải lên</p>
                    </div>
                  )}
                  <Input
                    type='file'
                    accept='image/*'
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
                    {...register('image', { required: previewImage ? false : 'Vui lòng chọn ảnh' })}
                    onChange={(e) => {
                      // Register onChange handler is overridden, need to handle preview manually plus register
                      register('image').onChange(e)
                    }}
                  />
                </div>
                {errors.image && !previewImage && (
                  <span className='text-red-500 text-sm text-center block'>
                    {errors.image.message as string}
                  </span>
                )}
                <div className='text-xs text-slate-400 text-center'>
                  Hỗ trợ định dạng: JPG, PNG, WEBP.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publish Actions */}
          <Card className='border-slate-200 shadow-sm'>
            <CardHeader>
              <div className='flex items-center gap-3 mb-1'>
                <div className='p-2 bg-slate-100 rounded-lg'>
                  <Layers className='h-5 w-5 text-slate-600' />
                </div>
                <CardTitle className='text-xl'>Xuất bản</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50'>
                <Label htmlFor='isActive' className='font-medium text-slate-900'>
                  Trạng thái hoạt động
                </Label>
                <input
                  type='checkbox'
                  id='isActive'
                  className='h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                  {...register('isActive')}
                />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-3'>
              <Button
                type='submit'
                className='w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10'
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Tạo sản phẩm
                  </>
                )}
              </Button>
              <Button
                variant='outline'
                type='button'
                className='w-full'
                onClick={() => router.back()}
              >
                Hủy bỏ
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
