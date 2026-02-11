'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { productService } from '@/services/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/lib/utils'

export default function ProductsPage() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  })

  // productsData is AxiosResponse<IBackendRes<Product[]>>
  // productsData.data is IBackendRes<Product[]>
  // productsData.data.data is Product[]
  const products = productsData?.data?.data || []

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Sản phẩm</h1>
          <p className='text-muted-foreground'>Quản lý danh sách sản phẩm trong hệ thống</p>
        </div>
        <Button asChild>
          <Link href='/admin/products/create'>
            <Plus className='mr-2 h-4 w-4' /> Thêm mới
          </Link>
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input type='search' placeholder='Tìm kiếm sản phẩm...' className='pl-8' />
        </div>
        {/* Filters/Sort can go here */}
      </div>

      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Kho hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl ? (
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className='h-10 w-10 rounded-md object-cover'
                      />
                    ) : (
                      <div className='h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-xs text-gray-500'>
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isActive ? 'default' : 'secondary'}
                      className={product.isActive ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {product.isActive ? 'Hoạt động' : 'Ẩn'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='icon' asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit className='h-4 w-4' />
                        </Link>
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-500 hover:text-red-600 hover:bg-red-50'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination - to be implemented if API supports it */}
    </div>
  )
}
