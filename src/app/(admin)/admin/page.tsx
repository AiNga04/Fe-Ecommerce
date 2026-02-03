import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
      <p className='mb-4'>Chào mừng Administrator. Tại đây bạn có thể quản lý hệ thống.</p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-6 border rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-2'>Quản lý User</h3>
          <p className='text-muted-foreground text-sm mb-4'>Xem và phân quyền người dùng</p>
          <Button variant='outline'>Truy cập</Button>
        </div>
        <div className='p-6 border rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-2'>Doanh thu</h3>
          <p className='text-muted-foreground text-sm mb-4'>Xem báo cáo thống kê</p>
          <Button variant='outline'>Truy cập</Button>
        </div>
        <div className='p-6 border rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-2'>Cài đặt</h3>
          <p className='text-muted-foreground text-sm mb-4'>Cấu hình hệ thống</p>
          <Button variant='outline'>Truy cập</Button>
        </div>
      </div>
      <div className='mt-8'>
        <Button asChild>
          <Link href='/'>Về Trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}
