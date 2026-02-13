'use client'

import React, { useState, useMemo } from 'react'
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
  Eye,
  Check,
  FileJson,
  X,
  Loader2,
  CheckSquare,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { UserSearchCriteria, Role, UserStatus, Gender, UserBatchCreateRequest } from '@/types/user'
import { BulkCreateDialog } from './components/bulk-create-dialog'

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [viewDeleted, setViewDeleted] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // Search Params State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const criteria: UserSearchCriteria = {
    page,
    size: pageSize,
    firstName: searchTerm || undefined,
    role: filterRole !== 'ALL' ? filterRole : undefined,
    status: filterStatus !== 'ALL' ? filterStatus : undefined,
  }

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', viewDeleted, criteria],
    queryFn: async () => {
      // Clear selection when fetching new data
      setSelectedIds(new Set())

      const response = viewDeleted
        ? await userService.getDeletedUsers(criteria)
        : await userService.searchUsers(criteria)

      if (!viewDeleted && criteria.status && response.data?.data) {
        response.data.data = response.data.data.filter((u) => u.status === criteria.status)
      }

      return response
    },
  })

  const users = usersData?.data?.data || []

  // --- Selection Handlers ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = users.map((u) => u.id)
      setSelectedIds(new Set(allIds))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const isAllSelected = users.length > 0 && selectedIds.size === users.length

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

  // --- Batch Mutations ---
  const batchSoftDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => userService.softDeleteUsersBatch(ids),
    onSuccess: (data) => {
      toast.success(`Đã xóa ${data.data?.data?.deletedIds?.length || 0} người dùng`)
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Xóa hàng loạt thất bại'),
  })

  const batchRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => userService.restoreUsersBatch(ids),
    onSuccess: (data) => {
      toast.success(`Đã khôi phục ${data.data?.data?.restoredIds?.length || 0} người dùng`)
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Khôi phục hàng loạt thất bại'),
  })

  const batchHardDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => userService.hardDeleteUsersBatch(ids),
    onSuccess: (data) => {
      toast.success(`Đã xóa vĩnh viễn ${data.data?.data?.deletedIds?.length || 0} người dùng`)
      setSelectedIds(new Set())
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Xóa vĩnh viễn thất bại'),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
  }

  return (
    <div className='flex flex-col gap-6 relative'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
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
            <>
              <Button asChild variant='outline'>
                <Link href='/admin/users/create'>
                  <Plus className='mr-2 h-4 w-4' /> Thêm mới
                </Link>
              </Button>

              <BulkCreateDialog
                trigger={
                  <Button variant='secondary'>
                    <FileJson className='mr-2 h-4 w-4' /> Tạo hàng loạt
                  </Button>
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className='sticky top-4 z-50 flex items-center justify-between gap-4 rounded-lg border bg-slate-900 p-4 text-white shadow-xl animate-in slide-in-from-top-2'>
          <div className='flex items-center gap-2'>
            <CheckSquare className='h-5 w-5 text-green-400' />
            <span className='font-medium'>Đã chọn {selectedIds.size} người dùng</span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-white hover:bg-slate-800'
              onClick={() => setSelectedIds(new Set())}
            >
              Hủy chọn
            </Button>

            {viewDeleted ? (
              <>
                <Button
                  variant='secondary'
                  size='sm'
                  className='bg-green-600 hover:bg-green-700 text-white border-0'
                  onClick={() => batchRestoreMutation.mutate(Array.from(selectedIds))}
                  disabled={batchRestoreMutation.isPending}
                >
                  <RefreshCw className='mr-2 h-4 w-4' /> Khôi phục ({selectedIds.size})
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='destructive'
                      size='sm'
                      disabled={batchHardDeleteMutation.isPending}
                    >
                      <Trash2 className='mr-2 h-4 w-4' /> Xóa vĩnh viễn ({selectedIds.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Xóa vĩnh viễn {selectedIds.size} người dùng?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Dữ liệu sẽ bị mất hoàn toàn.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-red-600 hover:bg-red-700'
                        onClick={() => batchHardDeleteMutation.mutate(Array.from(selectedIds))}
                      >
                        Xóa vĩnh viễn
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='destructive'
                    size='sm'
                    disabled={batchSoftDeleteMutation.isPending}
                  >
                    <Trash2 className='mr-2 h-4 w-4' /> Xóa tạm ({selectedIds.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Chuyển {selectedIds.size} người dùng vào thùng rác?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Họ sẽ không thể đăng nhập cho đến khi được khôi phục.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-red-600 hover:bg-red-700'
                      onClick={() => batchSoftDeleteMutation.mutate(Array.from(selectedIds))}
                    >
                      Xóa tạm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}

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

        <div className='flex gap-2 w-full md:w-auto'>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className='w-full md:w-[140px]'>
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
            <SelectTrigger className='w-full md:w-[140px]'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
              <SelectItem value={UserStatus.ACTIVE}>Hoạt động</SelectItem>
              <SelectItem value={UserStatus.PENDING}>Chờ duyệt</SelectItem>
              <SelectItem value={UserStatus.INACTIVE}>Không hoạt động</SelectItem>
              <SelectItem value={UserStatus.LOCKED}>Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='rounded-md border bg-white shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[40px]'>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label='Select all'
                />
              </TableHead>
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
                <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                  Không tìm thấy người dùng nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} data-state={selectedIds.has(user.id) && 'selected'}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={(checked) => handleSelectOne(user.id, checked as boolean)}
                      aria-label={`Select user ${user.id}`}
                    />
                  </TableCell>
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
                                <Eye className='mr-2 h-4 w-4' /> Xem
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/users/${user.id}?mode=edit`}
                                className='cursor-pointer'
                              >
                                <Edit className='mr-2 h-4 w-4' /> Sửa
                              </Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className='text-red-600 focus:text-red-600 cursor-pointer'
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className='mr-2 h-4 w-4' /> Xóa
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa tạm thời?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Người dùng này sẽ được chuyển vào thùng rác và có thể khôi phục
                                    sau.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => softDeleteMutation.mutate(user.id)}
                                    className='bg-red-600 hover:bg-red-700'
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => restoreMutation.mutate(user.id)}
                              className='cursor-pointer'
                            >
                              <RefreshCw className='mr-2 h-4 w-4' /> Khôi phục
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className='text-red-600 focus:text-red-600 cursor-pointer'
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className='mr-2 h-4 w-4' /> Xóa vĩnh viễn
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cảnh báo: Hành động không thể hoàn tác!
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Người dùng này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn có chắc
                                    chắn muốn tiếp tục?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => hardDeleteMutation.mutate(user.id)}
                                    className='bg-red-600 hover:bg-red-700'
                                  >
                                    Xóa vĩnh viễn
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

      {usersData?.data?.pagination && (
        <Pagination>
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
            {Array.from({ length: usersData?.data?.pagination?.totalPages || 0 }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href='#'
                  isActive={page === i}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(i)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault()
                  if (page < (usersData.data?.pagination?.totalPages || 1) - 1) setPage(page + 1)
                }}
                className={
                  page >= (usersData.data?.pagination?.totalPages || 1) - 1
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
