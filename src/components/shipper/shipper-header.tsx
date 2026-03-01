'use client'

import { Menu, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShipperHeaderProps {
  onMenuClick: () => void
}

export function ShipperHeader({ onMenuClick }: ShipperHeaderProps) {
  return (
    <header className='sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-8'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' className='lg:hidden' onClick={onMenuClick}>
          <Menu className='w-5 h-5' />
        </Button>
        <h1 className='text-lg font-semibold lg:text-xl'>Shipper Portal</h1>
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='w-5 h-5' />
          <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white' />
        </Button>
      </div>
    </header>
  )
}
