import { NextResponse } from 'next/server'

const REFRESH_TOKEN_COOKIE = 'refreshToken'
const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export const setRefreshTokenCookie = (refreshToken: string) => {
  const response = NextResponse.json({ success: true })
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })
  return response
}

export const clearRefreshTokenCookie = () => {
  const response = NextResponse.json({ success: true })
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 0,
  })
  return response
}
