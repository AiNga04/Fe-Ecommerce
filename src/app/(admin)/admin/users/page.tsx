'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, UserCog } from 'lucide-react'
import { userService } from '@/services/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function UsersPage() {
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userService.getUsers(),
  })

  // Access data safely
  const users = usersData?.data?.data || []

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Nguời dùng</h1>
          <p className='text-muted-foreground'>Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input type='search' placeholder='Tìm kiếm...' className='pl-8' />
        </div>
      </div>

      <div className='rounded-md border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center'>
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>#{user.id}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {/* Avatar placeholder */}
                      <div className='h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold overflow-hidden'>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt='' className='h-full w-full object-cover' />
                        ) : (
                          <span>
                            {user.firstName ? user.firstName.substring(0, 1).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      {user.firstName} {user.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    <div className='flex gap-1 flex-wrap'>
                      {user.roles.map((role) => (
                        <Badge key={role} variant='outline' className='text-xs'>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className={user.status === 'ACTIVE' ? 'bg-green-600' : 'bg-gray-400'}
                    >
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Khoá'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon'>
                      <UserCog className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
