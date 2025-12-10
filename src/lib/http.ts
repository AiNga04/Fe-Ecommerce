import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { removeRefreshTokenCookie } from '@/lib/refresh-token-client'
import { getAccessToken, setAccessToken, useAuthStore } from '@/store/auth'

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

const processQueue = (token: string | null) => {
  pendingQueue.forEach((callback) => callback(token))
  pendingQueue = []
}

export const refreshAccessToken = async () => {
  isRefreshing = true
  try {
    const res = await refreshClient.post<{ data?: { accessToken: string } }>('/auth/refresh')
    const newToken = res.data?.data?.accessToken ?? null
    setAccessToken(newToken ?? undefined)
    return newToken
  } catch (error) {
    setAccessToken(undefined)
    return null
  } finally {
    isRefreshing = false
  }
}

http.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    const headers = config.headers ?? {}
    if (typeof (headers as any).set === 'function') {
      ;(headers as any).set('Authorization', `Bearer ${token}`)
    } else {
      config.headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
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
              }
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
        }
        return http(originalRequest)
      }

      useAuthStore.getState().clear()
      void removeRefreshTokenCookie()
    }

    return Promise.reject(error)
  },
)
