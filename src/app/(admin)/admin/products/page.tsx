'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCcw,
  MoreHorizontal,
  Filter,
  Eye,
  ArrowLeft,
  PlusCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { productService } from '@/services/product'
import { categoryService } from '@/services/category'
import { Checkbox } from '@/components/ui/checkbox'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { getImageUrl, cn } from '@/lib/utils'
import { BulkActionBar } from '../components/bulk-action-bar'
import { CreateProductDialog } from './components/create-product-dialog'
import { UpdateProductDialog } from './components/update-product-dialog'
import { Product } from '@/types/product'

export default function ProductsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // Update Dialog State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset page when filters change
  React.useEffect(() => {
    setPage(0)
  }, [activeTab, debouncedSearch, categoryFilter, pageSize])

  // Fetch Categories for Filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list({ size: 1000 }),
  })
  const categories = categoriesData?.data?.data || []

  // Fetch Products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', activeTab, page, pageSize, debouncedSearch, categoryFilter],
    queryFn: () => {
      const params = {
        page,
        size: pageSize,
        name: debouncedSearch || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      }
      return activeTab === 'active'
        ? productService.getProducts(params)
        : productService.getDeletedProducts(params)
    },
  })

  // Clear selection when data changes
  React.useEffect(() => {
    setSelectedIds(new Set())
  }, [activeTab, page, pageSize, debouncedSearch, categoryFilter])

  const products = productsData?.data?.data || []
  const pagination = productsData?.data?.pagination

  // --- Selection Handlers ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = products.map((p) => p.id)
      setSelectedIds(new Set(allIds))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const isAllSelected = products.length > 0 && selectedIds.size === products.length

  // --- Mutations ---
  const softDeleteMutation = useMutation({
    mutationFn: (id: number) => productService.softDeleteProduct(id),
    onSuccess: () => {
      toast.success('Đã chuyển sản phẩm vào thùng rác')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Lỗi khi xóa sản phẩm'),
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => productService.restoreProduct(id),
    onSuccess: () => {
      toast.success('Đã khôi phục sản phẩm')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Lỗi khi khôi phục sản phẩm'),
  })

  const hardDeleteMutation = useMutation({
    mutationFn: (id: number) => productService.hardDeleteProduct(id),
    onSuccess: () => {
      toast.success('Đã xóa vĩnh viễn sản phẩm')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Lỗi khi xóa vĩnh viễn sản phẩm'),
  })

  // --- Batch Mutations ---
  const batchSoftDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => productService.softDeleteProducts(ids),
    onSuccess: (data) => {
      toast.success(`Đã chuyển ${data.data?.data?.length || 0} sản phẩm vào thùng rác`)
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Lỗi khi xóa sản phẩm hàng loạt'),
  })

  const batchRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => productService.restoreProducts(ids),
    onSuccess: (data) => {
      toast.success(`Đã khôi phục ${data.data?.data?.length || 0} sản phẩm`)
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Lỗi khi khôi phục sản phẩm hàng loạt'),
  })

  const batchHardDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => productService.hardDeleteProducts(ids),
    onSuccess: (data) => {
      toast.success(`Đã xóa vĩnh viễn ${data.data?.data?.length || 0} sản phẩm`)
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => toast.error('Lỗi khi xóa vĩnh viễn sản phẩm hàng loạt'),
  })

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setIsUpdateDialogOpen(true)
  }

  return (
    <div className='flex flex-col gap-6 relative pb-10'>
      <UpdateProductDialog
        product={selectedProduct}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {activeTab === 'trash' ? 'Thùng rác sản phẩm' : 'Quản lý sản phẩm'}
          </h1>
          <p className='text-muted-foreground'>
            {activeTab === 'trash'
              ? 'Danh sách sản phẩm đã xóa'
              : 'Kiểm soát kho hàng và danh mục sản phẩm của cửa hàng'}
          </p>
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setActiveTab(activeTab === 'active' ? 'trash' : 'active')}
            className={cn(
              'gap-2 transition-all duration-200 border-dashed',
              activeTab === 'trash'
                ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-700 hover:border-orange-300'
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-50',
            )}
          >
            {activeTab === 'trash' ? (
              <>
                <ArrowLeft className='h-4 w-4' /> Quay lại danh sách
              </>
            ) : (
              <>
                <Trash2 className='h-4 w-4' /> Thùng rác
              </>
            )}
          </Button>

          {activeTab === 'active' && (
            <>
              <div className='h-6 w-px bg-slate-200 hidden sm:block mx-1' />
              <CreateProductDialog />
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        itemType='sản phẩm'
        onClearSelection={() => setSelectedIds(new Set())}
        actions={
          activeTab === 'trash' ? (
            <>
              <Button
                variant='outline'
                size='sm'
                className='border-green-200 bg-green-50 text-green-700 hover:bg-green-100 font-medium shadow-sm transition-all'
                onClick={() => batchRestoreMutation.mutate(Array.from(selectedIds))}
                disabled={batchRestoreMutation.isPending}
              >
                <RefreshCcw className='mr-2 h-4 w-4' /> Khôi phục
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='destructive'
                    size='sm'
                    className='shadow-sm font-medium'
                    disabled={batchHardDeleteMutation.isPending}
                  >
                    <Trash2 className='mr-2 h-4 w-4' /> Xóa vĩnh viễn
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xóa vĩnh viễn {selectedIds.size} sản phẩm?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Dữ liệu sẽ bị mất hoàn toàn.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-red-600 hover:bg-red-700'
                      onClick={() => batchHardDeleteMutation.mutate(Array.from(selectedIds))}
                    >
                      Xóa vĩnh viễn
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  size='sm'
                  className='shadow-sm font-medium'
                  disabled={batchSoftDeleteMutation.isPending}
                >
                  <Trash2 className='mr-2 h-4 w-4' /> Xóa ({selectedIds.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Chuyển {selectedIds.size} sản phẩm vào thùng rác?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Các sản phẩm này sẽ bị ẩn khỏi cửa hàng và có thể khôi phục sau.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-red-600 hover:bg-red-700'
                    onClick={() => batchSoftDeleteMutation.mutate(Array.from(selectedIds))}
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        }
      />

      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-lg border shadow-sm'>
        <div className='relative flex-1 w-full md:max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Tìm theo tên sản phẩm...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex gap-2 w-full md:w-auto'>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-full md:w-[180px]'>
              <div className='flex items-center gap-2 text-slate-600'>
                <Filter className='h-3.5 w-3.5' />
                <SelectValue placeholder='Danh mục' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[40px]'>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label='Select all'
                />
              </TableHead>
              <TableHead className='w-[80px] text-center'>Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá bán</TableHead>
              <TableHead className='text-center'>Kho hàng</TableHead>
              <TableHead className='text-center'>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center text-muted-foreground'>
                  <Loader2 className='h-6 w-6 animate-spin mx-auto mb-2' />
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-32 text-center text-muted-foreground'>
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} data-state={selectedIds.has(product.id) && 'selected'}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={(checked) => handleSelectOne(product.id, checked as boolean)}
                      aria-label={`Select product ${product.id}`}
                    />
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden mx-auto flex items-center justify-center'>
                      {product.imageUrl ? (
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <Eye className='h-5 w-5 text-slate-300' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='font-medium text-slate-900'>{product.name}</div>
                    <div className='text-xs text-muted-foreground line-clamp-1'>
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='font-normal'>
                      {typeof product.category === 'string'
                        ? product.category
                        : product.category?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-medium'>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.stock ??
                      product.variants?.reduce((acc, v) => acc + v.quantity, 0) ??
                      0}
                  </TableCell>
                  <TableCell className='text-center'>
                    {activeTab === 'trash' ? (
                      <Badge variant='secondary' className='bg-red-100 text-red-700'>
                        Đã xóa
                      </Badge>
                    ) : (
                      <Badge
                        variant={product.isActive ? 'default' : 'secondary'}
                        className={
                          product.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-none border-transparent'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 shadow-none border-transparent'
                        }
                      >
                        {product.isActive ? 'Hoạt động' : 'Ẩn'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {activeTab === 'active' ? (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(product)}
                              className='cursor-pointer'
                            >
                              <Edit className='mr-2 h-4 w-4' /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/products/${product.id}`)}
                              className='cursor-pointer'
                            >
                              <Eye className='mr-2 h-4 w-4' /> Xem chi tiết
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className='text-red-600 focus:text-red-600 cursor-pointer'
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className='mr-2 h-4 w-4' /> Xóa
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sản phẩm này sẽ được chuyển vào thùng rác và có thể khôi phục
                                    sau.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className='bg-red-600 hover:bg-red-700'
                                    onClick={() => softDeleteMutation.mutate(product.id)}
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => restoreMutation.mutate(product.id)}
                              className='cursor-pointer'
                            >
                              <RefreshCcw className='mr-2 h-4 w-4' /> Khôi phục
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className='text-red-600 focus:text-red-600 cursor-pointer'
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className='mr-2 h-4 w-4' /> Xóa vĩnh viễn
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cảnh báo: Hành động không thể hoàn tác!
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Sản phẩm này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className='bg-red-600 hover:bg-red-700'
                                    onClick={() => hardDeleteMutation.mutate(product.id)}
                                  >
                                    Xóa vĩnh viễn
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Hiển thị</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>sản phẩm mỗi trang</span>
        </div>

        {pagination && (
          <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end'>
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
        )}
      </div>
    </div>
  )
}
