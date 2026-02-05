'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  UserCog,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Archive,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'
import { userService } from '@/services/user'
import { getImageUrl } from '@/lib/utils'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserSearchCriteria, Role, UserStatus, Gender } from '@/types/user'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [viewDeleted, setViewDeleted] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Search Params State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const criteria: UserSearchCriteria = {
    page,
    size: pageSize,
    firstName: searchTerm || undefined, // Simple search by name for now, or expand to more fields
    role: filterRole !== 'ALL' ? filterRole : undefined,
    status: filterStatus !== 'ALL' ? filterStatus : undefined,
  }

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', viewDeleted, criteria],
    queryFn: () =>
      viewDeleted ? userService.getDeletedUsers(criteria) : userService.searchUsers(criteria),
  })

  const users = usersData?.data?.data || []

  // --- Mutations ---
  const softDeleteMutation = useMutation({
    mutationFn: (id: number) => userService.softDeleteUser(id),
    onSuccess: () => {
      toast.success('Đã chuyển người dùng vào thùng rác')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Xóa thất bại'),
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => userService.restoreUser(id),
    onSuccess: () => {
      toast.success('Khôi phục người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Khôi phục thất bại'),
  })

  const hardDeleteMutation = useMutation({
    mutationFn: (id: number) => userService.hardDeleteUser(id),
    onSuccess: () => {
      toast.success('Xóa vĩnh viễn thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Xóa thất bại'),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0) // Reset to first page on search
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {viewDeleted ? 'Thùng rác' : 'Người dùng'}
          </h1>
          <p className='text-muted-foreground'>
            {viewDeleted
              ? 'Danh sách người dùng đã xóa'
              : 'Quản lý tài khoản người dùng trong hệ thống'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={viewDeleted ? 'default' : 'outline'}
            onClick={() => {
              setViewDeleted(!viewDeleted)
              setPage(0)
            }}
          >
            {viewDeleted ? (
              <UserCog className='mr-2 h-4 w-4' />
            ) : (
              <Archive className='mr-2 h-4 w-4' />
            )}
            {viewDeleted ? 'Danh sách chính' : 'Thùng rác'}
          </Button>
          {!viewDeleted && (
            <Button asChild>
              <Link href='/admin/users/create'>
                <Plus className='mr-2 h-4 w-4' /> Thêm mới
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-lg border shadow-sm'>
        <form onSubmit={handleSearch} className='relative flex-1 w-full md:max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Tìm theo tên...'
            className='pl-8'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className='flex gap-2'>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Vai trò' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả vai trò</SelectItem>
              <SelectItem value={Role.USER}>User</SelectItem>
              <SelectItem value={Role.STAFF}>Staff</SelectItem>
              <SelectItem value={Role.ADMIN}>Admin</SelectItem>
              <SelectItem value={Role.SHIPPER}>Shipper</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
              <SelectItem value={UserStatus.ACTIVE}>Hoạt động</SelectItem>
              <SelectItem value={UserStatus.PENDING}>Chờ duyệt</SelectItem>
              <SelectItem value={UserStatus.LOCKED}>Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>ID</TableHead>
              <TableHead>Thông tin</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                  Không tìm thấy người dùng nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>#{user.id}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 overflow-hidden border border-slate-200'>
                        {user.avatarUrl ? (
                          <img
                            src={getImageUrl(user.avatarUrl)}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <span>
                            {user.firstName ? user.firstName.substring(0, 1).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-medium text-sm'>
                          {user.lastName} {user.firstName}
                        </span>
                        <span className='text-xs text-muted-foreground flex items-center gap-1'>
                          {user.gender === Gender.FEMALE
                            ? 'Nữ'
                            : user.gender === Gender.MALE
                              ? 'Nam'
                              : 'Khác'}
                          {user.dateOfBirth && (
                            <span>• {new Date(user.dateOfBirth).toLocaleDateString()}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col text-sm'>
                      <span>{user.email}</span>
                      <span className='text-muted-foreground text-xs'>
                        {user.phone || 'Chưa cập nhật SĐT'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-1 flex-wrap'>
                      {user.roles?.map((role) => (
                        <Badge key={role} variant='outline' className='text-xs font-normal'>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === UserStatus.ACTIVE ? 'default' : 'secondary'}
                      className={
                        user.status === UserStatus.ACTIVE
                          ? 'bg-green-600 hover:bg-green-700'
                          : user.status === UserStatus.LOCKED
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-400 hover:bg-gray-500'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(String(user.id))}
                        >
                          Copy User ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {!viewDeleted ? (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${user.id}`} className='cursor-pointer'>
                                <Edit className='mr-2 h-4 w-4' /> Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600 focus:text-red-600 cursor-pointer'
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa tạm thời người dùng này?')) {
                                  softDeleteMutation.mutate(user.id)
                                }
                              }}
                            >
                              <Trash2 className='mr-2 h-4 w-4' /> Xóa tạm thời
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => restoreMutation.mutate(user.id)}
                              className='cursor-pointer'
                            >
                              <RefreshCw className='mr-2 h-4 w-4' /> Khôi phục
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-red-600 focus:text-red-600 cursor-pointer'
                              onClick={() => {
                                if (
                                  confirm('Hành động này không thể hoàn tác. Bạn có chắc chắn?')
                                ) {
                                  hardDeleteMutation.mutate(user.id)
                                }
                              }}
                            >
                              <Trash2 className='mr-2 h-4 w-4' /> Xóa vĩnh viễn
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls can go here */}
    </div>
  )
}
