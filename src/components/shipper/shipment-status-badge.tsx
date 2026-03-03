import { cn } from '@/lib/utils'
import { ShipmentStatus } from '@/constants/enum/shipment-status'

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus
  className?: string
}

const statusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
  [ShipmentStatus.PENDING_ASSIGN]: {
    label: 'Chờ gán',
    className: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  [ShipmentStatus.ASSIGNED]: {
    label: 'Đã gán',
    className: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  [ShipmentStatus.PICKED_UP]: {
    label: 'Đã lấy hàng',
    className: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  [ShipmentStatus.IN_DELIVERY]: {
    label: 'Đang giao',
    className: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Thành công',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  [ShipmentStatus.FAILED]: {
    label: 'Giao thất bại',
    className: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  [ShipmentStatus.RETURN_APPROVED]: {
    label: 'Duyệt trả hàng',
    className: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  [ShipmentStatus.RETURNED]: {
    label: 'Đã hoàn trả',
    className: 'bg-slate-50 text-slate-600 border-slate-100',
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
