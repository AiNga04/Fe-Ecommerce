'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ArrowLeftRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ShipmentStatus } from '@/constants/enum/shipment-status'
import { shipmentService } from '@/services/shipment'

interface ShipmentActionsProps {
  shipmentId: number
  status: ShipmentStatus
  onSuccess?: () => void
}

export function ShipmentActions({ shipmentId, status, onSuccess }: ShipmentActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Dialog for Reason (Failed/Returned)
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false)
  const [reasonDialogType, setReasonDialogType] = useState<'FAILED' | 'RETURNED' | null>(null)
  const [reason, setReason] = useState('')

  // Dialog for Confirmation
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    action: () => Promise<any>
    message: string
    successMsg: string
  } | null>(null)

  const handleUpdateClick = (action: () => Promise<any>, successMsg: string, message: string) => {
    setConfirmConfig({ action, message, successMsg })
    setIsConfirmDialogOpen(true)
  }

  const executeUpdate = async () => {
    if (!confirmConfig) return
    try {
      setIsLoading(true)
      await confirmConfig.action()
      toast.success(confirmConfig.successMsg)
      setIsConfirmDialogOpen(false)
      onSuccess?.()
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
      setConfirmConfig(null)
    }
  }

  const handleReasonSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do')
      return
    }

    try {
      setIsLoading(true)
      if (reasonDialogType === 'FAILED') {
        await shipmentService.markFailed(shipmentId, { reason })
        toast.success('Đã cập nhật giao hàng thất bại')
      } else {
        await shipmentService.markReturned(shipmentId, { reason })
        toast.success('Đã xác nhận hoàn hàng')
      }
      setIsReasonDialogOpen(false)
      setReason('')
      onSuccess?.()
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-wrap gap-3'>
      {status === ShipmentStatus.ASSIGNED && (
        <Button
          className='w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700'
          onClick={() =>
            handleUpdateClick(
              () => shipmentService.markPickedUp(shipmentId),
              'Đã lấy hàng!',
              'Bạn xác nhận đã lấy hàng từ kho?',
            )
          }
          disabled={isLoading}
        >
          <PackageCheck className='w-4 h-4 mr-2' />
          Lấy hàng
        </Button>
      )}

      {status === ShipmentStatus.PICKED_UP && (
        <Button
          className='w-full sm:w-auto bg-orange-600 hover:bg-orange-700'
          onClick={() =>
            handleUpdateClick(
              () => shipmentService.markOutForDelivery(shipmentId),
              'Bắt đầu giao hàng!',
              'Bạn xác nhận bắt đầu đi giao đơn hàng này?',
            )
          }
          disabled={isLoading}
        >
          <Truck className='w-4 h-4 mr-2' />
          Bắt đầu giao
        </Button>
      )}

      {status === ShipmentStatus.IN_DELIVERY && (
        <>
          <Button
            className='flex-1 sm:flex-none bg-green-600 hover:bg-green-700'
            onClick={() =>
              handleUpdateClick(
                () => shipmentService.markDelivered(shipmentId),
                'Giao hàng thành công!',
                'Xác nhận khách đã nhận hàng và trả đủ tiền?',
              )
            }
            disabled={isLoading}
          >
            <CheckCircle2 className='w-4 h-4 mr-2' />
            Thành công
          </Button>
          <Button
            variant='destructive'
            className='flex-1 sm:flex-none'
            onClick={() => {
              setReasonDialogType('FAILED')
              setIsReasonDialogOpen(true)
            }}
            disabled={isLoading}
          >
            <XCircle className='w-4 h-4 mr-2' />
            Thất bại
          </Button>
        </>
      )}

      {status === ShipmentStatus.FAILED && (
        <>
          <Button
            className='flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700'
            onClick={() =>
              handleUpdateClick(
                () => shipmentService.markOutForDelivery(shipmentId),
                'Bắt đầu giao lại!',
                'Xác nhận đi giao lại đơn hàng này?',
              )
            }
            disabled={isLoading}
          >
            <RefreshCcw className='w-4 h-4 mr-2' />
            Giao lại
          </Button>
          <Button
            variant='outline'
            className='flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50'
            onClick={() => {
              setReasonDialogType('RETURNED')
              setIsReasonDialogOpen(true)
            }}
            disabled={isLoading}
          >
            <ArrowLeftRight className='w-4 h-4 mr-2' />
            Hoàn hàng
          </Button>
        </>
      )}

      {status === ShipmentStatus.RETURN_APPROVED && (
        <Button
          className='w-full sm:w-auto bg-purple-600 hover:bg-purple-700'
          onClick={() => {
            setReasonDialogType('RETURNED')
            setIsReasonDialogOpen(true)
          }}
          disabled={isLoading}
        >
          <ArrowLeftRight className='w-4 h-4 mr-2' />
          Lấy hàng hoàn
        </Button>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Xác nhận hành động</DialogTitle>
            <DialogDescription className='pt-2'>{confirmConfig?.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-6 gap-3 flex-row justify-end'>
            <Button
              variant='outline'
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isLoading}
              className='flex-1 sm:flex-none'
            >
              Hủy
            </Button>
            <Button
              onClick={executeUpdate}
              disabled={isLoading}
              className='flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700'
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reason Dialog (Failed/Returned) */}
      <Dialog open={isReasonDialogOpen} onOpenChange={setIsReasonDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {reasonDialogType === 'FAILED' ? 'Xác nhận giao hàng thất bại' : 'Xác nhận hoàn hàng'}
            </DialogTitle>
            <DialogDescription className='pt-2'>
              Vui lòng nhập lý do cụ thể để lưu vào hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Textarea
              placeholder='Nhập lý do...'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className='focus-visible:ring-orange-500'
            />
          </div>
          <DialogFooter className='gap-3 flex-row justify-end'>
            <Button
              variant='outline'
              onClick={() => setIsReasonDialogOpen(false)}
              disabled={isLoading}
              className='flex-1 sm:flex-none'
            >
              Hủy
            </Button>
            <Button
              onClick={handleReasonSubmit}
              disabled={isLoading}
              className='flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700'
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
