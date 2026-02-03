import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ShipperDashboard() {
  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>Shipper Dashboard</h1>
      <p className='mb-4'>Chào mừng đối tác vận chuyển.</p>
      <div className='grid grid-cols-1 gap-6'>
        <div className='p-6 border rounded-lg shadow-sm bg-white'>
          <h3 className='font-semibold text-lg mb-2'>Đơn cần giao</h3>
          <p className='text-muted-foreground text-sm mb-4'>
            Danh sách các đơn hàng cần giao hôm nay
          </p>
          <Button className='w-full sm:w-auto'>Xem danh sách</Button>
        </div>
      </div>
      <div className='mt-8'>
        <Button asChild variant='secondary'>
          <Link href='/'>Về Trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}
