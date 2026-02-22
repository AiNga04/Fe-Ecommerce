'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, Loader2, Ruler } from 'lucide-react'
import { sizeGuideService } from '@/services/size-guide'
import { SizeGuide } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { SizeGuideDialog } from './components/size-guide-dialog'
import { toast } from 'sonner'
import { getImageUrl } from '@/lib/utils'

export default function SizeGuidesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSizeGuide, setSelectedSizeGuide] = useState<SizeGuide | null>(null)

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  const { data: sizeGuidesData, isLoading } = useQuery({
    queryKey: ['sizeGuides'],
    queryFn: () => sizeGuideService.getAll(),
  })

  // The API returns a list directly in data field usually, let's check service
  // Service returns IBackendRes<SizeGuide[]> -> data.data
  const sizeGuides = sizeGuidesData?.data?.data || []

  const filteredGuides = sizeGuides.filter((guide) =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteMutation = useMutation({
    mutationFn: (id: number) => sizeGuideService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa bảng size thành công')
      queryClient.invalidateQueries({ queryKey: ['sizeGuides'] })
      setDeleteId(null)
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa bảng size')
    },
  })

  const handleEdit = (guide: SizeGuide) => {
    setSelectedSizeGuide(guide)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedSizeGuide(null)
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
          <h1 className='text-3xl font-bold tracking-tight'>Bảng Size</h1>
          <p className='text-muted-foreground'>Quản lý các bảng hướng dẫn chọn size cho sản phẩm</p>
        </div>
        <Button
          onClick={handleCreate}
          className='bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
        >
          <Plus className='h-4 w-4' /> Thêm Bảng Size
        </Button>
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
      ) : filteredGuides.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-lg border border-dashed'>
          <Ruler className='h-12 w-12 mx-auto text-slate-300 mb-4' />
          <h3 className='text-lg font-medium text-slate-900'>Chưa có bảng size nào</h3>
          <p className='text-slate-500 max-w-sm mx-auto mt-2'>
            Hãy tạo bảng size đầu tiên để giúp khách hàng chọn kích cỡ phù hợp.
          </p>
          <Button onClick={handleCreate} variant='outline' className='mt-6'>
            Tạo bảng size ngay
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredGuides.map((guide) => (
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
                <div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    size='icon'
                    variant='secondary'
                    className='h-8 w-8 bg-white/90 hover:bg-white shadow-sm'
                    onClick={() => handleEdit(guide)}
                  >
                    <Pencil className='h-4 w-4 text-slate-700' />
                  </Button>
                  <Button
                    size='icon'
                    variant='destructive'
                    className='h-8 w-8 shadow-sm'
                    onClick={() => setDeleteId(guide.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
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

      <SizeGuideDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        sizeGuide={selectedSizeGuide}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bảng size này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Xin hãy chắc chắn rằng bảng size này không đang được
              sử dụng bởi sản phẩm quan trọng nào.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCallback}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa bảng size'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
