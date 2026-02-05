import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>Tổng quan về tình hình kinh doanh của hệ thống.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng Doanh Thu</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>45.231.000 ₫</div>
            <p className='text-xs text-muted-foreground'>+20.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Khách hàng mới</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+2350</div>
            <p className='text-xs text-muted-foreground'>+180.1% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Đơn hàng</CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+12,234</div>
            <p className='text-xs text-muted-foreground'>+19% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sản phẩm hoạt động</CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>573</div>
            <p className='text-xs text-muted-foreground'>+201 kể từ giờ trước</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            {/* Chart placeholder */}
            <div className='h-[240px] flex items-center justify-center text-muted-foreground bg-slate-50 rounded-md'>
              Biểu đồ doanh thu (Coming soon)
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Nguyen Van A</p>
                  <p className='text-sm text-muted-foreground'>nguyenvana@example.com</p>
                </div>
                <div className='ml-auto font-medium'>+1.999.000 ₫</div>
              </div>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Tran Thi B</p>
                  <p className='text-sm text-muted-foreground'>tranthib@example.com</p>
                </div>
                <div className='ml-auto font-medium'>+390.000 ₫</div>
              </div>
              <div className='flex items-center'>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm font-medium leading-none'>Le Van C</p>
                  <p className='text-sm text-muted-foreground'>levanc@example.com</p>
                </div>
                <div className='ml-auto font-medium'>+2.500.000 ₫</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
