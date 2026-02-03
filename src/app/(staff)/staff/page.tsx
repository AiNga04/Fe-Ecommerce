import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StaffDashboard() {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>Staff Dashboard</h1>
      <p className='mb-4'>Chào mừng Staff. Khu vực xử lý đơn hàng và sản phẩm.</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-6 border rounded-lg shadow-sm bg-white'>
          <h3 className='font-semibold text-lg mb-2'>Quản lý Đơn hàng</h3>
          <p className='text-muted-foreground text-sm mb-4'>Xử lý và cập nhật trạng thái đơn</p>
          <Button variant='outline'>Truy cập</Button>
        </div>
        <div className='p-6 border rounded-lg shadow-sm bg-white'>
          <h3 className='font-semibold text-lg mb-2'>Quản lý Kho</h3>
          <p className='text-muted-foreground text-sm mb-4'>Kiểm kê và nhập kho</p>
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
