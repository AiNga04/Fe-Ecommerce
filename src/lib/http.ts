import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { removeRefreshTokenCookie, persistRefreshTokenCookie } from '@/lib/refresh-token-client'
import { getAccessToken, setAccessToken, useAuthStore } from '@/store/auth'
import { useLoadingStore } from '@/store/loading'

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

let isLoggingOut = false

export const setIsLoggingOut = (value: boolean) => {
  isLoggingOut = value
}

const processQueue = (token: string | null) => {
  pendingQueue.forEach((callback) => callback(token))
  pendingQueue = []
}

export const refreshAccessToken = async () => {
  // If we are logging out, don't attempt to refresh
  if (isLoggingOut) return null

  isRefreshing = true
  try {
    const res = await refreshClient.post<{
      data?: { accessToken?: string; refreshToken?: string }
    }>('/auth/refresh')

    const newToken = res.data?.data?.accessToken ?? null
    const newRefreshToken = res.data?.data?.refreshToken ?? null

    // store access token in memory
    setAccessToken(newToken ?? undefined)

    // if backend returned a refresh token, persist it to cookie via client helper
    if (newRefreshToken) {
      // best-effort: don't block on failures
      try {
        await persistRefreshTokenCookie(newRefreshToken)
      } catch (err) {
        // ignore cookie persist errors; token in memory is available
        console.warn('[http] failed to persist refresh token cookie', err)
      }
    }

    return newToken
  } catch (error) {
    setAccessToken(undefined)
    return null
  } finally {
    isRefreshing = false
  }
}

http.interceptors.request.use(
  (config) => {
    // Start loading (except specifically ignored calls if needed, but for now apply all)
    useLoadingStore.getState().startLoading()

    const token = getAccessToken()

    if (token) {
      const headers = config.headers ?? {}
      if (typeof (headers as any).set === 'function') {
        ;(headers as any).set('Authorization', `Bearer ${token}`)
      } else {
        config.headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        } as any
      }
    }

    return config
  },
  (error) => {
    useLoadingStore.getState().stopLoading()
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading()
    return response
  },
  async (error: AxiosError) => {
    useLoadingStore.getState().stopLoading()

    // If logging out, ignore 401s to prevent refresh attempts
    if (isLoggingOut) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (token) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              } as any
              resolve(http(originalRequest))
            } else {
              reject(error)
            }
          })
        })
      }

      const newToken = await refreshAccessToken()
      processQueue(newToken)

      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        } as any
        return http(originalRequest)
      }

      useAuthStore.getState().clear()
      void removeRefreshTokenCookie()
    }

    return Promise.reject(error)
  },
)
