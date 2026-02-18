'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, Loader2, MoreVertical } from 'lucide-react'
import { categoryService } from '@/services/category'
import { Category } from '@/types/product'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { CategoryDialog } from './components/category-dialog'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', page, pageSize],
    queryFn: () => categoryService.list({ page, size: pageSize }),
  })

  const categories = categoriesData?.data?.data || []
  const pagination = categoriesData?.data?.pagination

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setDeleteId(null)
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa danh mục')
    },
  })

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
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
          <h1 className='text-3xl font-bold tracking-tight'>Danh mục</h1>
          <p className='text-muted-foreground'>Quản lý danh mục sản phẩm của hệ thống</p>
        </div>
        <Button
          onClick={handleCreate}
          className='bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95'
        >
          <Plus className='mr-2 h-4 w-4' /> Thêm Danh Mục
        </Button>
      </div>

      <div className='flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input type='search' placeholder='Tìm kiếm danh mục...' className='pl-8' />
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>ID</TableHead>
              <TableHead>Mã</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className='h-32 text-center text-muted-foreground'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto mb-2' />
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-32 text-center text-muted-foreground'>
                  Chưa có danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>#{category.id}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className='font-mono'>
                      {category.code}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-semibold'>{category.name}</TableCell>
                  <TableCell
                    className='text-muted-foreground max-w-[300px] truncate'
                    title={category.description}
                  >
                    {category.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={category.isActive ? 'default' : 'secondary'}
                      className={
                        category.isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }
                    >
                      {category.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Menu</span>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Pencil className='mr-2 h-4 w-4' />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(category.id)}
                          className='text-red-600 focus:text-red-600 focus:bg-red-50'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className='flex items-center justify-end'>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-muted-foreground'>
              Trang {page + 1} / {pagination.totalPages || 1}
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
                      if (page < (pagination.totalPages || 1) - 1) setPage(page + 1)
                    }}
                    className={
                      page >= (pagination.totalPages || 1) - 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ ẩn danh mục khỏi hệ thống. Bạn có thể khôi phục lại sau nếu cần thiết
              (tùy thuộc vào chính sách hệ thống).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCallback}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa danh mục'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
