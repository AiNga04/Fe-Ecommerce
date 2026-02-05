'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { productService } from '@/services/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// Textarea not available in ui lib, using native textarea
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

export default function CreateProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const createMutation = useMutation({
    mutationFn: (data: any) => productService.createProduct(data),
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

  const onSubmit = (data: any) => {
    // Convert price/stock to number
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      isActive: true, // Default active
    }
    createMutation.mutate(payload)
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='outline' size='icon' asChild>
          <Link href='/admin/products'>
            <ChevronLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-3xl font-bold tracking-tight'>Thêm sản phẩm mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Điền thông tin chi tiết về sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Tên sản phẩm</Label>
                <Input
                  id='name'
                  placeholder='Nhập tên sản phẩm'
                  {...register('name', { required: true })}
                />
                {errors.name && (
                  <span className='text-red-500 text-sm'>Vui lòng nhập tên sản phẩm</span>
                )}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='description'>Mô tả</Label>
                <textarea
                  id='description'
                  className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Mô tả sản phẩm...'
                  {...register('description')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giá & Kho hàng</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='price'>Giá bán</Label>
                <Input
                  id='price'
                  type='number'
                  placeholder='0'
                  {...register('price', { required: true, min: 0 })}
                />
                {errors.price && (
                  <span className='text-red-500 text-sm'>Vui lòng nhập giá hợp lệ</span>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='stock'>Số lượng trong kho</Label>
                <Input
                  id='stock'
                  type='number'
                  placeholder='0'
                  {...register('stock', { required: true, min: 0 })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân loại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2'>
                <Label htmlFor='category'>Danh mục</Label>
                <Input
                  id='category'
                  placeholder='Ví dụ: Áo thun, Quần jean...'
                  {...register('category', { required: true })}
                />
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end gap-4'>
            <Button variant='outline' type='button' onClick={() => router.back()}>
              Hủy bỏ
            </Button>
            <Button type='submit' disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Tạo sản phẩm
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
