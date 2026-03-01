import Link from 'next/link'
import { MapPin, Phone, User, Package, ChevronRight, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ShipmentInfo } from '@/services/shipment'
import { ShipmentStatusBadge } from './shipment-status-badge'

interface ShipmentCardProps {
  shipment: ShipmentInfo
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  return (
    <Link href={`/shipper/shipments/${shipment.shipmentId}`}>
      <Card className='hover:border-orange-200 transition-colors group'>
        <CardContent className='p-4'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Package className='w-4 h-4 text-orange-600' />
              <span className='font-bold text-sm'>#{shipment.orderCode}</span>
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <div className='space-y-2 mb-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <User className='w-4 h-4 shrink-0' />
              <span className='truncate font-medium text-gray-900'>{shipment.shippingName}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Phone className='w-4 h-4 shrink-0' />
              <span>{shipment.shippingPhone}</span>
            </div>
            <div className='flex items-start gap-2 text-sm text-gray-600'>
              <MapPin className='w-4 h-4 shrink-0 mt-0.5' />
              <span className='line-clamp-2'>{shipment.shippingAddress}</span>
            </div>
          </div>

          <div className='flex items-center justify-between pt-3 border-t'>
            <div className='flex items-center gap-2'>
              {shipment.returnRequested && (
                <div className='flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded'>
                  <AlertCircle className='w-3 h-3' />
                  TRẢ HÀNG
                </div>
              )}
              <span className='text-[10px] text-gray-400 uppercase tracking-wider'>
                Lượt: {shipment.attempts}
              </span>
            </div>
            <div className='flex items-center text-xs font-medium text-orange-600 group-hover:translate-x-1 transition-transform'>
              Chi tiết <ChevronRight className='w-4 h-4' />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
