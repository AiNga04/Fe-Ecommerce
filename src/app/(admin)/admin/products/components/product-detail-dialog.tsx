'use client'

import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { productService } from '@/services/product'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getImageUrl } from '@/lib/utils'
import { Loader2, Package, Calendar, Tag, Info, ImageIcon, Ruler } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface ProductDetailDialogProps {
  productId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ productId, open, onOpenChange }: ProductDetailDialogProps) {
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => (productId ? productService.getProductById(productId) : null),
    enabled: !!productId && open,
  })

  const product = productData?.data?.data

  if (!productId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle className='text-xl flex items-center gap-2'>
            <Info className='w-5 h-5 text-primary' />
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className='flex-1 p-6'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-60 gap-4 text-muted-foreground'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
              <p>Đang tải thông tin sản phẩm...</p>
            </div>
          ) : product ? (
            <div className='space-y-8'>
              {/* Header Info */}
              <div className='flex flex-col md:flex-row gap-6'>
                {/* Main Image */}
                <div className='w-full md:w-1/3 aspect-square rounded-xl border overflow-hidden bg-slate-50 relative group'>
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

                {/* Basic Info */}
                <div className='flex-1 space-y-4'>
                  <div>
                    <Badge variant={product.isActive ? 'default' : 'secondary'} className='mb-2'>
                      {product.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                    </Badge>
                    <h2 className='text-2xl font-bold text-slate-900'>{product.name}</h2>
                    <p className='text-muted-foreground mt-1'>Mã SP: #{product.id}</p>
                  </div>

                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                      <Tag className='w-4 h-4 text-slate-400' />
                      <span className='font-medium'>Danh mục:</span>
                      <span>
                        {typeof product.category === 'object'
                          ? product.category?.name
                          : product.category}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Package className='w-4 h-4 text-slate-400' />
                      <span className='font-medium'>Tồn kho tổng:</span>
                      <span>{product.stock}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-slate-400' />
                      <span className='font-medium'>Ngày tạo:</span>
                      <span>
                        {product.createdAt
                          ? format(new Date(product.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                          : 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-slate-400' />
                      <span className='font-medium'>Cập nhật:</span>
                      <span>
                        {product.updatedAt
                          ? format(new Date(product.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className='bg-slate-50 p-4 rounded-lg border'>
                    <span className='text-sm text-muted-foreground block mb-1'>Giá bán</span>
                    <span className='text-2xl font-bold text-primary'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.price)}
                    </span>
                  </div>

                  <div>
                    <h3 className='font-medium mb-1'>Mô tả</h3>
                    <p className='text-sm text-slate-600 whitespace-pre-line border p-3 rounded-lg bg-slate-50/50 min-h-[80px]'>
                      {product.description || 'Không có mô tả'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                    <ImageIcon className='w-5 h-5 text-slate-500' />
                    Thư viện ảnh ({product.gallery.length})
                  </h3>
                  <div className='grid grid-cols-4 md:grid-cols-6 gap-3'>
                    {product.gallery.map((img) => (
                      <div
                        key={img.id}
                        className='aspect-square rounded-lg border overflow-hidden bg-slate-50'
                      >
                        <img
                          src={getImageUrl(img.url)}
                          alt={`Gallery ${img.id}`}
                          className='w-full h-full object-cover hover:scale-105 transition-transform'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                    <Package className='w-5 h-5 text-slate-500' />
                    Biến thể & Tồn kho
                  </h3>
                  <div className='border rounded-lg overflow-hidden'>
                    <Table>
                      <TableHeader className='bg-slate-50'>
                        <TableRow>
                          <TableHead>Kích thước</TableHead>
                          <TableHead>Mã</TableHead>
                          <TableHead className='text-right'>Số lượng tồn</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.map((variant) => (
                          <TableRow key={variant.id}>
                            <TableCell className='font-medium'>{variant.sizeName}</TableCell>
                            <TableCell>
                              <Badge variant='outline'>{variant.sizeCode}</Badge>
                            </TableCell>
                            <TableCell className='text-right font-medium'>
                              {variant.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Size Guide */}
              {product.sizeGuide && (
                <div>
                  <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                    <Ruler className='w-5 h-5 text-slate-500' />
                    Bảng quy đổi kích thước
                  </h3>
                  <div className='flex gap-4 p-4 border rounded-lg bg-slate-50/50'>
                    {product.sizeGuide.imageUrl && (
                      <div className='w-32 h-32 shrink-0 bg-white rounded-md border p-1'>
                        <img
                          src={getImageUrl(product.sizeGuide.imageUrl)}
                          alt={product.sizeGuide.name}
                          className='w-full h-full object-contain'
                        />
                      </div>
                    )}
                    <div>
                      <h4 className='font-medium'>{product.sizeGuide.name}</h4>
                      <p className='text-sm text-slate-500 mt-1'>{product.sizeGuide.description}</p>
                      <Badge
                        variant={product.sizeGuide.isActive ? 'outline' : 'secondary'}
                        className='mt-2'
                      >
                        {product.sizeGuide.isActive ? 'Đang sử dụng' : 'Không hoạt động'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-60 text-muted-foreground'>
              <Package className='w-12 h-12 text-slate-200 mb-2' />
              <p>Không tìm thấy thông tin sản phẩm.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
