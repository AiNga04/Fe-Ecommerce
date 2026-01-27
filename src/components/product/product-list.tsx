'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Product, ProductSearchParams } from '@/types/product'
import { productService } from '@/services/product'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface ProductListProps {
  initialData?: Product[]
  initialPagination?: IPagination
}

export function ProductList({ initialData, initialPagination }: ProductListProps) {
  const [params, setParams] = useState<ProductSearchParams>({
    page: 0,
    size: initialPagination?.pageSize || 10,
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await productService.getProducts(params)
      return {
        data: res.data?.data,
        pagination: res.data?.pagination,
      }
    },
    initialData:
      params.page === 0 && initialData && initialPagination
        ? { data: initialData, pagination: initialPagination }
        : undefined,
  })

  // Destructure with default values
  const products = data?.data || []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages || 0
  const currentPage = pagination?.pageNumber || 0

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }

  if (isLoading) {
    return (
      <div className='flex justify-center p-12'>
        <Spinner className='size-8' />
      </div>
    )
  }

  if (isError) {
    return <div className='text-center text-red-500'>Đã có lỗi xảy ra khi tải sản phẩm.</div>
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-12 text-muted-foreground'>Không tìm thấy sản phẩm nào.</div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Simple Control */}
      {totalPages >= 1 && (
        <div className='flex justify-center gap-2 mt-8'>
          <Button
            variant='outline'
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trước
          </Button>
          <span className='flex items-center px-4 font-medium'>
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant='outline'
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}
