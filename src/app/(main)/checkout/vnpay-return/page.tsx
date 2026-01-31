'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function VnPayReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [orderCode, setOrderCode] = useState<string | null>(null)

  useEffect(() => {
    const processResult = () => {
      // 1. Check explicit error param from Backend catch block
      const errorStatus = searchParams.get('status')
      const errorMessage = searchParams.get('message')

      if (errorStatus === 'error') {
        setStatus('error')
        setMessage(errorMessage ? decodeURIComponent(errorMessage) : 'Thanh toán thất bại')
        return
      }

      // 2. Check VNPay params
      const vnpResponseCode = searchParams.get('vnp_ResponseCode')
      const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus')
      const code = searchParams.get('orderCode')

      setOrderCode(code)

      if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
        setStatus('success')
        setMessage('Thanh toán thành công!')
      } else {
        setStatus('error')
        setMessage('Thanh toán thất bại hoặc bị hủy.')
      }
    }

    processResult()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <Loader2 className='w-12 h-12 text-primary animate-spin mb-4' />
        <h2 className='text-xl font-medium text-gray-700'>Đang xử lý kết quả...</h2>
      </div>
    )
  }

  return (
    <div className='container max-w-lg mx-auto px-4 py-20 text-center'>
      <div className='bg-white p-8 rounded-2xl shadow-sm border'>
        <div className='flex justify-center mb-6'>
          {status === 'success' ? (
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle2 className='w-10 h-10 text-green-600' />
            </div>
          ) : (
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
              <XCircle className='w-10 h-10 text-red-600' />
            </div>
          )}
        </div>

        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>

        <p className='text-gray-600 mb-6 font-medium'>{message}</p>

        {orderCode && (
          <p className='text-sm text-gray-500 mb-6'>
            Mã đơn hàng: <span className='font-bold text-gray-900'>{orderCode}</span>
          </p>
        )}

        <div className='space-y-3'>
          <Button asChild className='w-full h-12 text-base'>
            <Link href={status === 'success' ? '/profile/orders' : '/carts'}>
              {status === 'success' ? 'Xem đơn hàng' : 'Quay lại giỏ hàng'}
            </Link>
          </Button>
          <Button variant='outline' asChild className='w-full h-12 text-base'>
            <Link href='/'>Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VnPayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center p-10'>
          <Loader2 className='animate-spin' />
        </div>
      }
    >
      <VnPayReturnContent />
    </Suspense>
  )
}
