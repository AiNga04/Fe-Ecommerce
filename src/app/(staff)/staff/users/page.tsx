'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { userService } from '@/services/user'
import { User, UserStatus, Gender } from '@/types/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Activity,
  Mail,
  Phone,
  RefreshCcw,
  ShieldAlert,
  Filter,
  User as UserIcon,
  Calendar,
  Info,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { getImageUrl, cn } from '@/lib/utils'
import { UserAuditLogsDialog } from '@/components/staff/users/audit-logs-dialog'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { format } from 'date-fns'

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
        lastName: search || undefined, // Simple lastName search for now based on 'Tìm theo tên'
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

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <Badge className='bg-emerald-500 text-white hover:bg-emerald-600 border-none px-3 rounded-full'>
            Đang hoạt động
          </Badge>
        )
      case UserStatus.DISABLED:
        return (
          <Badge className='bg-slate-400 text-white hover:bg-slate-500 border-none px-3 rounded-full'>
            Đã vô hiệu
          </Badge>
        )
      case UserStatus.DELETED:
        return (
          <Badge className='bg-rose-500 text-white hover:bg-rose-600 border-none px-3 rounded-full'>
            Đã xóa
          </Badge>
        )
      case UserStatus.PENDING:
        return (
          <Badge className='bg-amber-400 text-white hover:bg-amber-500 border-none px-3 rounded-full'>
            Chờ xác minh
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getGenderLabel = (gender?: Gender) => {
    switch (gender) {
      case Gender.MALE:
        return 'Nam'
      case Gender.FEMALE:
        return 'Nữ'
      case Gender.OTHER:
        return 'Khác'
      default:
        return 'Khác'
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
            Khách hàng & Người dùng
          </h1>
          <p className='text-slate-500 text-sm mt-1'>
            Tra cứu thông tin tài khoản người dùng trong hệ thống
          </p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm'>
        <form onSubmit={handleSearch} className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors' />
          <Input
            placeholder='Tìm theo tên...'
            className='pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className='flex items-center gap-3 w-full md:w-auto'>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className='h-11 w-full md:w-[180px] bg-white border-slate-200 rounded-lg'>
              <SelectValue placeholder='Tất cả vai trò' />
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
            <SelectTrigger className='h-11 w-full md:w-[180px] bg-white border-slate-200 rounded-lg'>
              <SelectValue placeholder='Tất cả trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
              <SelectItem value='ACTIVE'>Đang hoạt động</SelectItem>
              <SelectItem value='PENDING'>Chờ xác minh</SelectItem>
              <SelectItem value='DISABLED'>Đã vô hiệu</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            onClick={() => {
              setSearch('')
              setRoleFilter('ALL')
              setStatusFilter('ALL')
            }}
            className='h-11 px-4 text-slate-500'
          >
            Làm mới
          </Button>
        </div>
      </div>

      <Card className='shadow-md border-slate-200 overflow-hidden rounded-xl'>
        <CardContent className='p-0'>
          {isLoading && !users.length ? (
            <div className='py-32 flex justify-center'>
              <LoadingOverlay visible={true} />
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-slate-50/50 border-b border-slate-100'>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='text-slate-500 tracking-wider py-4 pl-6'>
                      Avatar
                    </TableHead>
                    <TableHead className='text-slate-500 tracking-wider py-4'>Thông tin</TableHead>
                    <TableHead className='text-slate-500 tracking-wider py-4'>Liên hệ</TableHead>
                    <TableHead className='text-slate-500 tracking-wider py-4'>Vai trò</TableHead>
                    <TableHead className='text-slate-500 tracking-wider py-4 text-center'>
                      Trạng thái
                    </TableHead>
                    <TableHead className='text-slate-500 tracking-wider py-4'>
                      Ngày tham gia
                    </TableHead>
                    <TableHead className='text-right text-slate-500 tracking-wider py-4 pr-6'>
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className='hover:bg-slate-50/50 transition-colors border-b border-slate-50 group'
                    >
                      <TableCell className='py-4 pl-6'>
                        <Avatar className='h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100'>
                          <AvatarImage src={getImageUrl(user.avatarUrl)} />
                          <AvatarFallback className='bg-slate-100 text-slate-500 font-bold'>
                            {user.firstName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className='py-4'>
                        <div className='flex flex-col gap-0.5'>
                          <span className='font-bold text-slate-900 group-hover:text-blue-600 transition-colors'>
                            {user.lastName} {user.firstName}
                          </span>
                          <span className='text-[11px] text-slate-400 font-medium flex items-center gap-1.5'>
                            ID: #{user.id} <span className='text-slate-200'>•</span>{' '}
                            {getGenderLabel(user.gender)}
                            {user.dateOfBirth && (
                              <>
                                <span className='text-slate-200'>•</span>{' '}
                                {format(new Date(user.dateOfBirth), 'dd/MM/yyyy')}
                              </>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='py-4'>
                        <div className='flex flex-col gap-0.5 text-xs'>
                          <span className='text-slate-600 flex items-center gap-1.5'>
                            {user.email}
                          </span>
                          <span className='text-slate-400'>
                            {user.phone || 'Chưa cập nhật SĐT'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='py-4'>
                        <div className='flex flex-wrap gap-1'>
                          {user.roles?.map((role, idx) => (
                            <Badge
                              key={idx}
                              variant='outline'
                              className='bg-transparent text-[10px] font-bold py-0 h-5 px-2 text-slate-500 border-slate-200'
                            >
                              {role}
                            </Badge>
                          )) || <Badge variant='outline'>USER</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className='py-4 text-center'>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell className='py-4'>
                        <span className='text-sm text-slate-500 font-medium'>
                          {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                        </span>
                      </TableCell>
                      <TableCell className='text-right py-4 pr-6'>
                        <div className='flex items-center justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            asChild
                            className='h-9 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-bold text-xs gap-1.5'
                          >
                            <Link href={`/staff/users/${user.id}`}>
                              <Eye className='w-3.5 h-3.5' />
                              Chi tiết
                            </Link>
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-9 px-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 font-bold text-xs gap-1.5'
                            onClick={() =>
                              setAuditDialog({
                                isOpen: true,
                                userId: user.id,
                                userName: `${user.lastName} ${user.firstName}`,
                              })
                            }
                          >
                            <Activity className='w-3.5 h-3.5' />
                            Nhật ký
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {users.length === 0 && !isLoading && (
                <div className='py-20 text-center flex flex-col items-center justify-center text-slate-400'>
                  <UserIcon className='w-16 h-16 mb-4 opacity-10' />
                  <p className='text-lg font-medium'>Không tìm thấy người dùng nào</p>
                  <p className='text-sm italic'>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className='flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-6'>
        <div className='flex items-center gap-2 text-sm text-slate-500'>
          <span>Hiển thị</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setPage(0)
            }}
          >
            <SelectTrigger className='h-8 w-[70px] bg-white'>
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 50].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>người dùng mỗi trang</span>
        </div>

        {totalPages > 0 && (
          <div className='flex items-center gap-4'>
            <div className='text-sm text-slate-500 font-medium'>
              Trang {page + 1} / {totalPages}
            </div>
            <Pagination className='justify-end w-auto mx-0'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 0) setPage(page - 1)
                    }}
                    className={
                      page === 0 ? 'pointer-events-none opacity-50' : 'bg-white border-slate-200'
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      if (page < totalPages - 1) setPage(page + 1)
                    }}
                    className={
                      page >= totalPages - 1
                        ? 'pointer-events-none opacity-50'
                        : 'bg-white border-slate-200'
                    }
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
