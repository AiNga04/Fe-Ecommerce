export enum VoucherType {
  PERCENTAGE = 'PERCENTAGE', // Giảm theo %
  FIXED_AMOUNT = 'FIXED_AMOUNT', // Giảm số tiền cố định
  FREESHIP = 'FREESHIP', // Miễn phí vận chuyển
}

export enum VoucherScope {
  GLOBAL = 'GLOBAL', // Áp dụng toàn sàn
  CATEGORY = 'CATEGORY', // Áp dụng cho danh mục (future)
  PRODUCT = 'PRODUCT', // Áp dụng cho sản phẩm (future)
}

export enum VoucherStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export interface Voucher {
  id: number
  code: string
  name: string
  description?: string
  type: VoucherType
  scope: VoucherScope
  status: VoucherStatus
  discountValue: number
  maxDiscountAmount?: number
  minOrderValue?: number
  maxUsagePerUser?: number
  maxUsage?: number
  usedCount: number
  startDate?: string // ISO Date String
  endDate?: string // ISO Date String
  createdAt: string
  updatedAt: string
}

export interface VoucherCreateRequest {
  code: string
  name: string
  description?: string
  type: VoucherType
  scope?: VoucherScope
  discountValue: number
  maxDiscountAmount?: number
  minOrderValue?: number
  maxUsagePerUser?: number
  maxUsage?: number
  startDate?: string
  endDate?: string
}

export interface VoucherUpdateRequest {
  name?: string
  description?: string
  type?: VoucherType
  scope?: VoucherScope
  discountValue?: number
  maxDiscountAmount?: number
  minOrderValue?: number
  maxUsagePerUser?: number
  maxUsage?: number
  startDate?: string
  endDate?: string
  isActive?: boolean
}

export interface VoucherResponse extends Voucher {}
