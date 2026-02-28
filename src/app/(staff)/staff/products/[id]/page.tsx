'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getImageUrl } from '@/lib/utils'
import { Loader2, Package, Tag, ImageIcon, Ruler, ArrowLeft, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function StaffProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  })

  const product = productData?.data?.data

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh] gap-4 text-muted-foreground'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='flex flex-col items-center justify-center h-[50vh] gap-4 text-muted-foreground'>
        <Package className='w-12 h-12 text-slate-300' />
        <p>Không tìm thấy sản phẩm</p>
        <Button variant='outline' onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className='w-full mx-auto pb-10 space-y-6'>
      {/* Header Actions */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => router.back()}
            className='rounded-full w-10 h-10 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3'>
              {product.name}
              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                {product.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
              </Badge>
            </h1>
            <p className='text-sm text-muted-foreground'>Mã sản phẩm: #{product.id}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Column: Images & Key Info */}
        <div className='md:col-span-1 space-y-6'>
          <Card>
            <CardContent className='p-6'>
              <div className='aspect-square rounded-lg border overflow-hidden bg-slate-50 relative mb-4'>
                {product.imageUrl ? (
                  <img
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full text-slate-300'>
                    <ImageIcon className='w-12 h-12' />
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <div className='p-4 bg-slate-50 rounded-lg border'>
                  <span className='text-sm text-muted-foreground block mb-1'>Giá bán</span>
                  <span className='text-2xl font-bold text-primary'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      product.price,
                    )}
                  </span>
                </div>

                <div className='bg-white rounded-lg border p-4 space-y-3 text-sm'>
                  <div className='flex justify-between items-center py-2 border-b last:border-0'>
                    <span className='text-muted-foreground flex items-center gap-2'>
                      <Tag className='w-4 h-4' /> Danh mục
                    </span>
                    <span className='font-medium'>
                      {typeof product.category === 'object'
                        ? product.category?.name
                        : product.category}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b last:border-0'>
                    <span className='text-muted-foreground flex items-center gap-2'>
                      <Package className='w-4 h-4' /> Tồn kho
                    </span>
                    <span className='font-medium'>{product.stock}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b last:border-0'>
                    <span className='text-muted-foreground flex items-center gap-2'>
                      <Globe className='w-4 h-4' /> Xuất xứ
                    </span>
                    <span className='font-medium'>Việt Nam</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base font-semibold'>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className='text-sm space-y-3'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Ngày tạo</span>
                <span>
                  {product.createdAt
                    ? format(new Date(product.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                    : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Cập nhật lần cuối</span>
                <span>
                  {product.updatedAt
                    ? format(new Date(product.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className='md:col-span-2 space-y-6'>
          {/* Dimensions / Description */}
          <Card>
            <CardHeader>
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-slate-600 whitespace-pre-line leading-relaxed'>
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </p>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
              <CardTitle className='flex items-center gap-2'>
                <Package className='w-5 h-5' />
                Biến thể & Tồn kho
              </CardTitle>
              <AdjustProductStockDialog productId={Number(id)} variants={product.variants || []}>
                <Button
                  size='sm'
                  variant='outline'
                  className='gap-2 shrink-0 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                >
                  <Archive className='h-4 w-4' /> Điều chỉnh
                </Button>
              </AdjustProductStockDialog>
            </CardHeader>
            <CardContent>
              {product.variants && product.variants.length > 0 ? (
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader className='bg-slate-50'>
                      <TableRow>
                        <TableHead>Kích thước</TableHead>
                        <TableHead>Mã SKU</TableHead>
                        <TableHead className='text-right'>Số lượng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell className='font-medium'>{variant.sizeName}</TableCell>
                          <TableCell>
                            <Badge variant='outline'>{variant.sizeCode}</Badge>
                          </TableCell>
                          <TableCell className='text-right font-bold'>{variant.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className='text-center py-6 text-muted-foreground text-sm'>
                  Sản phẩm này chưa có biến thể nào.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Simple Gallery Display (Read-Only) */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-lg flex items-center gap-2'>
                <ImageIcon className='w-5 h-5' /> Bộ sưu tập ảnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.gallery && product.gallery.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                  {product.gallery.map((image) => (
                    <div
                      key={image.id}
                      className='group relative rounded-lg border bg-white shadow-sm overflow-hidden aspect-square'
                    >
                      <img
                        src={getImageUrl(image.url)}
                        alt='Gallery Image'
                        className='w-full h-full object-cover transition-transform group-hover:scale-105'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg bg-slate-50 text-slate-500'>
                  <ImageIcon className='w-8 h-8 mb-2 opacity-50' />
                  <p className='text-sm'>Chưa có hình ảnh nào</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Size Guide */}
          {product.sizeGuide && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Ruler className='w-5 h-5' />
                  Bảng quy đổi kích thước
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex gap-6 items-start'>
                  {product.sizeGuide.imageUrl && (
                    <div className='w-40 h-40 shrink-0 bg-white rounded-lg border p-2'>
                      <img
                        src={getImageUrl(product.sizeGuide.imageUrl)}
                        alt={product.sizeGuide.name}
                        className='w-full h-full object-contain'
                      />
                    </div>
                  )}
                  <div>
                    <h4 className='font-semibold text-lg text-slate-900'>
                      {product.sizeGuide.name}
                    </h4>
                    <p className='text-sm text-slate-500 mt-2'>{product.sizeGuide.description}</p>
                    <div className='mt-4'>
                      <Badge variant={product.sizeGuide.isActive ? 'outline' : 'secondary'}>
                        {product.sizeGuide.isActive ? 'Đang áp dụng' : 'Không hoạt động'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
