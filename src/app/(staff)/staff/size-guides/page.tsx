'use client'

import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2, Ruler } from 'lucide-react'
import { sizeGuideService } from '@/services/size-guide'
import { SizeGuide } from '@/types/product'
import { Input } from '@/components/ui/input'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getImageUrl } from '@/lib/utils'

export default function SizeGuidesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(9)

  const { data: sizeGuidesData, isLoading } = useQuery({
    queryKey: ['sizeGuides'],
    queryFn: () => sizeGuideService.getAll(),
  })

  const sizeGuides = sizeGuidesData?.data?.data || []

  const filteredGuides = useMemo(
    () =>
      sizeGuides.filter((guide: SizeGuide) =>
        guide.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [sizeGuides, searchTerm],
  )

  // Client-side pagination
  const totalPages = Math.ceil(filteredGuides.length / pageSize)
  const paginatedGuides = useMemo(
    () => filteredGuides.slice(page * pageSize, (page + 1) * pageSize),
    [filteredGuides, page, pageSize],
  )

  // Reset page when search/pageSize changes
  React.useEffect(() => {
    setPage(0)
  }, [searchTerm, pageSize])

  return (
    <div className='flex flex-col gap-6 relative pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Bảng Size</h1>
          <p className='text-muted-foreground'>
            Xem danh sách các bảng hướng dẫn chọn size cho sản phẩm
          </p>
        </div>
      </div>

      <div className='flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Tìm kiếm bảng size...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-slate-400' />
        </div>
      ) : paginatedGuides.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-lg border border-dashed'>
          <Ruler className='h-12 w-12 mx-auto text-slate-300 mb-4' />
          <h3 className='text-lg font-medium text-slate-900'>Chưa có bảng size nào</h3>
          <p className='text-slate-500 max-w-sm mx-auto mt-2'>
            Hệ thống hiện chưa có dữ liệu bảng size.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {paginatedGuides.map((guide: SizeGuide) => (
            <Card
              key={guide.id}
              className='overflow-hidden hover:shadow-md transition-shadow group'
            >
              <div className='aspect-[4/3] w-full bg-slate-50 relative overflow-hidden border-b'>
                {guide.imageUrl ? (
                  <img
                    src={getImageUrl(guide.imageUrl)}
                    alt={guide.name}
                    className='w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center h-full text-slate-300'>
                    <Ruler className='h-12 w-12' />
                  </div>
                )}
              </div>
              <CardHeader className='p-4'>
                <CardTitle className='text-base font-semibold truncate' title={guide.name}>
                  {guide.name}
                </CardTitle>
                <CardDescription className='line-clamp-2 text-xs h-9'>
                  {guide.description || 'Không có mô tả'}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Hiển thị</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[6, 9, 12].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>bảng size mỗi trang</span>
        </div>

        {totalPages > 0 && (
          <div className='flex items-center gap-4'>
            <div className='text-sm text-muted-foreground'>
              Trang {page + 1} / {totalPages}
            </div>
            <Pagination className='justify-end w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 0) setPage(page - 1)
                    }}
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < totalPages - 1) setPage(page + 1)
                    }}
                    className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
