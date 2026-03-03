'use client'

import { useParams } from 'next/navigation'
import { OrderDetailContent } from '@/components/orders/order-detail-content'

export default function StaffOrderDetailPage() {
  const params = useParams()
  return <OrderDetailContent orderId={params.id as string} basePath='staff' />
}
