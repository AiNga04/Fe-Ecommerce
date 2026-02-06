'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { useState } from 'react'

export function AdminHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className='h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10'>
      <div className='flex items-center gap-4'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>

          <SheetContent side='left' className='p-0 w-72 border-r-0 bg-slate-900 text-slate-100'>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
            <AdminSidebar className='border-none' onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className='font-medium text-sm text-muted-foreground hidden md:block'>
          Khu vực quản trị
        </div>
        <div className='font-medium text-sm text-muted-foreground md:hidden'>Admin</div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='text-right hidden md:block'>
          <p className='text-sm font-medium'>Admin User</p>
          <p className='text-xs text-muted-foreground'>admin@example.com</p>
        </div>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
