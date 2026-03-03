'use client'

import React, { useEffect, useState } from 'react'
import { userService } from '@/services/user'
import { User, UserStatus } from '@/types/user'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Activity, Mail, Phone, RefreshCcw, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { getImageUrl } from '@/lib/utils'
import { UserAuditLogsDialog } from '@/components/staff/users/audit-logs-dialog'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StaffUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('active')
  const [page, setPage] = useState(0)

  // Audit logs dialog state
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
      // Map search to email as fallback search
      const params = {
        page,
        size: 10,
        email: search || undefined,
        status: activeTab === 'deleted' ? UserStatus.DELETED : undefined,
      }

      const res =
        activeTab === 'active'
          ? await userService.searchUsers(params)
          : await userService.getDeletedUsers(params)

      if (res.data.success) {
        setUsers(res.data.data || [])
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
  }, [activeTab, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return (
          <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none'>
            Hoạt động
          </Badge>
        )
      case UserStatus.DISABLED:
        return (
          <Badge className='bg-slate-100 text-slate-700 hover:bg-slate-100 border-none'>
            Đã vô hiệu
          </Badge>
        )
      case UserStatus.DELETED:
        return (
          <Badge className='bg-rose-100 text-rose-700 hover:bg-rose-100 border-none'>Đã xóa</Badge>
        )
      case UserStatus.PENDING:
        return (
          <Badge className='bg-amber-100 text-amber-700 hover:bg-amber-100 border-none'>
            Chờ xử lý
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const handleRestore = async (id: number) => {
    try {
      const res = await userService.restoreUser(id)
      if (res.data.success) {
        toast.success('Khôi phục người dùng thành công')
        fetchUsers()
      }
    } catch (error) {
      toast.error('Không thể khôi phục người dùng')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý Người dùng</h1>
          <p className='text-slate-500 text-sm'>
            Theo dõi và quản lý tài khoản người dùng trong hệ thống (Staff View)
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <div className='flex items-center justify-between mb-4'>
          <TabsList className='bg-slate-100 p-1'>
            <TabsTrigger
              value='active'
              className='data-[state=active]:bg-white data-[state=active]:shadow-sm'
            >
              Người dùng
            </TabsTrigger>
            <TabsTrigger
              value='deleted'
              className='data-[state=active]:bg-white data-[state=active]:shadow-sm'
            >
              Đã xóa tạm thời
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSearch} className='flex items-center gap-2'>
            <div className='relative w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <Input
                placeholder='Tìm theo email...'
                className='pl-10 h-9 bg-white'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type='submit' size='sm' className='bg-blue-600 hover:bg-blue-700 h-9'>
              Tìm
            </Button>
          </form>
        </div>

        <TabsContent value='active' className='mt-0'>
          <Card className='shadow-sm border-slate-200'>
            <CardContent className='p-0'>
              {isLoading && !users.length ? (
                <div className='py-20 flex justify-center'>
                  <LoadingOverlay visible={true} />
                </div>
              ) : (
                <div className='rounded-md overflow-hidden'>
                  <Table>
                    <TableHeader className='bg-slate-50/50'>
                      <TableRow>
                        <TableHead className='font-bold'>Người dùng</TableHead>
                        <TableHead className='font-bold'>Liên hệ</TableHead>
                        <TableHead className='font-bold'>Vai trò</TableHead>
                        <TableHead className='font-bold'>Trạng thái</TableHead>
                        <TableHead className='text-right font-bold'>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className='hover:bg-slate-50/30 transition-colors'>
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              <Avatar className='h-9 w-9 border border-slate-100'>
                                <AvatarImage src={getImageUrl(user.avatarUrl)} />
                                <AvatarFallback className='bg-slate-100 text-slate-500 font-bold'>
                                  {user.firstName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className='font-medium text-slate-900'>
                                  {user.lastName} {user.firstName}
                                </div>
                                <div className='text-xs text-slate-400'>ID: {user.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col gap-1'>
                              <div className='flex items-center text-xs text-slate-600 gap-1.5'>
                                <Mail className='w-3 h-3 text-slate-400' /> {user.email}
                              </div>
                              <div className='flex items-center text-xs text-slate-600 gap-1.5'>
                                <Phone className='w-3 h-3 text-slate-400' /> {user.phone || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-wrap gap-1'>
                              {user.roles?.map((role, idx) => (
                                <Badge
                                  key={idx}
                                  variant='outline'
                                  className='bg-blue-50 text-blue-700 border-blue-100 text-[10px]'
                                >
                                  {role}
                                </Badge>
                              )) || <Badge variant='outline'>USER</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className='text-right'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                              onClick={() =>
                                setAuditDialog({
                                  isOpen: true,
                                  userId: user.id,
                                  userName: `${user.lastName} ${user.firstName}`,
                                })
                              }
                            >
                              <Activity className='w-4 h-4 mr-1.5' />
                              Nhật ký
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {!users.length && (
                    <div className='py-12 text-center text-slate-400'>
                      Không tìm thấy người dùng nào
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='deleted' className='mt-0'>
          <Card className='shadow-sm border-slate-200'>
            <CardContent className='p-0'>
              <Table>
                <TableHeader className='bg-slate-50/50'>
                  <TableRow>
                    <TableHead className='font-bold'>Người dùng</TableHead>
                    <TableHead className='font-bold'>Email</TableHead>
                    <TableHead className='text-right font-bold'>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>
                        {user.lastName} {user.firstName}
                      </TableCell>
                      <TableCell className='text-slate-500 text-sm'>{user.email}</TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                          onClick={() => handleRestore(user.id)}
                        >
                          <RefreshCcw className='w-3 h-3 mr-1.5' />
                          Khôi phục
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!users.length && (
                    <TableRow>
                      <TableCell colSpan={3} className='py-12 text-center text-slate-400 italic'>
                        <ShieldAlert className='w-8 h-8 mx-auto mb-2 opacity-20' />
                        Danh sách người dùng đã xóa trống
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserAuditLogsDialog
        isOpen={auditDialog.isOpen}
        userId={auditDialog.userId}
        userName={auditDialog.userName}
        onClose={() => setAuditDialog({ ...auditDialog, isOpen: false })}
      />
    </div>
  )
}
