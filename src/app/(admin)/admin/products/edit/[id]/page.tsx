'use client'

import React, { useState, useEffect, use } from 'react'
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
  History,
  ImagePlus,
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
import { getImageUrl } from '@/lib/utils'

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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
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

  const { fields, append, remove, replace } = useFieldArray({
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

  // Fetch Product
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  })
  const product = productData?.data?.data

  // Fetch Price History
  const { data: priceHistoryData } = useQuery({
    queryKey: ['product-price-history', id],
    queryFn: () => productService.getPriceHistory(id),
    enabled: !!id,
  })
  const priceHistory = priceHistoryData?.data?.data || []

  // Populate Form
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        categoryId:
          typeof product.category === 'object'
            ? String(product.category.id)
            : categories.find((c) => c.name === product.category)?.id.toString() || '',
        sizeGuideId: product.sizeGuide ? String(product.sizeGuide.id) : '',
        isActive: product.isActive,
        variants:
          product.variants?.map((v) => ({
            sizeId: String(v.sizeId),
            quantity: v.quantity,
          })) || [],
      })
      if (product.imageUrl) {
        setPreviewImage(getImageUrl(product.imageUrl))
      }
    }
  }, [product, reset])

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => productService.updateProduct(id, data),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật')
      console.error(error)
    },
  })

  const uploadGalleryMutation = useMutation({
    mutationFn: (data: FormData) => productService.uploadGallery(id, data),
    onSuccess: () => {
      toast.success('Đã tải lên ảnh gallery')
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      setUploadingGallery(false)
    },
    onError: () => {
      toast.error('Lỗi khi tải ảnh gallery')
      setUploadingGallery(false)
    },
  })

  const deleteGalleryImageMutation = useMutation({
    mutationFn: (imageId: number) => productService.deleteGalleryImage(id, imageId),
    onSuccess: () => {
      toast.success('Đã xóa ảnh gallery')
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
    onError: () => toast.error('Lỗi khi xóa ảnh gallery'),
  })

  // Submit Handler
  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData()

    const productJson = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      sizeGuideId: data.sizeGuideId ? Number(data.sizeGuideId) : null,
      isActive: data.isActive,
      variants: data.variants.map((v) => ({
        sizeId: Number(v.sizeId),
        quantity: Number(v.quantity),
      })),
      stock: data.variants.reduce((acc, v) => acc + Number(v.quantity), 0),
    }

    formData.append(
      'product',
      new Blob([JSON.stringify(productJson)], { type: 'application/json' }),
    )

    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0])
    }

    updateMutation.mutate(formData)
  }

  // Gallery Handler
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingGallery(true)
      const formData = new FormData()
      Array.from(e.target.files).forEach((file) => {
        formData.append('files', file) // Backend usually expects 'files' or 'images'
      })
      // Let's assume 'images' based on typical logic, or 'files'
      // productService.uploadGallery wrapper uses 'data' FormData.
      // If backend expects specific key, I should have checked.
      // Usually 'files' or 'images'. I'll try 'images' as it's common for gallery.
      // Wait, I should check `GalleryController` if I could.
      // I will use 'files' as a default guess for "multiple files".
      // EDIT: standardizing to 'files'.

      // Re-creating formData with 'files' key
      const uploadData = new FormData()
      Array.from(e.target.files).forEach((file) => {
        uploadData.append('files', file)
      })

      uploadGalleryMutation.mutate(uploadData)
    }
  }

  const totalStock = watch('variants')?.reduce((acc, v) => acc + (Number(v.quantity) || 0), 0) || 0

  if (isLoadingProduct) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      </div>
    )
  }

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
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>Cập nhật sản phẩm</h1>
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
                  <Select
                    onValueChange={(value) => setValue('categoryId', value)}
                    value={watch('categoryId')}
                  >
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
                  <input
                    type='hidden'
                    {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
                  />
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='sizeGuideId' className='text-slate-900 font-medium'>
                    Bảng Size
                  </Label>
                  <Select
                    onValueChange={(value) => setValue('sizeGuideId', value)}
                    value={watch('sizeGuideId')}
                  >
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
                </div>

                <div className='grid gap-3'>
                  <Label className='text-slate-900 font-medium'>Tổng tồn kho</Label>
                  <Input
                    value={totalStock}
                    disabled
                    className='h-10 bg-slate-50 text-slate-500 font-medium'
                  />
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
                      {fields.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className='text-center text-slate-500 h-24'>
                            Chưa có biến thể nào. Thêm size để quản lý tồn kho.
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((field, index) => (
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price History (Optional) */}
          {priceHistory.length > 0 && (
            <Card className='border-slate-200 shadow-sm'>
              <CardHeader>
                <div className='flex items-center gap-3 mb-1'>
                  <div className='p-2 bg-slate-100 rounded-lg'>
                    <History className='h-5 w-5 text-slate-600' />
                  </div>
                  <CardTitle className='text-xl'>Lịch sử thay đổi giá</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {priceHistory.map((history: any, idx: number) => (
                    <div key={idx} className='flex items-center justify-between text-sm'>
                      <div>
                        <span className='text-slate-500 line-through mr-2'>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(history.oldPrice)}
                        </span>
                        <span className='font-medium text-slate-900'>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(history.newPrice)}
                        </span>
                      </div>
                      <div className='text-slate-400 text-xs'>
                        {history.changedAt
                          ? new Date(history.changedAt).toLocaleString('vi-VN')
                          : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                <CardTitle className='text-xl'>Ảnh đại diện</CardTitle>
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
                      {/* Only show clear button for new files, for existing URL maybe just replace by uploading new */}
                      <Input
                        type='file'
                        accept='image/*'
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                        {...register('image')}
                        onChange={(e) => register('image').onChange(e)}
                      />
                    </div>
                  ) : (
                    <div className='text-center'>
                      <Upload className='h-8 w-8 text-slate-300 mx-auto mb-2' />
                      <p className='text-sm text-slate-500'>Tải ảnh mới</p>
                      <Input
                        type='file'
                        accept='image/*'
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                        {...register('image')}
                        onChange={(e) => register('image').onChange(e)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Card */}
          <Card className='border-slate-200 shadow-sm overflow-hidden'>
            <div className='h-2 bg-gradient-to-r from-orange-400 to-red-400' />
            <CardHeader>
              <div className='flex items-center gap-3 mb-1'>
                <div className='p-2 bg-orange-100 rounded-lg'>
                  <ImagePlus className='h-5 w-5 text-orange-600' />
                </div>
                <CardTitle className='text-xl'>Thư viện ảnh</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                {product?.gallery?.map((img) => (
                  <div
                    key={img.id}
                    className='relative group aspect-square rounded-lg border border-slate-100 overflow-hidden'
                  >
                    <img
                      src={getImageUrl(img.url)}
                      alt='Gallery'
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => deleteGalleryImageMutation.mutate(img.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Button */}
                <div className='relative aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-colors flex flex-col items-center justify-center cursor-pointer'>
                  {uploadingGallery ? (
                    <Loader2 className='h-6 w-6 animate-spin text-orange-500' />
                  ) : (
                    <>
                      <Plus className='h-8 w-8 text-slate-300 mb-1' />
                      <span className='text-xs text-slate-500'>Thêm ảnh</span>
                      <input
                        type='file'
                        multiple
                        accept='image/*'
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                        onChange={handleGalleryUpload}
                      />
                    </>
                  )}
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
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Lưu thay đổi
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
