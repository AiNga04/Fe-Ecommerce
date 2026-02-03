import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4'>
      <div className='bg-red-100 p-4 rounded-full mb-6'>
        <ShieldAlert className='w-16 h-16 text-red-600' />
      </div>
      <h1 className='text-4xl font-bold text-gray-900 mb-2'>Truy cập bị từ chối</h1>
      <p className='text-xl text-gray-600 mb-6 font-medium'>Lỗi 403 - Forbidden</p>

      <p className='max-w-md text-muted-foreground mb-8'>
        Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn
        nghĩ đây là một sự nhầm lẫn.
      </p>

      <div className='flex gap-4'>
        <Button asChild variant='outline'>
          <Link href='/'>Về Trang chủ</Link>
        </Button>
        <Button asChild>
          <Link href='/auth/login'>Đăng nhập tài khoản khác</Link>
        </Button>
      </div>
    </div>
  )
}
