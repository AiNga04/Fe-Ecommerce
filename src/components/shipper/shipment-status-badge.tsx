import { cn } from '@/lib/utils'
import { ShipmentStatus } from '@/constants/enum/shipment-status'

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus
  className?: string
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
  [ShipmentStatus.PENDING_ASSIGN]: {
    label: 'Chờ gán',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  [ShipmentStatus.ASSIGNED]: {
    label: 'Đã gán',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  [ShipmentStatus.PICKED_UP]: {
    label: 'Đã lấy hàng',
    className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  [ShipmentStatus.IN_DELIVERY]: {
    label: 'Đang giao',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Thành công',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  [ShipmentStatus.FAILED]: {
    label: 'Thất bại',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  [ShipmentStatus.RETURN_APPROVED]: {
    label: 'Duyệt trả hàng',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  [ShipmentStatus.RETURNED]: {
    label: 'Đã hoàn trả',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
}

export function ShipmentStatusBadge({ status, className }: ShipmentStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
