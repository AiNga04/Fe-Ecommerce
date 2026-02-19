import { Category } from '@/types/category'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { useCategories } from '@/hooks/use-categories'

interface CategoryFilterProps {
  selectedCategoryIds: number[]
  onChange: (ids: number[]) => void
}

export function CategoryFilter({ selectedCategoryIds, onChange }: CategoryFilterProps) {
  const { data: categories = [], isLoading } = useCategories(true)

  const handleToggle = (id: number) => {
    if (selectedCategoryIds.includes(id)) {
      onChange(selectedCategoryIds.filter((cid) => cid !== id))
    } else {
      onChange([...selectedCategoryIds, id])
    }
  }

  const FilterContent = () => (
    <div className='space-y-4'>
      <div className='font-semibold text-lg'>Danh mục</div>
      {isLoading ? (
        <div className='space-y-2'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-6 w-full' />
          ))}
        </div>
      ) : (
        <div className='space-y-3'>
          {categories.map((category) => (
            <div key={category.id} className='flex items-center space-x-2'>
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategoryIds.includes(category.id)}
                onCheckedChange={() => handleToggle(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1'
              >
                {category.name}
              </Label>
              {/* If we had counts, we would display them here */}
              {/* <span className='text-xs text-muted-foreground'>(12)</span> */}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop View */}
      <div className='hidden md:block w-64 shrink-0 space-y-8 pr-6 border-r'>
        <FilterContent />
      </div>

      {/* Mobile View */}
      <div className='md:hidden mb-4'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' className='w-full justify-between'>
              <span className='flex items-center gap-2'>
                <Filter className='h-4 w-4' />
                Bộ lọc
              </span>
              {selectedCategoryIds.length > 0 && <Badge>{selectedCategoryIds.length}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <SheetHeader>
              <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
            </SheetHeader>
            <div className='mt-6'>
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
