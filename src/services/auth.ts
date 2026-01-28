import type { LoginRequest, LoginResponse } from '@/schemas/auth/login'
import { type RegisterRequest } from '@/schemas/auth/register'
import type { User } from '@/schemas/user/user'
import { http, setIsLoggingOut } from '@/lib/http'
import { type IBackendRes } from '@/types/glubal'
import { ChangePasswordRequest } from '@/types/auth'
import { removeRefreshTokenCookie } from '@/lib/refresh-token-client'
import { useAuthStore } from '@/store/auth'

const AUTH_PATH = '/auth'
const USER_PATH = '/users'

export const authService = {
  login: (payload: LoginRequest) =>
    http.post<IBackendRes<LoginResponse>>(`${AUTH_PATH}/login`, payload),
  register: (payload: RegisterRequest) =>
    http.post<IBackendRes<unknown>>(`${AUTH_PATH}/register`, payload),
  me: () => http.get<IBackendRes<User>>(`${USER_PATH}/me`),
  logout: async () => {
    setIsLoggingOut(true)
    try {
      await http.post<IBackendRes<unknown>>(`${AUTH_PATH}/logout`)
    } finally {
      useAuthStore.getState().clear()
      await removeRefreshTokenCookie()
      setIsLoggingOut(false) // Reset after done (though usually we redirect)
    }
  },
  changePassword: (payload: ChangePasswordRequest) =>
    http.post<IBackendRes<unknown>>(`${AUTH_PATH}/change-password`, payload),
}
