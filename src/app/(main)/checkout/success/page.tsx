'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className='container max-w-lg mx-auto px-4 py-20 text-center'>
      <div className='flex justify-center mb-6'>
        <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 space-y-2'>
          <CheckCircle className='w-10 h-10' />
        </div>
      </div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Đặt hàng thành công!</h1>
      <p className='text-muted-foreground mb-8'>
        Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
      </p>

      <div className='space-y-3'>
        <Button asChild className='w-full' size='lg'>
          <Link href='/profile/orders'>Xem đơn hàng của tôi</Link>
        </Button>
        <Button asChild variant='outline' className='w-full' size='lg'>
          <Link href='/products'>Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  )
}
