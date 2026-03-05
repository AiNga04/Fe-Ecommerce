'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { userService } from '@/services/user'
import { User, UserStatus, Gender } from '@/types/user'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Search, Activity, Eye, UserCog, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { getImageUrl } from '@/lib/utils'
import { UserAuditLogsDialog } from '@/components/staff/users/audit-logs-dialog'

export default function StaffUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)

  // Filters
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [auditDialog, setAuditDialog] = useState<{
    isOpen: boolean
    userId: number | null
    userName: string | null
  }>({
    isOpen: false,
    userId: null,
    userName: null,
  })

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const params = {
        page,
        size: pageSize,
        lastName: search || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }

      const res = await userService.searchUsers(params)

      if (res.data.success) {
        setUsers(res.data.data || [])
        setTotalPages(res.data.pagination?.totalPages || 0)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, roleFilter, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    fetchUsers()
  }

  return (
    <div className='flex flex-col gap-6 relative'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Khách hàng & Người dùng</h1>
          <p className='text-muted-foreground'>
            Tra cứu thông tin tài khoản người dùng trong hệ thống
          </p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-lg border shadow-sm'>
        <form onSubmit={handleSearch} className='relative flex-1 w-full md:max-w-sm'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Tìm theo tên...'
            className='pl-8'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className='flex gap-2 w-full md:w-auto'>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className='w-full md:w-[140px]'>
              <SelectValue placeholder='Vai trò' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả vai trò</SelectItem>
              <SelectItem value='USER'>Khách hàng</SelectItem>
              <SelectItem value='STAFF'>Nhân viên</SelectItem>
              <SelectItem value='SHIPPER'>Giao hàng</SelectItem>
              <SelectItem value='ADMIN'>Quản trị viên</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-full md:w-[140px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
              <SelectItem value='ACTIVE'>Hoạt động</SelectItem>
              <SelectItem value='PENDING'>Chờ xác minh</SelectItem>
              <SelectItem value='DISABLED'>Bị khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px] text-center'>Avatar</TableHead>
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
                  <TableCell className='text-center'>
                    <div className='w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden mx-auto flex items-center justify-center text-lg font-semibold text-slate-400'>
                      {user.avatarUrl ? (
                        <img
                          src={getImageUrl(user.avatarUrl)}
                          alt=''
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <span>
                          {user.firstName ? (
                            user.firstName.substring(0, 1).toUpperCase()
                          ) : (
                            <UserCog className='w-5 h-5' />
                          )}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium text-slate-900'>
                        {user.lastName} {user.firstName}
                      </span>
                      <span className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5 line-clamp-1'>
                        ID: #{user.id} •{' '}
                        {user.gender === Gender.FEMALE
                          ? 'Nữ'
                          : user.gender === Gender.MALE
                            ? 'Nam'
                            : 'Khác'}
                        {user.dateOfBirth && (
                          <span> • {new Date(user.dateOfBirth).toLocaleDateString()}</span>
                        )}
                      </span>
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
                          : user.status === UserStatus.DISABLED
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : user.status === UserStatus.PENDING
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : 'bg-gray-400 hover:bg-gray-500'
                      }
                    >
                      {user.status === UserStatus.ACTIVE && 'Đang hoạt động'}
                      {user.status === UserStatus.PENDING && 'Chờ xác minh'}
                      {user.status === UserStatus.DISABLED && 'Bị khóa'}
                      {user.status === UserStatus.DELETED && 'Đã xóa'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        asChild
                        className='h-8 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 text-xs gap-1.5'
                      >
                        <Link href={`/staff/users/${user.id}`}>
                          <Eye className='w-3.5 h-3.5' />
                        </Link>
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 px-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 text-xs gap-1.5'
                        onClick={() =>
                          setAuditDialog({
                            isOpen: true,
                            userId: user.id,
                            userName: `${user.lastName} ${user.firstName}`,
                          })
                        }
                      >
                        <Activity className='w-3.5 h-3.5' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Hiển thị</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>người dùng mỗi trang</span>
        </div>

        {totalPages > 0 && (
          <div className='flex items-center gap-4'>
            <div className='text-sm text-muted-foreground'>
              Trang {page + 1} / {totalPages}
            </div>
            <Pagination className='justify-end w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 0) setPage(page - 1)
                    }}
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < totalPages - 1) setPage(page + 1)
                    }}
                    className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <UserAuditLogsDialog
        isOpen={auditDialog.isOpen}
        userId={auditDialog.userId}
        userName={auditDialog.userName}
        onClose={() => setAuditDialog({ ...auditDialog, isOpen: false })}
      />
    </div>
  )
}
