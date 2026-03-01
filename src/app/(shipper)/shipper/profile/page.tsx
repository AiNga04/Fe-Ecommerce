'use client'

import { User, Phone, Mail, MapPin, ShieldCheck, LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ShipperProfilePage() {
  return (
    <div className='w-full space-y-6'>
      <div className='flex items-center gap-4'>
        <h2 className='text-2xl font-bold'>Hồ sơ của tôi</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='md:col-span-1 border-none shadow-sm'>
          <CardContent className='pt-8 pb-8 flex flex-col items-center text-center'>
            <Avatar className='w-24 h-24 mb-4 border-4 border-orange-50'>
              <AvatarFallback className='bg-orange-100 text-orange-600 font-black text-2xl'>
                SP
              </AvatarFallback>
            </Avatar>
            <h3 className='font-bold text-xl'>Shipper Partner</h3>
            <p className='text-sm text-muted-foreground'>Thành viên ZYNA Fashion</p>
            <div className='mt-4 inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100'>
              <ShieldCheck className='w-3 h-3 mr-1' />
              Đã xác minh
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2 border-none shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg'>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='space-y-1'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                  <User className='w-3 h-3' /> Họ và tên
                </p>
                <p className='font-medium'>Shipper Partner</p>
              </div>
              <div className='space-y-1'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                  <Phone className='w-3 h-3' /> Số điện thoại
                </p>
                <p className='font-medium'>0123 456 789</p>
              </div>
              <div className='space-y-1'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                  <Mail className='w-3 h-3' /> Email
                </p>
                <p className='font-medium text-blue-600'>shipper@zyna.vn</p>
              </div>
              <div className='space-y-1'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                  <MapPin className='w-3 h-3' /> Khu vực hoạt động
                </p>
                <p className='font-medium'>Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>

            <div className='pt-6 border-t flex justify-end gap-3'>
              <Button variant='outline'>Đổi mật khẩu</Button>
              <Button className='bg-orange-600 hover:bg-orange-700'>Chỉnh sửa hồ sơ</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border-none shadow-sm bg-red-50'>
        <CardContent className='p-4 flex items-center justify-between'>
          <div>
            <p className='font-bold text-red-900'>Đăng xuất khỏi hệ thống</p>
            <p className='text-xs text-red-700'>
              Bạn sẽ cần đăng nhập lại để xem các đơn hàng mới.
            </p>
          </div>
          <Button variant='destructive' size='sm'>
            <LogOut className='w-4 h-4 mr-2' />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
