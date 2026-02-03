import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ReadonlyURLSearchParams } from 'next/navigation'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const cleanPath = path.startsWith('/') ? path : `/${path}`

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

  const host = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8080'
  return `${host}${cleanPath}`
}

export function getValidRedirectUrl(searchParams: ReadonlyURLSearchParams | null) {
  const redirectUrl = searchParams?.get('redirectUrl')
  // Basic validation: ensure it's a relative path to avoid open redirects
  if (redirectUrl && redirectUrl.startsWith('/')) {
    return redirectUrl
  }
  return null
}
