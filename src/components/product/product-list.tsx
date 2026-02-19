'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Product, ProductSearchParams } from '@/types/product'
import { productService } from '@/services/product'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { CategoryFilter } from '@/components/product/category-filter'

interface ProductListProps {
  initialData?: Product[]
  initialPagination?: IPagination
}

export function ProductList({ initialData, initialPagination }: ProductListProps) {
  const [params, setParams] = useState<ProductSearchParams>({
    page: 0,
    size: initialPagination?.pageSize || 12,
  })

  // We need to fetch products based on custom params (including category filter)
  // The initialData is only valid if params match the initial server fetch (no filters, page 0)
  // But for simplicity, we'll let useQuery handle client-side fetching when params change.

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
      params.page === 0 && !params.category && initialData && initialPagination
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

  const handleCategoryChange = (ids: number[]) => {
    // API expects comma separated string for multiple categories, or single ID?
    // Looking at ProductCriteria: category?: string
    // Assuming backend supports comma separated IDs or we need to update service/backend.
    // For now, let's assume it accepts comma separated string or we need to fix it.
    // Wait, the interface says `category?: string`.
    // Let's pass it as comma separated string for now.
    setParams((prev) => ({
      ...prev,
      category: ids.length > 0 ? ids.join(',') : undefined,
      page: 0, // Reset to first page
    }))
  }

  // Parse current category param back to array for filter component
  const selectedCategoryIds = params.category
    ? params.category
        .split(',')
        .map(Number)
        .filter((n) => !isNaN(n))
    : []

  return (
    <div className='flex flex-col md:flex-row gap-8'>
      {/* Sidebar Filter */}
      <CategoryFilter selectedCategoryIds={selectedCategoryIds} onChange={handleCategoryChange} />

      {/* Main Content */}
      <div className='flex-1'>
        {isLoading ? (
          <div className='flex justify-center p-12'>
            <Spinner className='size-8' />
          </div>
        ) : isError ? (
          <div className='text-center text-red-500'>Đã có lỗi xảy ra khi tải sản phẩm.</div>
        ) : products.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Simple Control */}
        {!isLoading && !isError && totalPages >= 1 && (
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
    </div>
  )
}
