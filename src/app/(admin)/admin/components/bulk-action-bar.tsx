import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckSquare } from 'lucide-react'

interface BulkActionBarProps {
  selectedCount: number
  itemType: string
  onClearSelection: () => void
  actions: React.ReactNode
}

export function BulkActionBar({
  selectedCount,
  itemType,
  onClearSelection,
  actions,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className='sticky top-4 z-50 flex items-center justify-between gap-4 rounded-md border bg-slate-900 p-4 text-white shadow-xl animate-in slide-in-from-top-2'>
      <div className='flex items-center gap-3'>
        <div className='flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-white'>
          <CheckSquare className='h-4 w-4' />
        </div>
        <span className='text-base font-medium tracking-wide'>
          Đã chọn {selectedCount} {itemType}
        </span>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='sm'
          className='text-slate-300 hover:text-white hover:bg-slate-800 rounded-md font-medium'
          onClick={onClearSelection}
        >
          Hủy chọn
        </Button>
        <div className='h-4 w-px bg-slate-600 mx-1' />
        {actions}
      </div>
    </div>
  )
}
