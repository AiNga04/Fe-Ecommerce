'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { orderService } from '@/services/order'
import { getImageUrl } from '@/lib/utils'

export default function OrderPrintPage() {
  const params = useParams()
  const orderId = params.id as string
  const [isReadyToPrint, setIsReadyToPrint] = useState(false)

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => orderService.getAdminOrderById(orderId),
    enabled: !!orderId,
  })

  const order = orderData?.data?.data

  useEffect(() => {
    // Only trigger print when data is fully loaded and rendered
    if (order && !isLoading) {
      // Small timeout to ensure images and fonts are placed
      const timer = setTimeout(() => {
        setIsReadyToPrint(true)
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [order, isLoading])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-12 print:hidden'>
        <Loader2 className='w-8 h-8 animate-spin text-slate-300' />
        <span className='ml-3 text-slate-500'>Đang chuẩn bị hóa đơn...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='text-center p-12 text-slate-500 print:hidden'>
        <p>Không tìm thấy đơn hàng</p>
      </div>
    )
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  return (
    <div className='bg-white text-black min-h-screen p-8 max-w-4xl mx-auto text-sm print:p-0'>
      {/* Hide print button when actually printing */}
      {!isReadyToPrint && (
        <div className='mb-8 text-center print:hidden'>
          <p className='text-emerald-600 font-medium mb-2'>Hóa đơn đã sẵn sàng</p>
          <button
            onClick={() => window.print()}
            className='px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors'
          >
            In hóa đơn ngay
          </button>
        </div>
      )}

      {/* Header section */}
      <div className='flex justify-between items-start border-b border-slate-200 pb-6 mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight mb-1'>HÓA ĐƠN BÁN HÀNG</h1>
          <p className='text-slate-500'>Mã số: {order.code || `#${order.id}`}</p>
        </div>
        <div className='text-right'>
          <h2 className='text-xl flex font-bold justify-end items-center gap-2 tracking-tight'>
            <div className='bg-slate-900 w-6 h-6 rounded-sm'></div> E-Commerce
          </h2>
          <p className='text-slate-600 mt-2'>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      {/* Customer and Order Info block */}
      <div className='grid grid-cols-2 gap-8 mb-8'>
        <div>
          <h3 className='font-bold text-base mb-2 border-b border-slate-100 pb-2'>
            Thông tin khách hàng
          </h3>
          <p className='font-medium'>{order.shippingName}</p>
          <p className='text-slate-600 mt-1'>SĐT: {order.shippingPhone}</p>
          <p className='text-slate-600 mt-1 max-w-[250px] leading-relaxed'>
            Địa chỉ: {order.shippingAddress}
          </p>
        </div>
        <div>
          <h3 className='font-bold text-base mb-2 border-b border-slate-100 pb-2'>
            Thông tin đơn hàng
          </h3>
          <div className='grid grid-cols-2 gap-y-2 text-slate-600'>
            <span>Ngày đặt:</span>
            <span className='font-medium text-slate-900 text-right'>
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </span>

            <span>Thanh toán:</span>
            <span className='font-medium text-slate-900 text-right uppercase'>
              {order.paymentMethod === 'ONLINE' ? 'Online' : 'COD'}
            </span>

            {order.shippingCarrier && (
              <>
                <span>Đơn vị vận chuyển:</span>
                <span className='font-medium text-slate-900 text-right uppercase'>
                  {order.shippingCarrier}
                </span>
                {order.shippingTrackingCode && (
                  <>
                    <span>Mã vận đơn:</span>
                    <span className='font-mono font-medium text-slate-900 text-right tracking-tight'>
                      {order.shippingTrackingCode}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className='mb-8'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b-2 border-slate-900'>
              <th className='py-3 font-bold'>Sản phẩm</th>
              <th className='py-3 font-bold text-center'>Size</th>
              <th className='py-3 font-bold text-right'>Đơn giá</th>
              <th className='py-3 font-bold text-center'>SL</th>
              <th className='py-3 font-bold text-right'>Thành tiền</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200'>
            {order.items?.map((item: any) => (
              <tr key={`${item.productId}-${item.size}`}>
                <td className='py-4 font-medium max-w-[250px] truncate'>{item.productName}</td>
                <td className='py-4 text-center text-slate-600'>{item.size}</td>
                <td className='py-4 text-right text-slate-600'>
                  {formatCurrency(item.unitPrice || 0)}
                </td>
                <td className='py-4 text-center'>{item.quantity}</td>
                <td className='py-4 text-right font-medium'>
                  {formatCurrency(item.subtotal || (item.unitPrice || 0) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className='flex justify-end'>
        <div className='w-[350px] border border-slate-200 rounded-lg p-5'>
          <div className='flex justify-between items-center mb-3 text-slate-600'>
            <span>Tạm tính</span>
            <span className='font-medium text-slate-900'>
              {formatCurrency(
                (order.totalPrice || 0) -
                  (order.shippingFee || 0) +
                  (order.discountAmount || 0) +
                  (order.shippingDiscount || 0),
              )}
            </span>
          </div>

          <div className='flex justify-between items-center mb-3 text-slate-600'>
            <span>Phí vận chuyển</span>
            <span className='font-medium text-slate-900'>
              {formatCurrency(order.shippingFee || 0)}
            </span>
          </div>

          {(order.shippingDiscount > 0 || order.discountAmount > 0) && (
            <div className='flex justify-between items-center mb-3'>
              <span className='text-slate-600'>Giảm giá</span>
              <span className='font-medium text-slate-900'>
                -{formatCurrency((order.discountAmount || 0) + (order.shippingDiscount || 0))}
              </span>
            </div>
          )}

          <div className='border-t border-slate-200 mt-4 pt-4 flex justify-between items-center'>
            <span className='font-bold text-base'>Tổng thanh toán</span>
            <span className='font-bold text-xl'>{formatCurrency(order.totalPrice || 0)}</span>
          </div>
        </div>
      </div>

      {/* Note / Footer messages */}
      <div className='mt-16 text-center text-slate-500 border-t border-slate-200 pt-6'>
        <p className='font-medium mb-1'>Cảm ơn quý khách đã mua sắm tại E-Commerce!</p>
        <p className='text-xs'>
          Nếu có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ hotline: 1900-xxxx
        </p>
      </div>

      {/* CSS for printing rules */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `,
        }}
      />
    </div>
  )
}
