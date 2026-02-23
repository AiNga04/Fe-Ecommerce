'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, Loader2, SquareDashedMousePointer } from 'lucide-react'
import { sizeService } from '@/services/size'
import { Size } from '@/types/product'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SizeDialog } from './components/size-dialog'
import { toast } from 'sonner'

export default function SizesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  // Fetch all sizes
  const { data: sizesData, isLoading } = useQuery({
    queryKey: ['sizes'],
    queryFn: () => sizeService.getAll(),
  })

  // Data from API wrapper
  const sizes = sizesData?.data?.data || []

  // Client-side filtering
  const filteredSizes = useMemo(
    () =>
      sizes.filter(
        (size: Size) =>
          size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          size.code.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [sizes, searchTerm],
  )

  // Client-side pagination
  const totalPages = Math.ceil(filteredSizes.length / pageSize)
  const paginatedSizes = useMemo(
    () => filteredSizes.slice(page * pageSize, (page + 1) * pageSize),
    [filteredSizes, page, pageSize],
  )

  // Reset page when search changes
  React.useEffect(() => {
    setPage(0)
  }, [searchTerm, pageSize])

  const deleteMutation = useMutation({
    mutationFn: (id: number) => sizeService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa kích thước thành công')
      queryClient.invalidateQueries({ queryKey: ['sizes'] })
      setDeleteId(null)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa kích thước'
      toast.error(message)
    },
  })

  const handleEdit = (size: Size) => {
    setSelectedSize(size)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedSize(null)
    setIsDialogOpen(true)
  }

  const handleDeleteCallback = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  return (
    <div className='flex flex-col gap-6 relative pb-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Kích thước</h1>
          <p className='text-muted-foreground'>Quản lý danh sách kích thước sản phẩm (Size)</p>
        </div>
        <Button
          onClick={handleCreate}
          className='bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
        >
          <Plus className='h-4 w-4' /> Thêm Kích Thước
        </Button>
      </div>

      <div className='flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Tìm kiếm (Mã, Tên)...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>ID</TableHead>
              <TableHead>Mã (Code)</TableHead>
              <TableHead>Tên hiển thị</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto mb-2' />
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : paginatedSizes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-32 text-center text-muted-foreground'>
                  <div className='flex flex-col items-center justify-center'>
                    <SquareDashedMousePointer className='h-8 w-8 mb-2 opacity-20' />
                    <p>Chưa có kích thước nào.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSizes.map((size: Size) => (
                <TableRow key={size.id}>
                  <TableCell className='font-medium'>#{size.id}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className='font-mono bg-slate-50 text-slate-700'>
                      {size.code}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-semibold'>{size.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{size.description || '-'}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(size)}
                        className='h-8 w-8 text-slate-500 hover:text-blue-600'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setDeleteId(size.id)}
                        className='h-8 w-8 text-slate-500 hover:text-red-600'
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
              {[10, 20, 50].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>kích thước mỗi trang</span>
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

      <SizeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} size={selectedSize} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa kích thước này?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCallback}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
