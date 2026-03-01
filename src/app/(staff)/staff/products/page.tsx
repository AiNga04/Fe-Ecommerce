'use client'

import React, { useEffect, useState } from 'react'
import { productService } from '@/services/product'
import { categoryService } from '@/services/category'
import { Product, Category } from '@/types/product'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Image as ImageIcon,
  Search,
  Filter,
  History,
  AlertTriangle,
  MoreVertical,
} from 'lucide-react'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { PriceHistoryDialog } from '@/components/staff/products/price-history-dialog'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { toast } from 'sonner'

export default function StaffProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [page, setPage] = useState(0)

  // Price history dialog state
  const [priceHistory, setPriceHistory] = useState<{
    isOpen: boolean
    productId: number | null
    productName: string | null
  }>({
    isOpen: false,
    productId: null,
    productName: null,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll()
        if (res.data.success) {
          setCategories(res.data.data || [])
        }
      } catch (error) {
        console.error('Fetch categories error:', error)
      }
    }
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res = await productService.getProducts({
        page,
        size: 10,
        name: search || undefined,
        category: categoryFilter === 'ALL' ? undefined : categoryFilter,
      })
      if (res.data.success) {
        setProducts(res.data.data || [])
      }
    } catch (error) {
      console.error('Fetch products error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách sản phẩm')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, categoryFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const getCategoryName = (category: Product['category']) => {
    if (!category) return 'Chưa phân loại'
    if (typeof category === 'string') return category
    return category.name
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Quản lý Sản phẩm</h1>
          <p className='text-slate-500 text-sm'>
            Theo dõi trạng thái, tồn kho và lịch sử giá sản phẩm
          </p>
        </div>
      </div>

      <Card className='shadow-sm border-slate-200'>
        <CardHeader className='pb-3'>
          <form onSubmit={handleSearch} className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                placeholder='Tìm theo tên sản phẩm...'
                className='pl-10'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2 w-full md:w-auto'>
              <Filter className='w-4 h-4 text-slate-500' />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-full md:w-[200px]'>
                  <SelectValue placeholder='Danh mục' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>Tất cả danh mục</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.code}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type='submit' variant='outline' className='hidden md:flex'>
              Lọc
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {isLoading && !products.length ? (
            <div className='py-20 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='rounded-xl border border-slate-100 overflow-hidden'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='w-[80px] font-bold'>Ảnh</TableHead>
                    <TableHead className='font-bold'>Sản phẩm</TableHead>
                    <TableHead className='font-bold'>Danh mục</TableHead>
                    <TableHead className='font-bold text-right'>Giá niêm yết</TableHead>
                    <TableHead className='font-bold text-center'>Tồn kho</TableHead>
                    <TableHead className='w-[150px] text-right font-bold'>Lịch sử giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className='hover:bg-slate-50/30 transition-colors group'
                    >
                      <TableCell>
                        <div className='w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-100'>
                          {product.imageUrl ? (
                            <img
                              src={getImageUrl(product.imageUrl)}
                              alt={product.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-slate-400'>
                              <ImageIcon className='w-5 h-5' />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <div className='font-bold text-slate-900 group-hover:text-blue-600 transition-colors'>
                            {product.name}
                          </div>
                          <div className='text-xs text-slate-400'>ID: {product.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className='bg-white text-slate-600 border-slate-200'
                        >
                          {getCategoryName(product.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right font-bold text-slate-900'>
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className='text-center'>
                        <div className='flex flex-col items-center gap-1'>
                          <span
                            className={`font-bold ${(product.stock || 0) < 10 ? 'text-rose-600' : 'text-slate-700'}`}
                          >
                            {product.stock || 0}
                          </span>
                          {(product.stock || 0) < 10 && (
                            <Badge className='bg-rose-100 text-rose-600 hover:bg-rose-100 border-none text-[10px] py-0 px-1.5'>
                              Sắp hết
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-slate-500 hover:text-blue-600 hover:bg-blue-50 h-8 px-3'
                          onClick={() =>
                            setPriceHistory({
                              isOpen: true,
                              productId: product.id,
                              productName: product.name,
                            })
                          }
                        >
                          <History className='w-3.5 h-3.5 mr-1.5' />
                          Xem lịch sử
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!products.length && (
                <div className='py-12 text-center text-slate-400 italic'>
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <PriceHistoryDialog
        productId={priceHistory.productId}
        productName={priceHistory.productName}
        isOpen={priceHistory.isOpen}
        onClose={() => setPriceHistory({ ...priceHistory, isOpen: false })}
      />
    </div>
  )
}
