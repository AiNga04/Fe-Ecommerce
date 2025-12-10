'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Routers from '@/constants/routers'
import { AUTH_ME_QUERY_KEY } from '@/constants/query-keys'
import { refreshAccessToken } from '@/lib/http'
import { removeRefreshTokenCookie } from '@/lib/refresh-token-client'
import { authService } from '@/services/auth'
import { useAuthStore } from '@/store/auth'
import type { User } from '@/schemas/user/user'

const fetchMe = async () => {
  const res = await authService.me()
  return res.data.data as User
}

export function useAuthSession(options?: { redirectToLogin?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearAccessToken = useAuthStore((state) => state.clear)
  const [bootstrapping, setBootstrapping] = useState(!accessToken)

  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })

  // Clear cached user when token is dropped
  useEffect(() => {
    if (!accessToken) {
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY })
    }
  }, [accessToken, queryClient])

  // Bootstrap access token from refresh cookie on page load
  useEffect(() => {
    if (accessToken) {
      setBootstrapping(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const token = await refreshAccessToken()
        if (cancelled) return

        if (token) {
          setAccessToken(token)
          await queryClient.refetchQueries({ queryKey: AUTH_ME_QUERY_KEY })
        } else if (options?.redirectToLogin) {
          clearAccessToken()
          await removeRefreshTokenCookie()
          router.replace(`${Routers.LOGIN}?redirect=${encodeURIComponent(pathname)}`)
        }
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [accessToken, clearAccessToken, options?.redirectToLogin, pathname, queryClient, router, setAccessToken])

  // Redirect when user fetch fails (refresh cookie expired)
  useEffect(() => {
    if (!options?.redirectToLogin) return
    if (bootstrapping) return
    if (meQuery.isLoading || meQuery.isFetching) return
    if (!meQuery.isError) return

    clearAccessToken()
    void removeRefreshTokenCookie()
    router.replace(`${Routers.LOGIN}?redirect=${encodeURIComponent(pathname)}`)
  }, [bootstrapping, clearAccessToken, meQuery.isError, meQuery.isFetching, meQuery.isLoading, options?.redirectToLogin, pathname, router])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      // ignore server logout errors
    } finally {
      clearAccessToken()
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY })
      await removeRefreshTokenCookie()
      router.replace(Routers.LOGIN)
    }
  }, [clearAccessToken, queryClient, router])

  const isAuthenticated = useMemo(() => !!meQuery.data, [meQuery.data])
  const isLoading = bootstrapping || meQuery.isLoading || meQuery.isFetching

  return {
    user: meQuery.data ?? null,
    isAuthenticated,
    isLoading,
    refetchUser: meQuery.refetch,
    logout,
  }
}
