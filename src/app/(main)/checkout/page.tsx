'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { cartService } from '@/services/cart'
import { addressService } from '@/services/address'
import { voucherService } from '@/services/voucher'
import { Voucher } from '@/types/voucher'
import { orderService } from '@/services/order'
import { paymentService } from '@/services/payment'
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
import { Badge } from '@/components/ui/badge'
import { MapPin, CreditCard, Ticket, ChevronRight, Truck, CheckCircle2 } from 'lucide-react'
import { LoadingOverlay } from '@/components/common/loading-overlay'
import { CITIES } from '@/constants/locations'
import { useCartStore } from '@/store/cart'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemsParam = searchParams.get('items')

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState(1) // 1: Info, 2: Payment/Voucher, 3: Confirm

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
            setOrderItems(allItems)
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
        const vRes = await voucherService.listActive()
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
      shippingDiscount = Math.min(shippingDiscount, shippingFee)
    }
  }

  const totalPayment = Math.max(0, subtotal + shippingFee - discountAmount - shippingDiscount)
  const getProvinceLabel = (code: string) => CITIES.find((c) => c.value === code)?.label || code

  const validateAddress = () => {
    if (selectedAddressId === 'new') {
      if (
        !newAddress.receiverName ||
        !newAddress.receiverPhone ||
        !newAddress.detailAddress ||
        !newAddress.province ||
        !newAddress.district
      ) {
        toast.error('Vui lòng điền đầy đủ thông tin địa chỉ')
        return false
      }
    }
    return true
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateAddress()) return
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handleBackStep = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

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
        const addr = addresses.find((a) => a.id === selectedAddressId)
        if (addr) {
          payload.shippingName = addr.receiverName
          payload.shippingPhone = addr.receiverPhone
        }
      } else {
        if (!validateAddress()) {
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
        fetchGlobalCartCount()
        // Assuming res.data.data contains the Order object with an 'id'
        const orderData = res.data.data

        if (paymentMethod === 'ONLINE' && orderData?.id) {
          try {
            const paymentRes = await paymentService.createVnPayUrl(orderData.id)
            if (paymentRes.data.success && paymentRes.data.data) {
              window.location.href = paymentRes.data.data
            } else {
              toast.error('Không thể tạo link thanh toán VNPay')
              router.push('/checkout/success') // Still consider success but payment pending?
            }
          } catch (paymentError) {
            console.error(paymentError)
            toast.error('Lỗi khi tạo giao dịch thanh toán')
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

  if (loading || processing) return <LoadingOverlay visible={true} />

  if (orderItems.length === 0) {
    return (
      <div className='container max-w-10xl mx-auto px-4 py-20 text-center'>
        <h2 className='text-xl font-bold'>Không tìm thấy sản phẩm nào để thanh toán</h2>
        <Button asChild className='mt-4'>
          <Link href='/carts'>Quay lại giỏ hàng</Link>
        </Button>
      </div>
    )
  }

  // --- RENDERING HELPERS for STEPS ---

  // STEP 1: Address & Product Review
  const renderStep1 = () => (
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-right-4 duration-300'>
      <div className='lg:col-span-8 space-y-6'>
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
                  <RadioGroupItem value={String(addr.id)} id={`addr-${addr.id}`} className='mt-1' />
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

          {(selectedAddressId === 'new' || addresses.length === 0) && (
            <div className='grid gap-4 border p-5 rounded-xl bg-gray-50 mt-2'>
              {/* Add new address form inputs */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>Tên người nhận</Label>
                  <Input
                    value={newAddress.receiverName}
                    onChange={(e) => setNewAddress({ ...newAddress, receiverName: e.target.value })}
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
              {/* Location selects */}
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
                  onChange={(e) => setNewAddress({ ...newAddress, detailAddress: e.target.value })}
                  placeholder='Số nhà, tên đường...'
                />
              </div>
            </div>
          )}
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm'>
          <h3 className='font-bold text-lg mb-4'>Sản phẩm ({orderItems.length})</h3>
          <div className='divide-y'>
            {orderItems.map((item) => (
              <div key={item.id} className='flex gap-4 py-4 first:pt-0 last:pb-0'>
                <div className='relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0'>
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
                  <p className='text-sm text-gray-500'>
                    Size: {item.sizeName} | x{item.quantity}
                  </p>
                  <p className='font-bold text-primary mt-1'>{formatCurrency(item.subtotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Side */}
      <div className='lg:col-span-4 space-y-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm space-y-4 sticky top-24'>
          <h3 className='font-bold text-lg'>Tóm tắt đơn hàng</h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex justify-between'>
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <Button className='w-full' size='lg' onClick={handleNextStep}>
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )

  // STEP 2: Payment & Voucher
  const renderStep2 = () => (
    <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-right-4 duration-300'>
      <div className='lg:col-span-8 space-y-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm space-y-4'>
          <h3 className='font-bold flex items-center gap-2'>
            <Ticket className='w-4 h-4' /> Voucher & Ưu đãi
          </h3>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <Label>Voucher Giảm giá</Label>
              <Select
                value={selectedVoucherId ? String(selectedVoucherId) : 'none'}
                onValueChange={(v) => setSelectedVoucherId(v === 'none' ? null : Number(v))}
              >
                <SelectTrigger className='w-full'>
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
                        disabled={subtotal < (v.minOrderValue || 0)}
                      >
                        {v.code} - {v.name} (Min: {formatCurrency(v.minOrderValue || 0)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Mã Freeship</Label>
              <Select
                value={selectedShippingVoucherId ? String(selectedShippingVoucherId) : 'none'}
                onValueChange={(v) => setSelectedShippingVoucherId(v === 'none' ? null : Number(v))}
              >
                <SelectTrigger className='w-full'>
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
                        disabled={subtotal < (v.minOrderValue || 0)}
                      >
                        {v.code} - {v.name} (Min: {formatCurrency(v.minOrderValue || 0)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm space-y-4'>
          <h3 className='font-bold flex items-center gap-2'>
            <CreditCard className='w-4 h-4' /> Phương thức thanh toán
          </h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v: any) => setPaymentMethod(v)}
            className='grid gap-3'
          >
            <div
              className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer ${paymentMethod === 'CASH_ON_DELIVERY' ? 'border-primary bg-primary/5' : ''}`}
            >
              <RadioGroupItem value='CASH_ON_DELIVERY' id='cod' />
              <Label htmlFor='cod' className='flex-1 cursor-pointer font-medium'>
                Thanh toán khi nhận hàng (COD)
              </Label>
            </div>
            <div
              className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : ''}`}
            >
              <RadioGroupItem value='ONLINE' id='online' />
              <Label htmlFor='online' className='flex-1 cursor-pointer font-medium'>
                Thanh toán Online (VNPay)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className='lg:col-span-4 space-y-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm space-y-4 sticky top-24'>
          <h3 className='font-bold text-lg'>Tóm tắt chi phí</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span>Hàng hóa</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Vận chuyển</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
            {discountAmount > 0 && (
              <div className='flex justify-between text-green-600'>
                <span>Voucher</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            {shippingDiscount > 0 && (
              <div className='flex justify-between text-green-600'>
                <span>Freeship</span>
                <span>-{formatCurrency(shippingDiscount)}</span>
              </div>
            )}
            <div className='border-t pt-2 flex justify-between font-bold text-lg'>
              <span>Tổng</span>
              <span className='text-primary'>{formatCurrency(totalPayment)}</span>
            </div>
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' className='flex-1' onClick={handleBackStep}>
              Quay lại
            </Button>
            <Button className='flex-1' onClick={handleNextStep}>
              Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // STEP 3: Final Confirmation
  const renderStep3 = () => (
    <div className='max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300'>
      <div className='bg-white p-8 rounded-2xl shadow-sm border space-y-8'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold text-gray-900'>Xác nhận đặt hàng</h2>
          <p className='text-gray-500'>Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900 border-b pb-2'>Thông tin giao hàng</h3>
            <div className='text-sm space-y-1 text-gray-600'>
              <p className='font-medium text-gray-900'>
                {selectedAddressId === 'new'
                  ? newAddress.receiverName
                  : addresses.find((a) => a.id === selectedAddressId)?.receiverName}
              </p>
              <p>
                {selectedAddressId === 'new'
                  ? newAddress.receiverPhone
                  : addresses.find((a) => a.id === selectedAddressId)?.receiverPhone}
              </p>
              <p>
                {selectedAddressId === 'new'
                  ? `${newAddress.detailAddress}, ${newAddress.ward}, ${newAddress.district}, ${getProvinceLabel(newAddress.province)}`
                  : addresses.find((a) => a.id === selectedAddressId)?.fullAddress}
              </p>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900 border-b pb-2'>Phương thức thanh toán</h3>
            <p className='text-sm text-gray-600 font-medium'>
              {paymentMethod === 'CASH_ON_DELIVERY'
                ? 'Thanh toán khi nhận hàng (COD)'
                : 'Thanh toán Online qua VNPay'}
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='font-semibold text-gray-900 border-b pb-2'>
            Sản phẩm ({orderItems.length})
          </h3>
          <div className='space-y-3 max-h-60 overflow-y-auto pr-2'>
            {orderItems.map((item) => (
              <div key={item.id} className='flex justify-between text-sm'>
                <span className='line-clamp-1 flex-1 pr-4'>
                  {item.productName} ({item.sizeName}) x{item.quantity}
                </span>
                <span className='font-medium'>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-gray-50 p-6 rounded-xl space-y-3'>
          <div className='flex justify-between'>
            <span>Tổng tiền hàng</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className='flex justify-between'>
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(shippingFee)}</span>
          </div>
          {discountAmount > 0 && (
            <div className='flex justify-between text-green-600'>
              <span>Voucher</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {shippingDiscount > 0 && (
            <div className='flex justify-between text-green-600'>
              <span>Freeship</span>
              <span>-{formatCurrency(shippingDiscount)}</span>
            </div>
          )}
          <div className='border-t border-gray-200 pt-3 flex justify-between items-end'>
            <span className='font-bold text-lg'>Tổng thanh toán</span>
            <span className='font-bold text-2xl text-primary'>{formatCurrency(totalPayment)}</span>
          </div>
        </div>

        <div className='flex gap-4 pt-4'>
          <Button variant='outline' size='lg' className='flex-1 h-12' onClick={handleBackStep}>
            Quay lại
          </Button>
          <Button
            size='lg'
            className='flex-1 h-12 font-bold text-base shadow-lg shadow-primary/25'
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className='container max-w-10xl mx-auto px-4 py-8 bg-gray-50 min-h-screen'>
      {/* Stepper Header */}
      <div className='mb-8 max-w-3xl mx-auto'>
        <div className='flex items-center justify-between relative z-10'>
          <div
            className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= 1 ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300'}`}
            >
              1
            </div>
            <span className='text-xs font-semibold uppercase tracking-wider'>Thông tin</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}
          />
          <div
            className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= 2 ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300'}`}
            >
              2
            </div>
            <span className='text-xs font-semibold uppercase tracking-wider'>Thanh toán</span>
          </div>
          <div
            className={`flex-1 h-0.5 mx-4 transition-colors ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}
          />
          <div
            className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= 3 ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300'}`}
            >
              3
            </div>
            <span className='text-xs font-semibold uppercase tracking-wider'>Xác nhận</span>
          </div>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
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
