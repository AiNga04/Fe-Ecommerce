'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { userService } from '@/services/user'
import { UserAuditLog } from '@/types/user'
import { format } from 'date-fns'
import {
  Activity,
  Loader2,
  User as UserIcon,
  Clock,
  Globe,
  ShieldCheck,
  AlertCircle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAuditLogsDialogProps {
  userId: number | null
  userName: string | null
  isOpen: boolean
  onClose: () => void
}

export function UserAuditLogsDialog({
  userId,
  userName,
  isOpen,
  onClose,
}: UserAuditLogsDialogProps) {
  const [logs, setLogs] = useState<UserAuditLog[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      const fetchLogs = async () => {
        setIsLoading(true)
        try {
          // Note: Backend might need optional userId filter in audit-logs
          // If not supported, we filter in frontend for current user
          const res = await userService.getAuditLogs({ page: 0, size: 50 })
          if (res.data.success) {
            const allLogs = res.data.data || []
            setLogs(allLogs.filter((log) => log.userId === userId))
          }
        } catch (error) {
          console.error('Fetch user audit logs error:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchLogs()
    }
  }, [isOpen, userId])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[700px] p-0 gap-0 overflow-hidden bg-white max-h-[90vh] flex flex-col'>
        <div className='bg-slate-900 p-6 text-white relative overflow-hidden shrink-0'>
          <div className='absolute top-0 right-0 p-4 opacity-10'>
            <Activity className='h-32 w-32 -mr-6 -mt-6' />
          </div>
          <div className='relative z-10'>
            <DialogTitle className='text-xl font-bold flex items-center gap-2'>
              Nhật ký hoạt động: <span className='text-blue-400'>{userName}</span>
            </DialogTitle>
            <DialogDescription className='text-slate-400 mt-1'>
              Theo dõi toàn bộ lịch sử thao tác của người dùng #{userId} trên hệ thống
            </DialogDescription>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px]'>
          {isLoading ? (
            <div className='py-24 flex flex-col justify-center items-center gap-3'>
              <Loader2 className='w-10 h-10 animate-spin text-blue-600' />
              <p className='text-sm text-slate-500 animate-pulse'>Đang tải dữ liệu...</p>
            </div>
          ) : logs.length > 0 ? (
            <div className='relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-blue-100 before:via-slate-100 before:to-transparent'>
              {logs.map((log) => (
                <div key={log.id} className='relative flex items-start gap-4 group'>
                  <div className='absolute left-0 mt-1.5 w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-slate-100 shadow-sm z-10 group-hover:border-blue-200 transition-colors'>
                    <Clock className='w-4 h-4 text-blue-500' />
                  </div>

                  <div className='ml-12 flex-1 pt-1'>
                    <div className='bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-100'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600'>
                          {log.action}
                        </span>
                        <span className='text-[10px] text-slate-400 font-medium'>
                          {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                        </span>
                      </div>

                      <div className='text-sm text-slate-700 leading-relaxed font-medium mb-3'>
                        {log.detail || 'Không có chi tiết'}
                      </div>

                      <div className='flex items-center gap-4 pt-3 border-t border-slate-50'>
                        <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                          <Globe className='w-3 h-3' />
                          <span>{log.ipAddress || 'Unknown IP'}</span>
                        </div>
                        <div className='flex items-center gap-1.5 text-xs text-slate-400'>
                          <ShieldCheck className='w-3 h-3' />
                          <span>Actor ID: {log.actorId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-20 flex flex-col justify-center items-center text-slate-400 space-y-3 italic'>
              <div className='h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center'>
                <Info className='w-8 h-8 opacity-20' />
              </div>
              <p>Chưa ghi nhận hoạt động nào cho người dùng này</p>
            </div>
          )}
        </div>

        <div className='p-4 bg-slate-50 border-t shrink-0 flex justify-between items-center px-6'>
          <p className='text-[11px] text-slate-400 uppercase tracking-widest font-bold'>
            END OF ACTIVITY LOG
          </p>
          <button
            onClick={onClose}
            className='text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors'
          >
            Đóng
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
