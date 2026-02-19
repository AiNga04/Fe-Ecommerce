'use client'

import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Loader2, UserPlus, UserCog, Key, Trash2, RefreshCw } from 'lucide-react'

export function UserAuditLogs() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-audit-logs'],
    queryFn: () => userService.getAuditLogs({ page: 0, size: 10 }),
  })

  const logs = data?.data?.data || []

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE')) return <UserPlus className='h-4 w-4 text-green-500' />
    if (action.includes('UPDATE')) return <UserCog className='h-4 w-4 text-blue-500' />
    if (action.includes('PASSWORD')) return <Key className='h-4 w-4 text-orange-500' />
    if (action.includes('DELETE')) return <Trash2 className='h-4 w-4 text-red-500' />
    if (action.includes('RESTORE')) return <RefreshCw className='h-4 w-4 text-green-500' />
    return <UserCog className='h-4 w-4 text-slate-500' />
  }

  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>Hoạt động người dùng</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <ScrollArea className='h-[350px] pr-4'>
            <div className='space-y-6'>
              {logs.length === 0 ? (
                <p className='text-center text-sm text-muted-foreground'>Chưa có hoạt động nào.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className='flex items-start gap-4'>
                    <div className='mt-1 p-2 bg-slate-100 rounded-full'>
                      {getActionIcon(log.action)}
                    </div>
                    <div className='space-y-1 flex-1'>
                      <p className='text-sm font-medium leading-none'>
                        {log.action} <span className='text-muted-foreground font-normal'>bởi</span>{' '}
                        {log.actorEmail}
                      </p>
                      <p className='text-xs text-muted-foreground'>{log.detail}</p>
                      <p className='text-xs text-slate-400'>Target: {log.userEmail}</p>
                    </div>
                    <div className='text-xs text-muted-foreground whitespace-nowrap'>
                      {format(new Date(log.createdAt), 'dd/MM HH:mm')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
