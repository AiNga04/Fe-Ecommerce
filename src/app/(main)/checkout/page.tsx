'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { cartService } from '@/services/cart'
import { addressService } from '@/services/address'
import { voucherService, Voucher } from '@/services/voucher'
import { orderService } from '@/services/order'
import { CartItem } from '@/types/cart'
import { Address } from '@/types/address'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MapPin, CreditCard, Ticket, ChevronRight, Truck } from 'lucide-react'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { CITIES } from '@/constants/locations'
import { useCartStore } from '@/store/cart'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemsParam = searchParams.get('items')

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])

  // Checkout State
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new')
  const [newAddress, setNewAddress] = useState({
    receiverName: '',
    receiverPhone: '',
    detailAddress: '',
    province: '',
    district: '',
    ward: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'ONLINE'>(
    'CASH_ON_DELIVERY',
  )

  // Vouchers
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null)
  const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState<number | null>(null)

  const fetchGlobalCartCount = useCartStore((state) => state.fetchCount)

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)

        // 1. Fetch Cart
        const cartRes = await cartService.getCart()
        if (cartRes.data.success && cartRes.data.data) {
          const allItems = cartRes.data.data

          if (!itemsParam) {
            setOrderItems(allItems) // Fallback if no params? Or empty?
          } else {
            const ids = itemsParam.split(',').map(Number)
            const filtered = allItems.filter((item) => ids.includes(item.id))
            setOrderItems(filtered)
          }
        }

        // 2. Fetch Addresses
        const addrRes = await addressService.getMyAddresses()
        if (addrRes.data.success && addrRes.data.data) {
          setAddresses(addrRes.data.data)
          const defaultAddr = addrRes.data.data.find((a) => a.default) || addrRes.data.data[0]
          if (defaultAddr) setSelectedAddressId(defaultAddr.id)
        }

        // 3. Fetch Vouchers
        const vRes = await voucherService.getActiveVouchers()
        if (vRes.data.success && vRes.data.data) {
          setVouchers(vRes.data.data)
        }
      } catch (error) {
        console.error(error)
        toast.error('Lỗi tải thông tin thanh toán')
        router.push('/carts')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Calculation Logic
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
  const shippingFee = subtotal > 500000 ? 0 : 30000

  // Voucher Logic
  const selectedVoucher = vouchers.find((v) => v.id === selectedVoucherId)
  const selectedShippingVoucher = vouchers.find((v) => v.id === selectedShippingVoucherId)

  let discountAmount = 0
  if (selectedVoucher) {
    if (selectedVoucher.type === 'FIXED_AMOUNT') {
      discountAmount = selectedVoucher.discountValue
    } else if (selectedVoucher.type === 'PERCENTAGE') {
      discountAmount = (subtotal * selectedVoucher.discountValue) / 100
      if (selectedVoucher.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, selectedVoucher.maxDiscountAmount)
      }
    }
  }

  let shippingDiscount = 0
  if (selectedShippingVoucher) {
    if (selectedShippingVoucher.type === 'FREESHIP') {
      shippingDiscount = selectedShippingVoucher.discountValue
      // Usually max discount value for freeship
      // Let's assume current logic supports full or partial
      shippingDiscount = Math.min(shippingDiscount, shippingFee)
    }
  }

  const totalPayment = Math.max(0, subtotal + shippingFee - discountAmount - shippingDiscount)

  const handleCheckout = async () => {
    try {
      setProcessing(true)

      const payload: any = {
        cartItemIds: orderItems.map((i) => i.id),
        paymentMethod,
        voucherCode: selectedVoucher?.code,
        shippingVoucherCode: selectedShippingVoucher?.code,
      }

      if (selectedAddressId !== 'new') {
        payload.shippingAddressId = selectedAddressId
        // Re-validate consistency? Backend should handle.
        const addr = addresses.find((a) => a.id === selectedAddressId)
        if (addr) {
          payload.shippingName = addr.receiverName // Optional if backend uses ID
          payload.shippingPhone = addr.receiverPhone
        }
      } else {
        if (
          !newAddress.receiverName ||
          !newAddress.receiverPhone ||
          !newAddress.detailAddress ||
          !newAddress.province ||
          !newAddress.district
        ) {
          toast.error('Vui lòng điền đầy đủ thông tin giao hàng')
          setProcessing(false)
          return
        }
        payload.shippingName = newAddress.receiverName
        payload.shippingPhone = newAddress.receiverPhone
        const provinceLabel =
          CITIES.find((c) => c.value === newAddress.province)?.label || newAddress.province
        payload.shippingAddress = `${newAddress.detailAddress}, ${newAddress.ward}, ${newAddress.district}, ${provinceLabel}`
      }

      const res = await orderService.checkoutCart(payload)

      if (res.data.success) {
        fetchGlobalCartCount() // Update cart badge
        if (paymentMethod === 'ONLINE') {
          const paymentUrl = res.data.data // As per user request, data is the URL
          if (typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
            window.location.href = paymentUrl
          } else {
            toast.success('Đặt hàng thành công, nhưng không tìm thấy link thanh toán')
            router.push('/checkout/success')
          }
        } else {
          router.push('/checkout/success')
        }
      } else {
        toast.error(res.data.message || 'Đặt hàng thất bại')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng')
    } finally {
      setProcessing(false)
    }
  }

  const getProvinceLabel = (code: string) => CITIES.find((c) => c.value === code)?.label || code

  if (loading) return <LoadingOverlay />

  if (orderItems.length === 0) {
    return (
      <div className='container max-w-7xl mx-auto px-4 py-20 text-center'>
        <h2 className='text-xl font-bold'>Không tìm thấy sản phẩm nào để thanh toán</h2>
        <Button asChild className='mt-4'>
          <Link href='/carts'>Quay lại giỏ hàng</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
        <Link href='/carts' className='hover:text-primary'>
          Giỏ hàng
        </Link>
        <ChevronRight className='w-4 h-4' />
        <span className='font-semibold text-gray-900'>Thanh toán</span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* LEFT COLUMN: Address & Products */}
        <div className='lg:col-span-8 space-y-6'>
          {/* 1. Address Section */}
          <div className='bg-white p-6 rounded-xl shadow-sm space-y-4'>
            <h3 className='font-bold text-lg flex items-center gap-2 text-primary'>
              <MapPin className='w-5 h-5' /> Địa chỉ nhận hàng
            </h3>

            {addresses.length > 0 && (
              <RadioGroup
                value={String(selectedAddressId)}
                onValueChange={(v) => setSelectedAddressId(v === 'new' ? 'new' : Number(v))}
                className='grid gap-3'
              >
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex items-start space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-300'}`}
                  >
                    <RadioGroupItem
                      value={String(addr.id)}
                      id={`addr-${addr.id}`}
                      className='mt-1'
                    />
                    <Label htmlFor={`addr-${addr.id}`} className='cursor-pointer flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-gray-900'>{addr.receiverName}</span>
                        <span className='text-gray-500'>|</span>
                        <span className='text-gray-600'>{addr.receiverPhone}</span>
                        {addr.default && (
                          <Badge variant='secondary' className='text-[10px] ml-2'>
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <div className='text-sm text-gray-500 mt-1'>
                        {addr.fullAddress ||
                          `${addr.detailAddress}, ${addr.ward}, ${addr.district}, ${getProvinceLabel(addr.province)}`}
                      </div>
                    </Label>
                  </div>
                ))}

                <div
                  className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-300'}`}
                >
                  <RadioGroupItem value='new' id='addr-new' />
                  <Label htmlFor='addr-new' className='cursor-pointer font-medium'>
                    Sử dụng địa chỉ mới
                  </Label>
                </div>
              </RadioGroup>
            )}

            {/* New Address Form */}
            {(selectedAddressId === 'new' || addresses.length === 0) && (
              <div className='grid gap-4 border p-5 rounded-xl bg-gray-50 mt-2 animate-in fade-in zoom-in-95 duration-200'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Tên người nhận</Label>
                    <Input
                      value={newAddress.receiverName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, receiverName: e.target.value })
                      }
                      placeholder='VD: Nguyễn Văn A'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Số điện thoại</Label>
                    <Input
                      value={newAddress.receiverPhone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, receiverPhone: e.target.value })
                      }
                      placeholder='09xx...'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Label>Tỉnh/Thành phố</Label>
                    <Select
                      value={newAddress.province}
                      onValueChange={(v) => setNewAddress({ ...newAddress, province: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn Tỉnh/Thành' />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label>Quận/Huyện</Label>
                    <Input
                      value={newAddress.district}
                      onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                      placeholder='Quận/Huyện'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Phường/Xã</Label>
                    <Input
                      value={newAddress.ward}
                      onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                      placeholder='Phường/Xã'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Địa chỉ cụ thể</Label>
                  <Input
                    value={newAddress.detailAddress}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, detailAddress: e.target.value })
                    }
                    placeholder='Số nhà, tên đường...'
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Product List */}
          <div className='bg-white p-6 rounded-xl shadow-sm'>
            <h3 className='font-bold text-lg mb-4'>Sản phẩm ({orderItems.length})</h3>
            <div className='divide-y'>
              {orderItems.map((item) => (
                <div key={item.id} className='flex gap-4 py-4 first:pt-0 last:pb-0'>
                  <div className='relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0'>
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.productName}
                      fill
                      className='object-cover'
                      unoptimized
                    />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-medium text-gray-900 line-clamp-1'>{item.productName}</h4>
                    <p className='text-sm text-gray-500 mt-1'>Size: {item.sizeName}</p>
                    <div className='flex justify-between items-center mt-2'>
                      <span className='text-sm text-gray-600'>x{item.quantity}</span>
                      <span className='font-bold text-primary'>
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Payment */}
        <div className='lg:col-span-4 space-y-6'>
          {/* Voucher Section */}
          <div className='bg-white p-6 rounded-xl shadow-sm space-y-4'>
            <h3 className='font-bold flex items-center gap-2'>
              <Ticket className='w-4 h-4' /> Voucher & Ưu đãi
            </h3>

            {/* Shop Voucher */}
            <div className='space-y-2'>
              <Label className='text-xs uppercase text-muted-foreground font-bold'>
                Voucher Giảm giá
              </Label>
              <Select
                value={selectedVoucherId ? String(selectedVoucherId) : 'none'}
                onValueChange={(v) => setSelectedVoucherId(v === 'none' ? null : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn mã giảm giá' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>Không sử dụng</SelectItem>
                  {vouchers
                    .filter((v) => v.type !== 'FREESHIP')
                    .map((v) => (
                      <SelectItem
                        key={v.id}
                        value={String(v.id)}
                        disabled={subtotal < v.minOrderValue}
                      >
                        <div className='flex flex-col text-left'>
                          <span className='font-medium'>
                            {v.code} - {v.name}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            Đơn tối thiểu {formatCurrency(v.minOrderValue)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shipping Voucher */}
            <div className='space-y-2'>
              <Label className='text-xs uppercase text-muted-foreground font-bold'>
                Mã Freeship
              </Label>
              <Select
                value={selectedShippingVoucherId ? String(selectedShippingVoucherId) : 'none'}
                onValueChange={(v) => setSelectedShippingVoucherId(v === 'none' ? null : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn mã miễn phí vận chuyển' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>Không sử dụng</SelectItem>
                  {vouchers
                    .filter((v) => v.type === 'FREESHIP')
                    .map((v) => (
                      <SelectItem
                        key={v.id}
                        value={String(v.id)}
                        disabled={subtotal < v.minOrderValue}
                      >
                        <div className='flex flex-col text-left'>
                          <span className='font-medium'>
                            {v.code} - {v.name}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            Đơn tối thiểu {formatCurrency(v.minOrderValue)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total Summary */}
          <div className='bg-white p-6 rounded-xl shadow-sm space-y-4'>
            <h3 className='font-bold flex items-center gap-2'>
              <BanknoteIcon className='w-4 h-4' /> Chi tiết thanh toán
            </h3>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Tổng tiền hàng</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Phí vận chuyển</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Giảm giá Voucher</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              {shippingDiscount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Giảm phí vận chuyển</span>
                  <span>-{formatCurrency(shippingDiscount)}</span>
                </div>
              )}

              <div className='border-t pt-3 flex justify-between items-end'>
                <span className='font-bold text-lg'>Tổng thanh toán</span>
                <div className='text-right'>
                  <div className='text-xl font-bold text-primary'>
                    {formatCurrency(totalPayment)}
                  </div>
                  <div className='text-xs text-gray-500'>(Đã bao gồm VAT)</div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='space-y-3 pt-2'>
              <Label className='font-semibold'>Phương thức thanh toán</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v: any) => setPaymentMethod(v)}
                className='grid gap-3'
              >
                <div
                  className={`flex items-center space-x-3 border p-3 rounded-lg cursor-pointer ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-primary bg-primary/5' : ''}`}
                >
                  <RadioGroupItem value='CASH_ON_DELIVERY' id='cod' />
                  <Label htmlFor='cod' className='flex-1 cursor-pointer font-medium'>
                    Thanh toán khi nhận hàng (COD)
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-3 border p-3 rounded-lg cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : ''}`}
                >
                  <RadioGroupItem value='ONLINE' id='online' />
                  <Label htmlFor='online' className='flex-1 cursor-pointer font-medium'>
                    Thanh toán Online (VNPay)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className='w-full h-12 text-base font-bold shadow-lg shadow-primary/20'
              size='lg'
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BanknoteIcon({ className }: { className?: string }) {
  return <CreditCard className={className} />
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <CheckoutContent />
    </Suspense>
  )
}
