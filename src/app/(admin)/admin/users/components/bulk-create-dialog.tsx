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
import { Upload, FileUp, AlertCircle, CheckCircle2, X } from 'lucide-react'
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
        toast.success(`Successfully created ${successCount} users`)
      }

      if (failCount > 0) {
        toast.error(`Failed to create ${failCount} users`, {
          description: 'Check the console for details',
        })
        console.error('Failed users:', failed)
      }

      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] })
        setOpen(false)
        setJsonInput('')
        setParsedUsers([])
      }
    },
    onError: (error) => {
      toast.error('Failed to create users')
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
        toast.error('Input must be a JSON array or object with "users" array')
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
      toast.error('Invalid JSON format')
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
        toast.success(`Parsed ${users.length} users from file`)

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = ''
      } catch (e) {
        toast.error('Failed to parse file')
        console.error(e)
      }
    }
    reader.readAsBinaryString(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline'>
            <Upload className='mr-2 h-4 w-4' /> Bulk Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Bulk User Creation</DialogTitle>
          <DialogDescription>
            Import users via JSON paste or upload Excel/CSV file.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='json' value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='json'>Paste JSON</TabsTrigger>
            <TabsTrigger value='file'>Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value='json' className='space-y-4 py-4'>
            <div className='grid w-full gap-2'>
              <Textarea
                placeholder={`[
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "dateOfBirth": "2004-01-01",
    "gender": "FEMALE",
    "password": "123456",
    "role": "USER",
    "phone": "0988777666",
    "address": "123 Nguyen Van Linh",
    "city": "HO_CHI_MINH"
  }
]`}
                className='h-[300px] font-mono text-sm'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
              <p className='text-xs text-muted-foreground'>Paste a JSON array of user objects.</p>
            </div>
            <DialogFooter>
              <Button onClick={handleJsonSubmit} disabled={isPending || !jsonInput.trim()}>
                {isPending ? 'Processing...' : 'Import JSON'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value='file' className='space-y-4 py-4'>
            <div
              className='border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors'
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className='h-12 w-12 text-slate-400 mb-4' />
              <div className='font-medium text-slate-900'>Click to upload or drag and drop</div>
              <div className='text-sm text-slate-500 mt-1'>CSV, Excel (.xlsx, .xls) files</div>
              <input
                ref={fileInputRef}
                type='file'
                className='hidden'
                accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                onChange={handleFileUpload}
              />
            </div>

            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Format Requirements</AlertTitle>
              <AlertDescription>
                Ensure your file has headers matching the user fields: firstName, lastName, email,
              </AlertDescription>
            </Alert>

            {parsedUsers.length > 0 && activeTab === 'file' && (
              <div className='flex items-center justify-between bg-slate-50 p-3 rounded-md border text-sm'>
                <span>
                  Ready to import <span className='font-semibold'>{parsedUsers.length}</span> users
                  from file.
                </span>
                <Button
                  onClick={() => mutate({ users: parsedUsers })}
                  disabled={isPending}
                  size='sm'
                >
                  {isPending ? 'Importing...' : 'Import Users'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
