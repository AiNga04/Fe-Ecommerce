'use client'

import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileUp, AlertCircle, CheckCircle2, X, FileJson, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { userService } from '@/services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserCreateRequest, Gender, Role, City } from '@/types/user'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BulkCreateDialogProps {
  trigger?: React.ReactNode
}

export function BulkCreateDialog({ trigger }: BulkCreateDialogProps) {
  const [open, setOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [parsedUsers, setParsedUsers] = useState<UserCreateRequest[]>([])
  const [failedUsers, setFailedUsers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('json')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: userService.createUsersBatch,
    onSuccess: (data) => {
      // data is AxiosResponse, data.data is IBackendRes, data.data.data is UserBatchCreateResponse
      const responseData = data.data?.data
      const created = responseData?.created || []
      const failed = responseData?.failed || []

      const successCount = created.length
      const failCount = failed.length

      if (successCount > 0) {
        toast.success(`Đã tạo thành công ${successCount} người dùng`)
        queryClient.invalidateQueries({ queryKey: ['admin-users'] })

        // If there are no failures, close the dialog
        if (failCount === 0) {
          setOpen(false)
          setJsonInput('')
          setParsedUsers([])
          setFailedUsers([])
          return
        }
      }

      if (failCount > 0) {
        toast.error(`Thất bại ${failCount} người dùng`, {
          description: 'Vui lòng xem chi tiết lỗi bên dưới.',
        })
        setFailedUsers(failed)
        setParsedUsers([]) // Clear pending imports?
      }
    },
    onError: (error) => {
      toast.error('Tạo người dùng thất bại')
      console.error(error)
    },
  })

  // Helper to normalize keys to lowercase to be more forgiving
  const normalizeKeys = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj

    // If array, map over it
    if (Array.isArray(obj)) return obj.map(normalizeKeys)

    const newObj: any = {}
    Object.keys(obj).forEach((key) => {
      const lowerKey = key.toLowerCase()
      const value = obj[key]

      newObj[lowerKey] = value

      // Handle "role" -> "roles" mapping specifically
      if (lowerKey === 'role') {
        // If "roles" doesn't exist yet (or we haven't processed it), create it
        if (!newObj['roles']) {
          newObj['roles'] = [value]
        }
      }

      // If we see "roles" explicitly, ensure it overrides or is used
      if (lowerKey === 'roles') {
        newObj['roles'] = Array.isArray(value) ? value : [value]
      }
    })
    return newObj
  }

  const validateAndParse = (data: any[]): UserCreateRequest[] => {
    return data.map((item) => {
      const normalized = normalizeKeys(item)

      // Use the normalized keys (all lowercase)
      // Note: UserCreateRequest expects SpecificCasing but our normalized obj has lowercase keys.
      // We need to map lowercase keys back to required fields if we normalized them.
      // Actually, let's keep it simple: normalizeKeys converts keys to lowercase.
      // So we access them via lowercase property names.

      let mappedRoles = [Role.USER]
      if (normalized.roles && Array.isArray(normalized.roles) && normalized.roles.length > 0) {
        mappedRoles = normalized.roles
      } else if (normalized.role) {
        mappedRoles = [normalized.role]
      }

      // Handle Excel Serial Date (number)
      let dob = normalized.dateofbirth || normalized['date of birth']
      if (typeof dob === 'number') {
        const date = new Date(Math.round((dob - 25569) * 86400 * 1000))
        // Check if valid date
        if (!isNaN(date.getTime())) {
          dob = date.toISOString().split('T')[0]
        }
      }

      // Handle Phone (number to string)
      let phone = normalized.phone
      if (typeof phone === 'number') {
        phone = phone.toString()
      }

      return {
        firstName: normalized.firstname || normalized['first name'] || '',
        lastName: normalized.lastname || normalized['last name'] || '',
        email: normalized.email || '',
        password: normalized.password || '123456',
        gender: (normalized.gender as Gender) || Gender.OTHER,
        dateOfBirth: dob,
        phone: phone,
        address: normalized.address,
        city: (normalized.city as City) || City.HO_CHI_MINH,
        roles: mappedRoles,
      } as UserCreateRequest
    })
  }

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      let data: any[] = []

      if (Array.isArray(parsed)) {
        data = parsed
      } else if (parsed.users && Array.isArray(parsed.users)) {
        data = parsed.users
      } else {
        toast.error('Dữ liệu không hợp lệ. Phải là mảng JSON hoặc object chứa mảng "users"')
        return
      }

      const users = validateAndParse(data)
      setParsedUsers(users)

      // If using JSON input, we perform mutation immediately (previous behavior for JSON tab?)
      // Wait, the previous code called mutate immediately for JSON.
      // Do we want to show preview for JSON too?
      // The previous code: setParsedUsers(users); mutate({ users });
      // Let's stick to that for now to avoid changing flow too much,
      // but maybe consistency with file upload (preview first) is better?
      // For now, assume immediate submit for JSON as per previous code.
      mutate({ users })
    } catch (e) {
      toast.error('Định dạng JSON không hợp lệ')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        const users = validateAndParse(data)
        setParsedUsers(users)
        toast.success(`Đã đọc được ${users.length} người dùng từ file`)

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = ''
      } catch (e) {
        toast.error('Đọc file thất bại')
        console.error(e)
      }
    }
    reader.readAsBinaryString(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant='outline'
            className='gap-2 bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
          >
            <FileUp className='h-4 w-4' /> Nhập từ Excel
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl bg-white p-0 overflow-hidden gap-0 rounded-2xl shadow-2xl'>
        {/* Header decoration */}
        <div className='bg-blue-600 p-6 text-white'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
              <FileJson className='h-8 w-8 text-white' />
            </div>
            <div>
              <DialogTitle className='text-xl font-bold'>Tạo Người Dùng Hàng Loạt</DialogTitle>
              <DialogDescription className='text-blue-100 mt-1'>
                Nhập dữ liệu người dùng nhanh chóng qua file Excel/CSV hoặc mã JSON.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className='p-6'>
          <Tabs
            defaultValue='file'
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6'>
              <TabsTrigger
                value='file'
                className='rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all'
              >
                <Upload className='mr-2 h-4 w-4' /> Tải file Excel/CSV
              </TabsTrigger>
              <TabsTrigger
                value='json'
                className='rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm transition-all'
              >
                <FileJson className='mr-2 h-4 w-4' /> Dán mã JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value='file' className='space-y-4 focus-visible:outline-none'>
              <div
                className='group relative border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300'
                onClick={() => fileInputRef.current?.click()}
              >
                <div className='p-4 bg-blue-50 text-blue-500 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-transform'>
                  <FileUp className='h-8 w-8' />
                </div>
                <div className='font-semibold text-slate-900 text-lg mb-1'>
                  Nhấn để tải lên hoặc kéo thả file
                </div>
                <div className='text-sm text-slate-500'>
                  Hỗ trợ định dạng .xlsx, .xls, .csv (Tối đa 5MB)
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  className='hidden'
                  accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                  onChange={handleFileUpload}
                />
              </div>

              <div className='bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 items-start'>
                <AlertCircle className='h-5 w-5 text-orange-600 mt-0.5 shrink-0' />
                <div className='text-sm text-orange-800'>
                  <p className='font-semibold mb-1'>Yêu cầu định dạng file:</p>
                  <p>
                    File cần có hàng tiêu đề (header) với các cột:{' '}
                    <code className='bg-white px-1 py-0.5 rounded border border-orange-200 text-orange-700 font-mono text-xs'>
                      email
                    </code>
                    ,{' '}
                    <code className='bg-white px-1 py-0.5 rounded border border-orange-200 text-orange-700 font-mono text-xs'>
                      firstName
                    </code>
                    ,{' '}
                    <code className='bg-white px-1 py-0.5 rounded border border-orange-200 text-orange-700 font-mono text-xs'>
                      lastName
                    </code>
                    .
                  </p>
                  <p className='mt-1 text-xs opacity-80'>
                    Các cột tùy chọn: phone, address, gender, dateOfBirth...
                  </p>
                </div>
              </div>

              {parsedUsers.length > 0 && activeTab === 'file' && (
                <div className='flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm animate-in fade-in slide-in-from-bottom-2'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-emerald-100 text-emerald-600 rounded-lg'>
                      <CheckCircle2 className='h-5 w-5' />
                    </div>
                    <span>
                      Đã đọc thành công{' '}
                      <span className='font-bold text-emerald-700 text-lg'>
                        {parsedUsers.length}
                      </span>{' '}
                      người dùng.
                    </span>
                  </div>
                  <Button
                    onClick={() => mutate({ users: parsedUsers })}
                    disabled={isPending}
                    className='bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-lg'
                  >
                    {isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang xử lý...
                      </>
                    ) : (
                      'Tiến hành Import'
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value='json' className='space-y-4 focus-visible:outline-none'>
              <div className='relative'>
                <Textarea
                  placeholder={`[
  {
    "firstName": "Nguyen",
    "lastName": "Van A",
    "email": "a.nguyen@example.com",
    "dateOfBirth": "1999-01-01",
    "gender": "MALE",
    "password": "password123",
    "role": "USER",
    "phone": "0988777666",
    "address": "123 Đường ABC",
    "city": "HO_CHI_MINH"
  }
]`}
                  className='h-[350px] font-mono text-sm border-slate-200 focus:border-purple-500 focus:ring-purple-500 bg-slate-50'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <div className='absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none'>
                  JSON Array Format
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleJsonSubmit}
                  disabled={isPending || !jsonInput.trim()}
                  className='w-full bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 shadow-lg'
                >
                  {isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang xử lý...
                    </>
                  ) : (
                    'Import từ JSON'
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>

          {failedUsers.length > 0 && (
            <div className='mt-6 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-bottom-4'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-bold text-red-600 flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4' />
                  Có {failedUsers.length} lỗi xảy ra
                </h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setFailedUsers([])}
                  className='text-slate-400 hover:text-slate-600 h-8 text-xs'
                >
                  Xóa danh sách lỗi
                </Button>
              </div>
              <ScrollArea className='h-[150px] w-full rounded-xl border border-red-100 bg-red-50/50 p-1'>
                <div className='space-y-1 p-1'>
                  {failedUsers.map((item, idx) => (
                    <div
                      key={idx}
                      className='flex items-start justify-between p-2.5 rounded-lg bg-white border border-red-100 shadow-sm'
                    >
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-semibold text-slate-800 text-sm'>
                          {item.email || 'Không rõ email'}
                        </span>
                        <span className='text-red-600 text-xs font-medium bg-red-50 w-fit px-1.5 py-0.5 rounded'>
                          {item.reason}
                        </span>
                      </div>
                      <div className='h-1.5 w-1.5 rounded-full bg-red-500 mt-2' />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
